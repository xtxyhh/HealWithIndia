import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify patient portal access is enabled
    const { data: hasAccess, error: accessError } = await supabase
      .rpc("verify_patient_portal_access");

    if (accessError) {
      console.error("Error verifying portal access:", accessError);
      return NextResponse.json({ error: accessError.message }, { status: 500 });
    }

    if (!hasAccess) {
      return NextResponse.json({ 
        error: "Patient portal access has not been enabled for this account. Please contact your HealWithIndia coordinator." 
      }, { status: 403 });
    }

    // Resolve patient ID from auth mapping
    const { data: resolvedPatientId } = await supabase
      .rpc("get_patient_id_from_auth", { auth_user_uuid: user.id });

    if (!resolvedPatientId) {
      return NextResponse.json({ error: "Patient mapping not found" }, { status: 404 });
    }

    // Get safety profile (no lazy initialization - protection must be activated by admin)
    const { data, error } = await supabase
      .from("patient_safety_profiles")
      .select("*")
      .eq("patient_id", resolvedPatientId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ 
          data: null,
          protection_status: "NOT_ACTIVATED"
        });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch patient metadata and notes
    const { data: patientData } = await supabase
      .from("patients")
      .select("notes, full_name, email, phone, country, treatment")
      .eq("id", resolvedPatientId)
      .single();

    let extraDetails = {};
    if (patientData?.notes) {
      try {
        extraDetails = JSON.parse(patientData.notes);
      } catch (e) {}
    }

    return NextResponse.json({
      data: {
        ...data,
        patient: {
          full_name: patientData?.full_name || "",
          email: patientData?.email || "",
          phone: patientData?.phone || "",
          country: patientData?.country || "",
          treatment: patientData?.treatment || ""
        },
        extra: extraDetails
      }
    });
  } catch (error: any) {
    console.error("Error fetching safety profile:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
