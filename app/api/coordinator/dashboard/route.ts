import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const role = user?.app_metadata?.role;
    if (!user || (role !== "coordinator" && role !== "admin" && role !== "super_admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch coordinator assignments
    const { data: assignments } = await supabase
      .from("coordinator_assignments")
      .select("*, patients(*)")
      .eq("is_active", true);

    // Fetch active safety cases
    const { data: activeCases } = await supabase
      .from("safety_cases")
      .select("*, patients(id, full_name, country)")
      .in("status", ["open", "in_progress", "acknowledged"]);

    // Fetch recent check-ins
    const { data: recentCheckIns } = await supabase
      .from("safety_check_ins")
      .select("*, patients(id, full_name)")
      .order("created_at", { ascending: false })
      .limit(10);

    return NextResponse.json({
      total_assigned_patients: assignments?.length || 0,
      active_safety_cases: activeCases?.length || 0,
      assigned_patients: assignments || [],
      active_cases: activeCases || [],
      recent_check_ins: recentCheckIns || []
    });
  } catch (error) {
    console.error("Error fetching coordinator dashboard:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
