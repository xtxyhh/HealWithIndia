import { SupabaseClient } from "@supabase/supabase-js";

const MAX_PAGE_SIZE = 50;
const DEFAULT_PAGE_SIZE = 20;

export interface MonitoringOverview {
  active_monitored_journeys: number;
  risk_levels: {
    normal: number;
    watch: number;
    elevated: number;
    high: number;
    critical: number;
  };
  open_incidents: number;
  unacknowledged_incidents: number;
  overdue_check_ins: number;
  response_delays: number;
}

export interface MonitoringData {
  overview: MonitoringOverview;
  signals: unknown[];
  risk_assessments: unknown[];
  cases: unknown[];
  evaluations: unknown[];
  pagination: {
    page: number;
    page_size: number;
    total_signals: number;
    total_risk_assessments: number;
    total_cases: number;
    has_more_signals: boolean;
    has_more_risk_assessments: boolean;
    has_more_cases: boolean;
  };
  error?: string;
}

export async function fetchMonitoringData(
  supabase: SupabaseClient,
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<MonitoringData> {
  const clampedPageSize = Math.min(Math.max(pageSize, 1), MAX_PAGE_SIZE);
  const offset = (page - 1) * clampedPageSize;

  // Fetch active monitoring signals with pagination
  const { data: activeSignals, error: signalsError, count: signalsCount } =
    await supabase
      .from("monitoring_signals")
      .select("*", { count: "exact" })
      .eq("status", "active")
      .order("detected_at", { ascending: false })
      .range(offset, offset + clampedPageSize - 1);

  // Fetch current risk assessments with pagination
  const {
    data: riskAssessments,
    error: riskError,
    count: riskCount,
  } = await supabase
    .from("risk_assessments")
    .select("*", { count: "exact" })
    .eq("is_current", true)
    .order("evaluated_at", { ascending: false })
    .range(offset, offset + clampedPageSize - 1);

  // Fetch safety cases with patient info for incident queue with pagination
  const {
    data: safetyCases,
    error: casesError,
    count: casesCount,
  } = await supabase
    .from("safety_cases")
    .select(
      `
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
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + clampedPageSize - 1);

  // Fetch recent monitoring evaluations (limited, no pagination needed)
  const { data: evaluations, error: evalError } = await supabase
    .from("monitoring_evaluations")
    .select("*")
    .order("evaluated_at", { ascending: false })
    .limit(10);

  if (signalsError || riskError || casesError || evalError) {
    const errMsg = [
      signalsError?.message,
      riskError?.message,
      casesError?.message,
      evalError?.message,
    ]
      .filter(Boolean)
      .join("; ");

    return {
      overview: {
        active_monitored_journeys: 0,
        risk_levels: { normal: 0, watch: 0, elevated: 0, high: 0, critical: 0 },
        open_incidents: 0,
        unacknowledged_incidents: 0,
        overdue_check_ins: 0,
        response_delays: 0,
      },
      signals: [],
      risk_assessments: [],
      cases: [],
      evaluations: [],
      pagination: {
        page,
        page_size: clampedPageSize,
        total_signals: 0,
        total_risk_assessments: 0,
        total_cases: 0,
        has_more_signals: false,
        has_more_risk_assessments: false,
        has_more_cases: false,
      },
      error: errMsg,
    };
  }

  // Calculate overview statistics
  const riskLevelCounts = {
    normal: 0,
    watch: 0,
    elevated: 0,
    high: 0,
    critical: 0,
  };

  riskAssessments?.forEach((assessment) => {
    const level = assessment.risk_level as keyof typeof riskLevelCounts;
    if (level in riskLevelCounts) riskLevelCounts[level]++;
  });

  const activeCases =
    safetyCases?.filter(
      (c) => c.status !== "closed" && c.status !== "resolved"
    ) || [];
  const unacknowledgedCases = activeCases.filter(
    (c) => c.status === "open" || c.response_state === "detected"
  );

  const overdueCheckIns =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    activeSignals?.filter((s: any) => s.signal_type === "check_in_overdue")
      ?.length || 0;
  const responseDelays =
    activeSignals?.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (s: any) => s.signal_type === "critical_case_response_delay"
    )?.length || 0;

  return {
    overview: {
      active_monitored_journeys: riskAssessments?.length || 0,
      risk_levels: riskLevelCounts,
      open_incidents: activeCases.length,
      unacknowledged_incidents: unacknowledgedCases.length,
      overdue_check_ins: overdueCheckIns,
      response_delays: responseDelays,
    },
    pagination: {
      page,
      page_size: clampedPageSize,
      total_signals: signalsCount || 0,
      total_risk_assessments: riskCount || 0,
      total_cases: casesCount || 0,
      has_more_signals: (signalsCount || 0) > offset + clampedPageSize,
      has_more_risk_assessments: (riskCount || 0) > offset + clampedPageSize,
      has_more_cases: (casesCount || 0) > offset + clampedPageSize,
    },
    signals: activeSignals || [],
    risk_assessments: riskAssessments || [],
    cases: safetyCases || [],
    evaluations: evaluations || [],
  };
}
