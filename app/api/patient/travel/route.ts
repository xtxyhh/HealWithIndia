import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

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

    const { data: travel } = await supabase.from("travel_details").select("*").eq("patient_id", patientId).single();
    const { data: visa } = await supabase.from("visa_details").select("*").eq("patient_id", patientId).single();
    const { data: hotels } = await supabase.from("hotel_bookings").select("*").eq("patient_id", patientId);

    return NextResponse.json({
      travel: travel || null,
      visa: visa || null,
      hotels: hotels || []
    });
  } catch (error) {
    console.error("Error fetching travel details:", error);
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
    const { type, flight_number, airline, departure_city, arrival_time, passport_number } = body;

    if (type === "visa") {
      const { data, error } = await supabase
        .from("visa_details")
        .upsert({
          patient_id: patientId,
          passport_number,
          updated_at: new Date().toISOString()
        }, { onConflict: "patient_id" })
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ data });
    } else {
      const { data, error } = await supabase
        .from("travel_details")
        .upsert({
          patient_id: patientId,
          flight_number,
          airline,
          departure_city,
          arrival_time,
          airport_pickup_status: "scheduled",
          updated_at: new Date().toISOString()
        }, { onConflict: "patient_id" })
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ data });
    }
  } catch (error) {
    console.error("Error updating travel details:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
