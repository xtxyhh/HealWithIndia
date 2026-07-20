import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { file_url } = body;
    if (!file_url) {
      return NextResponse.json({ error: "Missing required field: file_url" }, { status: 400 });
    }

    // Resolve patient ID from auth mapping
    const { data: resolvedPatientId } = await supabase
      .rpc("get_patient_id_from_auth", { auth_user_uuid: user.id });

    if (!resolvedPatientId) {
      return NextResponse.json({ error: "Patient mapping not found" }, { status: 404 });
    }

    const { createServiceRoleClient } = await import("@/lib/supabaseServer");
    const serviceSupabase = createServiceRoleClient();

    // 1. Fetch current patient notes
    const { data: patientData, error: fetchError } = await serviceSupabase
      .from("patients")
      .select("notes")
      .eq("id", resolvedPatientId)
      .single();

    if (fetchError || !patientData) {
      return NextResponse.json({ error: "Patient record not found" }, { status: 404 });
    }

    let notesObj: any = {};
    if (patientData.notes) {
      try {
        notesObj = JSON.parse(patientData.notes);
      } catch (e) {
        notesObj = {};
      }
    }

    // 2. Filter out document
    if (Array.isArray(notesObj.documents)) {
      notesObj.documents = notesObj.documents.filter((doc: any) => doc.url !== file_url);
    } else {
      notesObj.documents = [];
    }

    // 3. Save notes back to database
    const { error: updateError } = await serviceSupabase
      .from("patients")
      .update({
        notes: JSON.stringify(notesObj)
      })
      .eq("id", resolvedPatientId);

    if (updateError) {
      return NextResponse.json({ error: `Failed to update document vault: ${updateError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, documents: notesObj.documents });
  } catch (error: any) {
    console.error("Error in patient documents vault delete endpoint:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
