import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { calculateProtectionStatus } from "@/lib/safety/protection-status";
import { calculateRecommendation, getChecklistItemLabel } from "@/lib/safety/protection-recommendations";

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

    // Fetch safety profile
    const { data: safetyProfile } = await supabase
      .from("patient_safety_profiles")
      .select("*")
      .eq("patient_id", resolvedPatientId)
      .single();

    // Fetch checklist
    const { data: checklist } = await supabase
      .from("journey_safety_checklist")
      .select("*")
      .eq("patient_id", resolvedPatientId);

    // Fetch coordinator verification
    const { data: coordinatorData } = await supabase
      .rpc("get_coordinator_verification_by_auth", { auth_user_uuid: user.id });

    // Fetch active safety cases
    const { data: safetyCases } = await supabase
      .from("safety_cases")
      .select("priority, status")
      .eq("patient_id", resolvedPatientId)
      .in("status", ["open", "acknowledged", "in_progress"]);

    // Fetch latest check-in
    const { data: latestCheckIn } = await supabase
      .from("safety_check_ins")
      .select("*")
      .eq("patient_id", resolvedPatientId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Fetch risk assessment
    const { data: riskAssessment } = await supabase
      .from("risk_assessments")
      .select("risk_level")
      .eq("patient_id", resolvedPatientId)
      .eq("is_current", true)
      .single();

    // Calculate checklist completion
    const completedItems = checklist?.filter(item => item.is_completed).length || 0;
    const totalItems = checklist?.length || 0;
    const checklistCompletion = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    // Count active cases by priority
    const activeCases = {
      critical: safetyCases?.filter(c => c.priority === "critical").length || 0,
      high: safetyCases?.filter(c => c.priority === "high").length || 0,
      medium: safetyCases?.filter(c => c.priority === "medium").length || 0,
      low: safetyCases?.filter(c => c.priority === "low").length || 0,
    };

    // Calculate protection status
    let protectionStatus: any = null;
    const dbStatus = safetyProfile?.protection_status;

    if (dbStatus && ["ACTIVE", "SUSPENDED", "COMPLETED"].includes(dbStatus)) {
      protectionStatus = {
        status: dbStatus,
        label: dbStatus === "ACTIVE" ? "Protection Active" : dbStatus === "SUSPENDED" ? "Protection Suspended" : "Journey Completed",
        description: dbStatus === "ACTIVE" 
          ? "Your protection journey is active. All systems operational." 
          : dbStatus === "SUSPENDED" 
            ? "Your tourist protection is currently suspended." 
            : "Your medical tourism journey was successfully completed.",
        color: dbStatus === "ACTIVE" ? "green" : dbStatus === "SUSPENDED" ? "red" : "cyan",
        urgency: "low",
      };
    } else {
      protectionStatus = calculateProtectionStatus({
        hasSafetyProfile: !!safetyProfile,
        journeyStage: safetyProfile?.journey_stage || null,
        checklistCompletion,
        hasVerifiedCoordinator: !!coordinatorData && coordinatorData.length > 0,
        activeCases,
        latestCheckIn: {
          status: latestCheckIn?.status || null,
          type: latestCheckIn?.check_in_type || null,
          createdAt: latestCheckIn?.created_at || null,
        },
        riskLevel: riskAssessment?.risk_level || null,
      });
    }

    // Calculate recommendation
    const incompleteItems = checklist
      ?.filter(item => !item.is_completed)
      .map(item => getChecklistItemLabel(item.item_type)) || [];

    const recommendation = calculateRecommendation({
      protectionStatus: protectionStatus.status,
      checklistCompletion,
      incompleteChecklistItems: incompleteItems,
      hasVerifiedCoordinator: !!coordinatorData && coordinatorData.length > 0,
      activeCases: safetyCases?.length || 0,
      latestCheckIn: {
        status: latestCheckIn?.status || null,
        createdAt: latestCheckIn?.created_at || null,
      },
      journeyStage: safetyProfile?.journey_stage || null,
    });

    return NextResponse.json({
      protectionStatus,
      latestCheckIn: latestCheckIn ? {
        status: latestCheckIn.status,
        createdAt: latestCheckIn.created_at,
      } : null,
      checklistProgress: {
        completed: completedItems,
        total: totalItems,
      },
      coordinatorStatus: {
        verified: !!coordinatorData && coordinatorData.length > 0,
        name: coordinatorData?.[0]?.full_name || null,
      },
      activeAssistance: {
        hasActive: (activeCases.critical + activeCases.high + activeCases.medium + activeCases.low) > 0,
        count: activeCases.critical + activeCases.high + activeCases.medium + activeCases.low,
      },
      recommendation,
    });
  } catch (error) {
    console.error("Error calculating protection status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
