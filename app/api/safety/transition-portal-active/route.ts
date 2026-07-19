import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let user: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let userError: any = null;

    const supabase = await createClient();

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const { data: { user: jwtUser }, error: jwtError } = await supabase.auth.getUser(token);
      user = jwtUser;
      userError = jwtError;
    } else {
      const { data: { user: cookieUser }, error: cookieError } = await supabase.auth.getUser();
      user = cookieUser;
      userError = cookieError;
    }

    if (userError || !user) {
      return NextResponse.json({ error: userError?.message || "Unauthorized" }, { status: 401 });
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in transition endpoint:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
