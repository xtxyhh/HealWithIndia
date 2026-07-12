import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { SignalDetector } from "@/lib/monitoring/signalDetector";
import { RiskAssessor } from "@/lib/monitoring/riskAssessor";
import { IncidentEscalator } from "@/lib/monitoring/incidentEscalation";

export async function POST(request: NextRequest) {
  try {
    // Verify monitoring secret for security
    const authHeader = request.headers.get('authorization');
    const monitoringSecret = process.env.MONITORING_SECRET;
    
    if (!authHeader || authHeader !== `Bearer ${monitoringSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();
    const startTime = Date.now();

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
        const { error: insertError } = await supabase
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
          });

        if (!insertError) {
          signalsDetected++;
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
        const { error: riskError } = await supabase
          .from("risk_assessments")
          .insert({
            patient_id: riskAssessment.patient_id,
            risk_level: riskAssessment.risk_level,
            contributing_signal_ids: riskAssessment.contributing_signal_ids,
            rule_ids: riskAssessment.rule_ids,
            evaluated_at: riskAssessment.evaluated_at.toISOString(),
            is_current: true
          });

        if (!riskError) {
          riskAssessmentsUpdated++;
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
            const { error: createError } = await supabase
              .from("safety_cases")
              .insert({
                patient_id: action.patient_id,
                category: action.category,
                priority: action.priority,
                status: 'open',
                description: action.description,
                response_state: 'detected'
              });

            if (!createError) {
              casesCreated++;
            }
          }
        } else if (action.action_type === 'escalate_priority' && action.case_id) {
          const { error: escalateError } = await supabase
            .from("safety_cases")
            .update({ priority: action.priority })
            .eq("id", action.case_id);

          if (!escalateError) {
            casesEscalated++;
          }
        }
      }
    }

    const executionDuration = Date.now() - startTime;

    // Record evaluation
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
        triggered_by: 'scheduled'
      });

    return NextResponse.json({
      success: true,
      signals_detected: signalsDetected,
      signals_resolved: signalsResolved,
      risk_assessments_updated: riskAssessmentsUpdated,
      cases_created: casesCreated,
      cases_escalated: casesEscalated,
      execution_duration_ms: executionDuration
    });
  } catch (error) {
    console.error("Monitoring evaluation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
