import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patient_id");

    // Server-side ownership check
    if (patientId && patientId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Use the get_coordinator_verification function to get verified coordinator info
    const { data, error } = await supabase
      .rpc("get_coordinator_verification", { patient_uuid: user.id });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no coordinator found, return null
    if (!data || data.length === 0) {
      return NextResponse.json({ data: null });
    }

    return NextResponse.json({ data: data[0] });
  } catch (error) {
    console.error("Error fetching coordinator verification:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
