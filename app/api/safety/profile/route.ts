import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

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

    const { data, error } = await supabase
      .from("patient_safety_profiles")
      .select("*")
      .eq("patient_id", resolvedPatientId)
      .single();

    if (error) {
      // If no profile exists, return null (not an error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ data: null });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching safety profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
