import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const role = user?.app_metadata?.role;
    if (!user || (role !== "admin" && role !== "super_admin" && role !== "safety_operator" && role !== "coordinator")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("leads")
      .select("*, official_coordinators(id, full_name, phone)")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { patient_name, email, phone, country, treatment_requested, notes, source } = body;

    if (!patient_name || !email || !country) {
      return NextResponse.json({ error: "Missing required fields (patient_name, email, country)" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("leads")
      .insert({
        patient_name,
        email,
        phone,
        country,
        treatment_requested,
        notes,
        source: source || "website",
        status: "inquiry",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, message: "Inquiry submitted successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const role = user?.app_metadata?.role;
    if (!user || (role !== "admin" && role !== "super_admin" && role !== "coordinator")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { lead_id, status, assigned_coordinator_id, notes } = body;

    if (!lead_id) {
      return NextResponse.json({ error: "lead_id is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("leads")
      .update({
        status: status || undefined,
        assigned_coordinator_id: assigned_coordinator_id || undefined,
        notes: notes || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", lead_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
