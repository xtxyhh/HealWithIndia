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
    const { report_type, description, contact_method, contact_info } = body;

    // Validate required fields
    if (!report_type || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate report_type
    const validTypes = [
      "suspicious_contact",
      "payment_request",
      "fake_coordinator",
      "phishing",
      "identity_theft",
      "other"
    ];

    if (!validTypes.includes(report_type)) {
      return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
    }

    // Server-side ownership check
    const { data, error } = await supabase
      .from("fraud_reports")
      .insert({
        patient_id: user.id,
        report_type,
        description: description.trim(),
        contact_method: contact_method || null,
        contact_info: contact_info || null,
        priority: "high",
        status: "pending_review",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Also create a safety case for operational visibility
    await supabase
      .from("safety_cases")
      .insert({
        patient_id: user.id,
        category: "suspected_fraud",
        priority: "high",
        status: "open",
        description: `Fraud Report (${report_type}): ${description}`,
      });

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Error creating fraud report:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
