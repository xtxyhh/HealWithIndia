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

    const { data, error } = await supabase
      .from("safety_check_ins")
      .select("*")
      .eq("patient_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching check-ins:", error);
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
    const { check_in_type, status, notes } = body;

    // Validate required fields
    if (!check_in_type || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate check_in_type
    const validTypes = [
      "arrival_india",
      "airport_pickup",
      "accommodation_arrival",
      "hospital_arrival",
      "treatment_milestone",
      "discharge",
      "return_travel"
    ];

    if (!validTypes.includes(check_in_type)) {
      return NextResponse.json({ error: "Invalid check-in type" }, { status: 400 });
    }

    // Validate status
    const validStatuses = ["safe", "needs_assistance", "pending"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Server-side ownership check
    const { data, error } = await supabase
      .from("safety_check_ins")
      .insert({
        patient_id: user.id,
        check_in_type,
        status,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If status is "needs_assistance", automatically create a safety case
    if (status === "needs_assistance") {
      await supabase
        .from("safety_cases")
        .insert({
          patient_id: user.id,
          category: "other",
          priority: "high",
          status: "open",
          description: `Check-in assistance needed: ${check_in_type}. ${notes || ""}`,
        });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Error creating check-in:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
