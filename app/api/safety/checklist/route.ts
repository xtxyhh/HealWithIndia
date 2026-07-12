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

    // Resolve patient ID from auth mapping
    const { data: resolvedPatientId } = await supabase
      .rpc("get_patient_id_from_auth", { auth_user_uuid: user.id });

    if (!resolvedPatientId) {
      return NextResponse.json({ error: "Patient mapping not found" }, { status: 404 });
    }

    // Server-side ownership check
    if (patientId && patientId !== resolvedPatientId.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("journey_safety_checklist")
      .select("*")
      .eq("patient_id", resolvedPatientId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching checklist:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { item_type, is_completed, notes } = body;

    // Validate required fields
    if (!item_type) {
      return NextResponse.json({ error: "Missing item_type" }, { status: 400 });
    }

    // Validate item_type
    const validTypes = [
      "passport_visa",
      "hospital_confirmed",
      "coordinator_verified",
      "pickup_confirmed",
      "accommodation_confirmed",
      "emergency_contacts",
      "treatment_documents",
      "discharge_plan",
      "follow_up_instructions"
    ];

    if (!validTypes.includes(item_type)) {
      return NextResponse.json({ error: "Invalid item_type" }, { status: 400 });
    }

    // Resolve patient ID from auth mapping
    const { data: resolvedPatientId } = await supabase
      .rpc("get_patient_id_from_auth", { auth_user_uuid: user.id });

    if (!resolvedPatientId) {
      return NextResponse.json({ error: "Patient mapping not found" }, { status: 404 });
    }

    // Server-side ownership check - upsert based on patient_id and item_type
    const { data, error } = await supabase
      .from("journey_safety_checklist")
      .upsert({
        patient_id: resolvedPatientId,
        item_type,
        is_completed: is_completed !== undefined ? is_completed : true,
        completed_at: is_completed ? new Date().toISOString() : null,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Error updating checklist:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
