import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { RiskAssessor } from "@/lib/monitoring/riskAssessor";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Resolve patient ID from auth mapping
    const { data: resolvedPatientId } = await supabase
      .rpc("get_patient_id_from_auth", { auth_user_uuid: user.id });

    if (!resolvedPatientId) {
      return NextResponse.json({ error: "Patient mapping not found" }, { status: 404 });
    }

    // Fetch current risk assessment
    const { data: riskAssessment, error: riskError } = await supabase
      .from("risk_assessments")
      .select("*")
      .eq("patient_id", resolvedPatientId)
      .eq("is_current", true)
      .single();

    if (riskError && riskError.code !== 'PGRST116') {
      return NextResponse.json({ error: riskError.message }, { status: 500 });
    }

    // Fetch active signals
    const { data: activeSignals, error: signalsError } = await supabase
      .from("monitoring_signals")
      .select("*")
      .eq("patient_id", resolvedPatientId)
      .eq("status", "active")
      .order("detected_at", { ascending: false });

    if (signalsError) {
      return NextResponse.json({ error: signalsError.message }, { status: 500 });
    }

    // If no risk assessment exists, create a default normal assessment
    if (!riskAssessment) {
      const defaultAssessment = {
        patient_id: resolvedPatientId,
        risk_level: 'normal',
        explanation: 'Your journey is on track with regular check-ins.',
        contributing_signal_ids: [],
        rule_ids: [],
        evaluated_at: new Date().toISOString(),
        is_current: true
      };

      return NextResponse.json({
        risk_assessment: defaultAssessment,
        active_signals: activeSignals || [],
        patient_safe_status: 'Journey on track',
        recommended_actions: []
      });
    }

    // Generate patient-safe status and recommendations
    const signals = activeSignals?.map(s => ({
      ...s,
      patient_id: resolvedPatientId // Ensure patient_id is present for RiskAssessor
    })) || [];

    const patientSafeStatus = RiskAssessor.getPatientSafeStatus(riskAssessment.risk_level, signals);
    const recommendedActions = RiskAssessor.getRecommendedActions(riskAssessment.risk_level, signals);

    return NextResponse.json({
      risk_assessment: riskAssessment,
      active_signals: activeSignals || [],
      patient_safe_status: patientSafeStatus,
      recommended_actions: recommendedActions
    });
  } catch (error) {
    console.error("Error fetching risk assessment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
