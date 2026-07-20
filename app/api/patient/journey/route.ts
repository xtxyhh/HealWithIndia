import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

const ALL_STAGES = [
  "Inquiry", "Lead", "Review", "Coordinator Assigned", "Medical Reports",
  "Hospital", "Doctor", "Treatment Plan", "Quote", "Invoice",
  "Payment", "Visa", "Travel", "Arrival", "Treatment",
  "Recovery", "Follow-up", "Completed"
];

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: patientId } = await supabase.rpc("get_patient_id_from_auth", { auth_user_uuid: user.id });

    if (!patientId) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const { data: stages } = await supabase
      .from("patient_journey_stages")
      .select("*")
      .eq("patient_id", patientId)
      .order("updated_at", { ascending: true });

    return NextResponse.json({ stages: stages || [], all_stages: ALL_STAGES });
  } catch (error) {
    console.error("Error fetching journey:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: patientId } = await supabase.rpc("get_patient_id_from_auth", { auth_user_uuid: user.id });

    if (!patientId) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const body = await request.json();
    const { stage, status, notes } = body;

    if (!stage || !ALL_STAGES.includes(stage)) {
      return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("patient_journey_stages")
      .upsert({
        patient_id: patientId,
        stage,
        status: status || "completed",
        notes: notes || `Stage ${stage} updated`,
        updated_by: user.email || "patient",
        updated_at: new Date().toISOString()
      }, { onConflict: "patient_id,stage" })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error updating journey stage:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
