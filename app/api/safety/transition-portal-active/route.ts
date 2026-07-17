import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { createServiceRoleClient } = await import("@/lib/supabaseServer");
    const serviceSupabase = createServiceRoleClient();

    // Update portal access status to ACTIVE if currently INVITE_PENDING
    const { error } = await serviceSupabase
      .from("patient_auth_mapping")
      .update({
        portal_access_status: "ACTIVE"
      })
      .eq("auth_user_id", user.id)
      .eq("portal_access_status", "INVITE_PENDING");

    if (error) {
      console.error("Error transitioning portal status:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in transition endpoint:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
