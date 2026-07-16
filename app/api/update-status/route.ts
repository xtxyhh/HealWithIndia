import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { createServiceRoleClient } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    // Verify caller is authenticated
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify authorized role (admin, coordinator, reception can update patient status)
    const callerRole = user?.app_metadata?.role;
    const allowedRoles = ["admin", "super_admin", "coordinator", "reception"];
    if (!allowedRoles.includes(callerRole)) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient privileges" },
        { status: 403 }
      );
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 }
      );
    }

    // Use service role for the update operation
    const serviceSupabase = createServiceRoleClient();
    const { error } = await serviceSupabase
      .from("patients")
      .update({ status })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in update-status endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}