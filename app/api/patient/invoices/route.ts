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

    const { data: quotes } = await supabase.from("quotes").select("*").eq("patient_id", patientId);
    const { data: invoices } = await supabase.from("invoices").select("*, payments(*)").eq("patient_id", patientId);

    return NextResponse.json({
      quotes: quotes || [],
      invoices: invoices || []
    });
  } catch (error) {
    console.error("Error fetching patient invoices:", error);
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

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { invoice_id, amount_usd, payment_method, transaction_ref } = body;

    if (!invoice_id || !amount_usd || !transaction_ref) {
      return NextResponse.json({ error: "Missing payment parameters" }, { status: 400 });
    }

    if (typeof amount_usd !== "number" || amount_usd <= 0) {
      return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
    }

    const { data: payment, error } = await supabase
      .from("payments")
      .insert({
        invoice_id,
        patient_id: patientId,
        amount_usd,
        payment_method: payment_method || "card",
        transaction_ref,
        status: "completed"
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update invoice status to paid
    await supabase
      .from("invoices")
      .update({ status: "paid", updated_at: new Date().toISOString() })
      .eq("id", invoice_id);

    return NextResponse.json({ data: payment, message: "Payment processed successfully" });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
