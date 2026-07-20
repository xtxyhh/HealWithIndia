import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { createServiceRoleClient } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = user?.app_metadata?.role;
    if (role !== "admin" && role !== "super_admin" && role !== "finance" && role !== "coordinator") {
      return NextResponse.json({ error: "Forbidden: Operations access required" }, { status: 403 });
    }

    const body = await request.json();
    const {
      patient_id,
      estimated_cost,
      paid_amount,
      currency,
      invoice_status,
      notes_text,
      full_name,
      email,
      phone,
      country,
      treatment,
      assigned_hospital,
      assigned_coordinator_id,
      journey_stage,
      risk_level,
      // Extra details
      flight_number,
      flight_departure_time,
      hotel_name,
      hotel_address,
      hotel_booking_reference,
      doctor_name,
      treatment_plan_summary,
      allergies,
      blood_group,
      emergency_contacts,
      medical_history
    } = body;

    if (!patient_id) {
      return NextResponse.json({ error: "patient_id is required" }, { status: 400 });
    }

    const serviceSupabase = createServiceRoleClient();

    // 1. Update basic patient info & financials & extra details
    const notesJSON = JSON.stringify({
      notes_text: notes_text || "",
      estimated_cost: Number(estimated_cost) || 0,
      paid_amount: Number(paid_amount) || 0,
      currency: currency || "USD",
      invoice_status: invoice_status || "UNPAID",
      flight_number: flight_number || "",
      flight_departure_time: flight_departure_time || "",
      hotel_name: hotel_name || "",
      hotel_address: hotel_address || "",
      hotel_booking_reference: hotel_booking_reference || "",
      doctor_name: doctor_name || "",
      treatment_plan_summary: treatment_plan_summary || "",
      allergies: allergies || "",
      blood_group: blood_group || "",
      emergency_contacts: emergency_contacts || "",
      medical_history: medical_history || ""
    });

    const updateFields: any = {
      estimated_revenue: Number(paid_amount) || 0,
      notes: notesJSON,
    };

    if (full_name !== undefined) updateFields.full_name = full_name;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone || null;
    if (country !== undefined) updateFields.country = country || null;
    if (treatment !== undefined) updateFields.treatment = treatment || null;
    if (assigned_hospital !== undefined) updateFields.assigned_hospital = assigned_hospital || null;
    if (notes_text !== undefined) updateFields.description = notes_text || null;

    const { error: patientUpdateError } = await serviceSupabase
      .from("patients")
      .update(updateFields)
      .eq("id", patient_id);

    if (patientUpdateError) {
      return NextResponse.json({ error: patientUpdateError.message }, { status: 500 });
    }

    // 2. Update coordinator assignment
    if (assigned_coordinator_id !== undefined) {
      // Deactivate current assignments
      const { error: deactivateError } = await serviceSupabase
        .from("coordinator_assignments")
        .update({ is_active: false })
        .eq("patient_id", patient_id)
        .eq("is_active", true);

      if (deactivateError) {
        return NextResponse.json({ error: `Failed to deactivate current coordinator: ${deactivateError.message}` }, { status: 500 });
      }

      if (assigned_coordinator_id && assigned_coordinator_id !== "none") {
        const { error: assignError } = await serviceSupabase
          .from("coordinator_assignments")
          .insert({
            patient_id,
            coordinator_id: assigned_coordinator_id,
            is_active: true,
            assigned_by: user.email || "admin"
          });

        if (assignError) {
          return NextResponse.json({ error: `Failed to assign new coordinator: ${assignError.message}` }, { status: 500 });
        }
      }
    }

    // 3. Update journey stage in safety profile
    if (journey_stage !== undefined || assigned_hospital !== undefined) {
      const { data: safetyProfile, error: profileGetError } = await serviceSupabase
        .from("patient_safety_profiles")
        .select("id, journey_stage, hospital_name")
        .eq("patient_id", patient_id)
        .maybeSingle();

      if (profileGetError) {
        return NextResponse.json({ error: `Failed to fetch safety profile: ${profileGetError.message}` }, { status: 500 });
      }

      const safetyUpdate: any = {};
      if (journey_stage !== undefined) safetyUpdate.journey_stage = journey_stage || "initial";
      if (assigned_hospital !== undefined) safetyUpdate.hospital_name = assigned_hospital || null;

      if (safetyProfile) {
        const { error: profileUpdateError } = await serviceSupabase
          .from("patient_safety_profiles")
          .update(safetyUpdate)
          .eq("patient_id", patient_id);

        if (profileUpdateError) {
          return NextResponse.json({ error: `Failed to update safety profile: ${profileUpdateError.message}` }, { status: 500 });
        }
      } else if (journey_stage) {
        // If not activated yet but has stage set, auto-initialize safety profile
        const { error: profileInsertError } = await serviceSupabase
          .from("patient_safety_profiles")
          .insert({
            patient_id,
            ...safetyUpdate
          });

        if (profileInsertError) {
          return NextResponse.json({ error: `Failed to initialize safety profile: ${profileInsertError.message}` }, { status: 500 });
        }
      }
    }

    // 4. Update risk assessment
    if (risk_level !== undefined && risk_level) {
      const { error: riskDeactivateError } = await serviceSupabase
        .from("risk_assessments")
        .update({ is_current: false })
        .eq("patient_id", patient_id);

      if (riskDeactivateError) {
        return NextResponse.json({ error: `Failed to clear previous risk assessments: ${riskDeactivateError.message}` }, { status: 500 });
      }

      const { error: riskInsertError } = await serviceSupabase
        .from("risk_assessments")
        .insert({
          patient_id,
          risk_level,
          is_current: true,
          notes: "Configured via admin profile editor"
        });

      if (riskInsertError) {
        return NextResponse.json({ error: `Failed to record new risk assessment: ${riskInsertError.message}` }, { status: 500 });
      }
    }

    return NextResponse.json({ message: "Patient information updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
