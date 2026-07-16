import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { createServiceRoleClient } from "@/lib/supabaseServer";

const VALID_ROLES = [
  "admin",
  "super_admin",
  "safety_operator",
  "coordinator",
  "doctor",
  "reception",
  "finance",
  "support",
  "hospital_partner",
];

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

    // Only admin and super_admin can create employees
    const callerRole = user?.app_metadata?.role;
    if (callerRole !== "admin" && callerRole !== "super_admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, phone, role, department } = body;

    if (!name || !email || !role) {
      return NextResponse.json(
        { error: "name, email, and role are required" },
        { status: 400 }
      );
    }

    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const serviceSupabase = createServiceRoleClient();

    // Check for duplicate email in employees table
    const { data: existing } = await serviceSupabase
      .from("employees")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "An employee with this email already exists" },
        { status: 409 }
      );
    }

    // Insert CRM employee record
    const { data: employee, error: insertError } = await serviceSupabase
      .from("employees")
      .insert({
        name,
        email,
        phone: phone || null,
        role,
        department: department || null,
        portal_status: "NOT_INVITED",
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (insertError || !employee) {
      console.error("Error creating employee record:", insertError);
      return NextResponse.json(
        { error: insertError?.message || "Failed to create employee record" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Employee record created",
        staff_id: employee.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in employee create endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
