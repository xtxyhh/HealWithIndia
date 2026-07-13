import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { RiskAssessor } from "@/lib/monitoring/riskAssessor";

// Patient-safe DTO - filters internal monitoring data
interface PatientSafeRiskResponse {
  risk_level: 'normal' | 'watch' | 'elevated' | 'high' | 'critical';
  patient_safe_status: string;
  explanation: string;
  recommended_actions: string[];
  evaluated_at: string;
}

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

    // Fetch active signals for internal processing only
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
      const patientSafeResponse: PatientSafeRiskResponse = {
        risk_level: 'normal',
        patient_safe_status: 'Journey on track',
        explanation: 'Your journey is on track with regular check-ins.',
        recommended_actions: [],
        evaluated_at: new Date().toISOString()
      };

      return NextResponse.json(patientSafeResponse);
    }

    // Generate patient-safe status and recommendations using internal signals
    const signals = activeSignals?.map(s => ({
      ...s,
      patient_id: resolvedPatientId
    })) || [];

    const patientSafeStatus = RiskAssessor.getPatientSafeStatus(riskAssessment.risk_level, signals);
    const recommendedActions = RiskAssessor.getRecommendedActions(riskAssessment.risk_level, signals);

    // Return only patient-safe data - filter out internal metadata
    const patientSafeResponse: PatientSafeRiskResponse = {
      risk_level: riskAssessment.risk_level,
      patient_safe_status: patientSafeStatus,
      explanation: riskAssessment.explanation,
      recommended_actions: recommendedActions,
      evaluated_at: riskAssessment.evaluated_at
    };

    return NextResponse.json(patientSafeResponse);
  } catch (error) {
    console.error("Error fetching risk assessment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
