import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { createServiceRoleClient } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    // Verify caller is authenticated and has admin role
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role (admin, super_admin, or safety_operator for protection management)
    const userRole = user?.app_metadata?.role;
    
    if (userRole !== 'admin' && userRole !== 'super_admin' && userRole !== 'safety_operator') {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { patient_id, action } = body;

    if (!patient_id || !action) {
      return NextResponse.json({ error: "patient_id and action are required" }, { status: 400 });
    }

    const serviceSupabase = createServiceRoleClient();

    if (action === "activate") {
      // Activate Smart Tourist Protection
      const { error } = await serviceSupabase.rpc("activate_patient_protection", {
        target_patient_id: patient_id
      });

      if (error) {
        console.error("Error activating protection:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ 
        message: "Smart Tourist Protection activated successfully",
        protection_status: "ACTIVE"
      });
    }

    if (action === "suspend") {
      // Suspend protection
      const { error } = await serviceSupabase
        .from("patient_safety_profiles")
        .update({
          protection_status: "SUSPENDED",
          protection_suspended_at: new Date().toISOString()
        })
        .eq("patient_id", patient_id);

      if (error) {
        console.error("Error suspending protection:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ 
        message: "Protection suspended successfully",
        protection_status: "SUSPENDED"
      });
    }

    if (action === "complete") {
      // Complete journey
      const { error } = await serviceSupabase
        .from("patient_safety_profiles")
        .update({
          protection_status: "COMPLETED",
          protection_completed_at: new Date().toISOString()
        })
        .eq("patient_id", patient_id);

      if (error) {
        console.error("Error completing protection:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ 
        message: "Journey completed successfully",
        protection_status: "COMPLETED"
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Error in protection endpoint:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patient_id = searchParams.get("patient_id");

    if (!patient_id) {
      return NextResponse.json({ error: "patient_id is required" }, { status: 400 });
    }

    const serviceSupabase = createServiceRoleClient();

    const { data, error } = await serviceSupabase
      .from("patient_safety_profiles")
      .select("*")
      .eq("patient_id", patient_id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ 
          protection_status: "NOT_ACTIVATED",
          has_profile: false
        });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      protection_status: data.protection_status,
      protection_activated_at: data.protection_activated_at,
      protection_completed_at: data.protection_completed_at,
      protection_suspended_at: data.protection_suspended_at,
      has_profile: true
    });

  } catch (error) {
    console.error("Error getting protection status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
