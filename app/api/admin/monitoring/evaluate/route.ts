import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { SignalDetector } from "@/lib/monitoring/signalDetector";
import { RiskAssessor } from "@/lib/monitoring/riskAssessor";
import { IncidentEscalator } from "@/lib/monitoring/incidentEscalation";

// Use timing-safe comparison for secret validation
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function POST(request: NextRequest) {
  try {
    // Fail closed if CRON_SECRET is not configured (Vercel Cron native authentication)
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret || cronSecret.length < 32) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Verify Vercel Cron CRON_SECRET for security
    const authHeader = request.headers.get('authorization');
    
    // Reject missing or malformed authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const providedSecret = authHeader.substring(7);
    
    // Validate secret length before comparison
    if (!providedSecret || providedSecret.length < 32) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Use timing-safe comparison to prevent timing attacks
    if (!timingSafeEqual(providedSecret, cronSecret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Reject secret via query string (security requirement)
    const { searchParams } = new URL(request.url);
    if (searchParams.has('secret') || searchParams.has('token') || searchParams.has('key')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();
    const startTime = Date.now();

    // Prevent overlapping evaluations using advisory lock pattern
    const evaluationId = crypto.randomUUID();
    const lockKey = `monitoring_evaluation_lock`;
    const lockTimeout = 10 * 60 * 1000; // 10 minutes

    // Check for recent running evaluation (simple overlap prevention)
    const { data: recentEvaluations } = await supabase
      .from("monitoring_evaluations")
      .select("evaluated_at")
      .order("evaluated_at", { ascending: false })
      .limit(1);

    if (recentEvaluations && recentEvaluations.length > 0) {
      const lastEvalTime = new Date(recentEvaluations[0].evaluated_at).getTime();
      const timeSinceLastEval = Date.now() - lastEvalTime;
      
      // Reject if evaluation ran within last 2 minutes (prevent overlap)
      if (timeSinceLastEval < 2 * 60 * 1000) {
        return NextResponse.json({ 
          error: "Evaluation already in progress",
          retry_after: Math.ceil((2 * 60 * 1000 - timeSinceLastEval) / 1000)
        }, { status: 429 });
      }
    }

    // Fetch all patients with active safety profiles
    const { data: activeProfiles, error: profilesError } = await supabase
      .from("patient_safety_profiles")
      .select("patient_id, journey_stage, estimated_arrival_date")
      .in("journey_stage", ["travel_confirmed", "arrived", "treatment_in_progress"]);

    if (profilesError) {
      return NextResponse.json({ error: profilesError.message }, { status: 500 });
    }

    let signalsDetected = 0;
    let signalsResolved = 0;
    let riskAssessmentsUpdated = 0;
    let casesCreated = 0;
    let casesEscalated = 0;

    for (const profile of activeProfiles || []) {
      const patientId = profile.patient_id;

      // Fetch existing active signals
      const { data: existingSignals } = await supabase
        .from("monitoring_signals")
        .select("*")
        .eq("patient_id", patientId)
        .eq("status", "active");

      // Fetch check-ins
      const { data: checkIns } = await supabase
        .from("safety_check_ins")
        .select("*")
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false })
        .limit(10);

      // Fetch safety cases
      const { data: safetyCases } = await supabase
        .from("safety_cases")
        .select("*")
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false })
        .limit(10);

      // Fetch fraud reports
      const { data: fraudReports } = await supabase
        .from("fraud_reports")
        .select("*")
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false })
        .limit(10);

      // Fetch coordinator assignment
      const { data: coordinatorData } = await supabase
        .rpc("get_coordinator_verification_by_auth", { 
          // Need to get auth user ID first
          auth_user_uuid: null 
        });

      // Detect new signals
      const newSignals: any[] = [];

      // Detect check-in signals
      if (checkIns && checkIns.length > 0) {
        const latestCheckIn = checkIns[0];
        const checkInSignals = SignalDetector.detectCheckInSignals(
          patientId,
          latestCheckIn.check_in_type,
          latestCheckIn.status,
          new Date(latestCheckIn.created_at)
        );
        checkInSignals.forEach(s => {
          s.source_entity_id = latestCheckIn.id;
          s.source_entity_type = 'safety_check_in';
          s.status = 'active';
        });
        newSignals.push(...checkInSignals);
      }

      // Detect case signals
      if (safetyCases) {
        safetyCases.forEach(c => {
          const caseSignals = SignalDetector.detectCaseSignals(
            patientId,
            c.category,
            c.priority,
            c.status,
            new Date(c.created_at)
          );
          caseSignals.forEach(s => {
            s.source_entity_id = c.id;
            s.source_entity_type = 'safety_case';
            s.status = 'active';
          });
          newSignals.push(...caseSignals);
        });
      }

      // Detect fraud signals
      if (fraudReports) {
        fraudReports.forEach(f => {
          const fraudSignals = SignalDetector.detectFraudSignals(
            patientId,
            f.report_type,
            f.status
          );
          fraudSignals.forEach(s => {
            s.source_entity_id = f.id;
            s.source_entity_type = 'fraud_report';
            s.status = 'active';
          });
          newSignals.push(...fraudSignals);
        });
      }

      // Detect correlated signals
      const allSignals = [...(existingSignals || []), ...newSignals];
      const correlatedSignals = SignalDetector.detectCorrelatedSignals(patientId, allSignals);
      correlatedSignals.forEach(s => {
        s.status = 'active';
      });
      newSignals.push(...correlatedSignals);

      // Filter out suppressed signals
      const filteredSignals = newSignals.filter(s => 
        !IncidentEscalator.shouldSuppressSignal(s, existingSignals || [])
      );

      // Insert new signals
      for (const signal of filteredSignals) {
        const { data: insertedSignal, error: insertError } = await supabase
          .from("monitoring_signals")
          .insert({
            patient_id: signal.patient_id,
            signal_type: signal.signal_type,
            severity: signal.severity,
            source: signal.source,
            source_entity_id: signal.source_entity_id,
            source_entity_type: signal.source_entity_type,
            metadata: signal.metadata,
            status: 'active'
          })
          .select()
          .single();

        if (!insertError && insertedSignal) {
          signalsDetected++;
          // Create audit event for signal creation
          await supabase.rpc('create_monitoring_audit_event', {
            p_event_type: 'signal_created',
            p_entity_type: 'monitoring_signal',
            p_entity_id: insertedSignal.id,
            p_patient_id: signal.patient_id,
            p_actor_type: 'monitoring_engine',
            p_actor_id: evaluationId,
            p_context: {
              signal_type: signal.signal_type,
              severity: signal.severity,
              source: signal.source
            }
          });
        }
      }

      // Resolve outdated signals
      const resolvedSignalIds: string[] = [];
      for (const existingSignal of existingSignals || []) {
        const stillActive = filteredSignals.some(s => 
          s.signal_type === existingSignal.signal_type &&
          s.source_entity_id === existingSignal.source_entity_id
        );

        if (!stillActive) {
          const { error: updateError } = await supabase
            .from("monitoring_signals")
            .update({ 
              status: 'resolved', 
              resolved_at: new Date().toISOString() 
            })
            .eq("id", existingSignal.id);

          if (!updateError) {
            signalsResolved++;
            resolvedSignalIds.push(existingSignal.id);
            // Create audit event for signal resolution
            await supabase.rpc('create_monitoring_audit_event', {
              p_event_type: 'signal_resolved',
              p_entity_type: 'monitoring_signal',
              p_entity_id: existingSignal.id,
              p_patient_id: patientId,
              p_actor_type: 'monitoring_engine',
              p_actor_id: evaluationId,
              p_context: {
                signal_type: existingSignal.signal_type,
                reason: 'no_longer_active'
              }
            });
          }
        }
      }

      // Fetch current active signals for risk assessment
      const { data: currentActiveSignals } = await supabase
        .from("monitoring_signals")
        .select("*")
        .eq("patient_id", patientId)
        .eq("status", "active");

      // Evaluate risk
      if (currentActiveSignals && currentActiveSignals.length > 0) {
        const riskAssessment = RiskAssessor.evaluateRisk(
          patientId,
          currentActiveSignals
        );

        // Mark previous assessment as not current
        await supabase
          .from("risk_assessments")
          .update({ is_current: false })
          .eq("patient_id", patientId)
          .eq("is_current", true);

        // Insert new assessment
        const { data: insertedAssessment, error: riskError } = await supabase
          .from("risk_assessments")
          .insert({
            patient_id: riskAssessment.patient_id,
            risk_level: riskAssessment.risk_level,
            contributing_signal_ids: riskAssessment.contributing_signal_ids,
            rule_ids: riskAssessment.rule_ids,
            evaluated_at: riskAssessment.evaluated_at.toISOString(),
            is_current: true
          })
          .select()
          .single();

        if (!riskError && insertedAssessment) {
          riskAssessmentsUpdated++;
          // Create audit event for risk assessment creation
          await supabase.rpc('create_monitoring_audit_event', {
            p_event_type: 'risk_assessment_created',
            p_entity_type: 'risk_assessment',
            p_entity_id: insertedAssessment.id,
            p_patient_id: patientId,
            p_actor_type: 'monitoring_engine',
            p_actor_id: evaluationId,
            p_context: {
              risk_level: riskAssessment.risk_level,
              contributing_signals_count: riskAssessment.contributing_signal_ids.length
            }
          });
        }
      }

      // Determine escalation actions
      const escalationActions = IncidentEscalator.determineEscalationActions(
        currentActiveSignals || [],
        safetyCases || []
      );

      // Execute escalation actions
      for (const action of escalationActions) {
        if (action.action_type === 'create_case') {
          // Check for spam
          if (!IncidentEscalator.shouldSuppressCaseCreation(
            action.patient_id,
            action.category || '',
            safetyCases || []
          )) {
            const { data: insertedCase, error: createError } = await supabase
              .from("safety_cases")
              .insert({
                patient_id: action.patient_id,
                category: action.category,
                priority: action.priority,
                status: 'open',
                description: action.description,
                response_state: 'detected'
              })
              .select()
              .single();

            if (!createError && insertedCase) {
              casesCreated++;
              // Create audit event for automatic case creation
              await supabase.rpc('create_monitoring_audit_event', {
                p_event_type: 'case_auto_created',
                p_entity_type: 'safety_case',
                p_entity_id: insertedCase.id,
                p_patient_id: action.patient_id,
                p_actor_type: 'monitoring_engine',
                p_actor_id: evaluationId,
                p_context: {
                  category: action.category,
                  priority: action.priority,
                  description: action.description
                }
              });
            }
          }
        } else if (action.action_type === 'escalate_priority' && action.case_id) {
          const { error: escalateError } = await supabase
            .from("safety_cases")
            .update({ priority: action.priority })
            .eq("id", action.case_id);

          if (!escalateError) {
            casesEscalated++;
            // Create audit event for case priority escalation
            await supabase.rpc('create_monitoring_audit_event', {
              p_event_type: 'case_auto_escalated',
              p_entity_type: 'safety_case',
              p_entity_id: action.case_id,
              p_patient_id: patientId,
              p_actor_type: 'monitoring_engine',
              p_actor_id: evaluationId,
              p_context: {
                new_priority: action.priority,
                previous_priority: action.metadata?.previous_priority
              }
            });
          }
        }
      }
    }

    const executionDuration = Date.now() - startTime;

    // Create audit event for evaluation completion
    await supabase.rpc('create_monitoring_audit_event', {
      p_event_type: 'evaluation_completed',
      p_entity_type: 'monitoring_evaluation',
      p_entity_id: null,
      p_patient_id: null,
      p_actor_type: 'monitoring_engine',
      p_actor_id: evaluationId,
      p_context: {
        signals_detected: signalsDetected,
        signals_resolved: signalsResolved,
        risk_assessments_updated: riskAssessmentsUpdated,
        cases_created: casesCreated,
        cases_escalated: casesEscalated,
        execution_duration_ms: executionDuration,
        active_profiles_count: activeProfiles?.length || 0
      }
    });

    // Record evaluation with evaluation ID for audit traceability
    await supabase
      .from("monitoring_evaluations")
      .insert({
        evaluated_at: new Date().toISOString(),
        signals_detected: signalsDetected,
        signals_resolved: signalsResolved,
        risk_assessments_updated: riskAssessmentsUpdated,
        cases_created: casesCreated,
        cases_escalated: casesEscalated,
        execution_duration_ms: executionDuration,
        triggered_by: 'scheduled',
        metadata: {
          evaluation_id: evaluationId,
          active_profiles_count: activeProfiles?.length || 0
        }
      });

    return NextResponse.json({
      success: true,
      evaluation_id: evaluationId,
      signals_detected: signalsDetected,
      signals_resolved: signalsResolved,
      risk_assessments_updated: riskAssessmentsUpdated,
      cases_created: casesCreated,
      cases_escalated: casesEscalated,
      execution_duration_ms: executionDuration
    });
  } catch (error) {
    // Log error without exposing sensitive details
    console.error("Monitoring evaluation error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
