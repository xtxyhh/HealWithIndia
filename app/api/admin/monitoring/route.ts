import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Server-side authorization check - only allow authorized admins
    const appMetadata = user.app_metadata;
    const isAdmin = appMetadata?.role === "admin" || appMetadata?.role === "super_admin" || appMetadata?.role === "safety_operator";

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch active monitoring signals
    const { data: activeSignals, error: signalsError } = await supabase
      .from("monitoring_signals")
      .select("*")
      .eq("status", "active")
      .order("detected_at", { ascending: false });

    // Fetch current risk assessments
    const { data: riskAssessments, error: riskError } = await supabase
      .from("risk_assessments")
      .select("*")
      .eq("is_current", true)
      .order("evaluated_at", { ascending: false });

    // Fetch safety cases with patient info for incident queue
    const { data: safetyCases, error: casesError } = await supabase
      .from("safety_cases")
      .select(`
        id,
        category,
        priority,
        status,
        response_state,
        description,
        created_at,
        acknowledged_at,
        patient_id,
        patients (
          id,
          full_name,
          country
        ),
        patient_safety_profiles (
          journey_stage
        )
      `)
      .order("created_at", { ascending: false })
      .limit(100);

    // Fetch recent monitoring evaluations
    const { data: evaluations, error: evalError } = await supabase
      .from("monitoring_evaluations")
      .select("*")
      .order("evaluated_at", { ascending: false })
      .limit(10);

    if (signalsError || riskError || casesError || evalError) {
      return NextResponse.json({ 
        error: "Failed to load monitoring data",
        details: {
          signalsError: signalsError?.message,
          riskError: riskError?.message,
          casesError: casesError?.message,
          evalError: evalError?.message
        }
      }, { status: 500 });
    }

    // Calculate overview statistics
    const riskLevelCounts = {
      normal: 0,
      watch: 0,
      elevated: 0,
      high: 0,
      critical: 0
    };

    riskAssessments?.forEach(assessment => {
      riskLevelCounts[assessment.risk_level as keyof typeof riskLevelCounts]++;
    });

    const activeCases = safetyCases?.filter(c => c.status !== "closed" && c.status !== "resolved") || [];
    const unacknowledgedCases = activeCases.filter(c => c.status === "open" || c.response_state === "detected");
    const criticalCases = activeCases.filter(c => c.priority === "critical");
    const highPriorityCases = activeCases.filter(c => c.priority === "high");

    // Count overdue check-in signals
    const overdueCheckIns = activeSignals?.filter(s => s.signal_type === "check_in_overdue")?.length || 0;

    // Count response delay signals
    const responseDelays = activeSignals?.filter(s => s.signal_type === "critical_case_response_delay")?.length || 0;

    return NextResponse.json({
      overview: {
        active_monitored_journeys: riskAssessments?.length || 0,
        risk_levels: riskLevelCounts,
        open_incidents: activeCases.length,
        unacknowledged_incidents: unacknowledgedCases.length,
        overdue_check_ins: overdueCheckIns,
        response_delays: responseDelays
      },
      signals: activeSignals || [],
      risk_assessments: riskAssessments || [],
      cases: safetyCases || [],
      evaluations: evaluations || []
    });
  } catch (error) {
    console.error("Error fetching monitoring data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
