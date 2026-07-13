import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

const MAX_PAGE_SIZE = 50;
const DEFAULT_PAGE_SIZE = 20;

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

    const { searchParams } = new URL(request.url);
    
    // Validate and parse pagination parameters
    const pageParam = searchParams.get('page');
    const pageSizeParam = searchParams.get('page_size');
    
    let page = 1;
    let pageSize = DEFAULT_PAGE_SIZE;

    if (pageParam) {
      const parsedPage = parseInt(pageParam, 10);
      if (isNaN(parsedPage) || parsedPage < 1) {
        return NextResponse.json({ error: "Invalid page parameter" }, { status: 400 });
      }
      page = parsedPage;
    }

    if (pageSizeParam) {
      const parsedPageSize = parseInt(pageSizeParam, 10);
      if (isNaN(parsedPageSize) || parsedPageSize < 1 || parsedPageSize > MAX_PAGE_SIZE) {
        return NextResponse.json({ error: `page_size must be between 1 and ${MAX_PAGE_SIZE}` }, { status: 400 });
      }
      pageSize = parsedPageSize;
    }

    const offset = (page - 1) * pageSize;

    // Fetch active monitoring signals with pagination
    const { data: activeSignals, error: signalsError, count: signalsCount } = await supabase
      .from("monitoring_signals")
      .select("*", { count: 'exact' })
      .eq("status", "active")
      .order("detected_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    // Fetch current risk assessments with pagination
    const { data: riskAssessments, error: riskError, count: riskCount } = await supabase
      .from("risk_assessments")
      .select("*", { count: 'exact' })
      .eq("is_current", true)
      .order("evaluated_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    // Fetch safety cases with patient info for incident queue with pagination
    const { data: safetyCases, error: casesError, count: casesCount } = await supabase
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
      `, { count: 'exact' })
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    // Fetch recent monitoring evaluations (limited, no pagination needed)
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
      pagination: {
        page,
        page_size: pageSize,
        total_signals: signalsCount || 0,
        total_risk_assessments: riskCount || 0,
        total_cases: casesCount || 0,
        has_more_signals: (signalsCount || 0) > offset + pageSize,
        has_more_risk_assessments: (riskCount || 0) > offset + pageSize,
        has_more_cases: (casesCount || 0) > offset + pageSize
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
