import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const role = user?.app_metadata?.role;
    if (!user || (role !== "coordinator" && role !== "admin" && role !== "super_admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: patients, error } = await supabase
      .from("patients")
      .select("*, patient_journey_stages(*), visa_details(*), travel_details(*)")
      .order("updated_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ patients: patients || [] });
  } catch (error) {
    console.error("Error fetching coordinator patients:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const role = user?.app_metadata?.role;
    if (!user || (role !== "coordinator" && role !== "admin" && role !== "super_admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { patient_id, status, notes, stage } = body;

    if (!patient_id) {
      return NextResponse.json({ error: "patient_id is required" }, { status: 400 });
    }

    if (status) {
      await supabase.from("patients").update({ status, notes, updated_at: new Date().toISOString() }).eq("id", patient_id);
    }

    if (stage) {
      await supabase.from("patient_journey_stages").upsert({
        patient_id,
        stage,
        status: "completed",
        notes: notes || `Updated by coordinator`,
        updated_by: user.email || "coordinator",
        updated_at: new Date().toISOString()
      }, { onConflict: "patient_id,stage" });
    }

    return NextResponse.json({ message: "Patient status updated successfully" });
  } catch (error) {
    console.error("Error updating patient by coordinator:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
