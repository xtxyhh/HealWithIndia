import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: resolvedPatientId } = await supabase.rpc("get_patient_id_from_auth", {
      auth_user_uuid: user.id,
    });

    if (!resolvedPatientId) {
      return NextResponse.json({ error: "Patient mapping not found" }, { status: 404 });
    }

    const { data: safetyCase, error } = await supabase
      .from("safety_cases")
      .select(`
        id,
        patient_id,
        category,
        priority,
        status,
        response_state,
        description,
        assigned_coordinator_id,
        created_at,
        updated_at,
        resolved_at,
        resolution_category,
        response_operator_id,
        safety_case_events (
          id,
          event_type,
          description,
          created_by,
          created_at
        )
      `)
      .eq("id", id)
      .eq("patient_id", resolvedPatientId)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!safetyCase) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json({ data: safetyCase });
  } catch (error) {
    console.error("Error fetching safety case detail:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { note } = body;

    if (!note || typeof note !== "string" || !note.trim()) {
      return NextResponse.json({ error: "Missing note" }, { status: 400 });
    }

    const { data: resolvedPatientId } = await supabase.rpc("get_patient_id_from_auth", {
      auth_user_uuid: user.id,
    });

    if (!resolvedPatientId) {
      return NextResponse.json({ error: "Patient mapping not found" }, { status: 404 });
    }

    const { data: safetyCase, error: caseError } = await supabase
      .from("safety_cases")
      .select("id, status, patient_id")
      .eq("id", id)
      .eq("patient_id", resolvedPatientId)
      .single();

    if (caseError || !safetyCase) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const now = new Date().toISOString();

    const { error: eventError } = await supabase.from("safety_case_events").insert({
      safety_case_id: id,
      event_type: "patient_comment",
      description: note.trim(),
      created_by: user.email || "patient",
      created_at: now,
    });

    if (eventError) {
      return NextResponse.json({ error: eventError.message }, { status: 500 });
    }

    const { data: updatedCase, error: updateError } = await supabase
      .from("safety_cases")
      .update({ updated_at: now })
      .eq("id", id)
      .select("id, status, response_state, updated_at")
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ data: { case: updatedCase } });
  } catch (error) {
    console.error("Error submitting patient case note:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
