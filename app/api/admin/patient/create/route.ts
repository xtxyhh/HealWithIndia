import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { createServiceRoleClient } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    // Verify caller is authenticated and has admin role
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin or super_admin can create patients
    const callerRole = user?.app_metadata?.role;
    if (callerRole !== "admin" && callerRole !== "super_admin" && callerRole !== "coordinator" && callerRole !== "reception") {
      return NextResponse.json(
        { error: "Forbidden: Insufficient privileges" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { full_name, email, phone, country, treatment, notes } = body;

    if (!full_name || !email) {
      return NextResponse.json(
        { error: "full_name and email are required" },
        { status: 400 }
      );
    }

    const serviceSupabase = createServiceRoleClient();

    // Check for duplicate email in patients
    const { data: existingPatient } = await serviceSupabase
      .from("patients")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingPatient) {
      return NextResponse.json(
        { error: "A patient with this email already exists" },
        { status: 409 }
      );
    }

    // Check if email already belongs to a staff account in employees table
    const { data: existingEmployee } = await serviceSupabase
      .from("employees")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingEmployee) {
      return NextResponse.json(
        { error: "This email already belongs to a staff account." },
        { status: 400 }
      );
    }


    // Insert patient CRM record
    const { data: patient, error: insertError } = await serviceSupabase
      .from("patients")
      .insert({
        full_name,
        email,
        phone: phone || null,
        country: country || null,
        treatment: treatment || null,
        notes: notes || null,
        status: "New",
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (insertError || !patient) {
      console.error("Error creating patient record:", insertError);
      return NextResponse.json(
        { error: insertError?.message || "Failed to create patient record" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Patient record created",
        patient_id: patient.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in patient create endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
