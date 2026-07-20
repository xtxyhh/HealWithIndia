import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const role = user?.app_metadata?.role;
    if (!user || (role !== "admin" && role !== "super_admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { action, patient_id, amount_usd, tax_usd, due_date, treatment_id, hospital_id } = body;

    if (action === "create_quote") {
      const { data, error } = await supabase
        .from("quotes")
        .insert({
          patient_id,
          treatment_id,
          hospital_id,
          amount_usd,
          status: "sent",
          validity_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
        })
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ data, message: "Quote created & sent to patient" }, { status: 201 });
    }

    if (action === "issue_invoice") {
      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
      const totalUsd = Number(amount_usd) + (Number(tax_usd) || 0);

      const { data, error } = await supabase
        .from("invoices")
        .insert({
          patient_id,
          invoice_number: invoiceNumber,
          amount_usd,
          tax_usd: tax_usd || 0,
          total_usd: totalUsd,
          due_date: due_date || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "unpaid"
        })
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ data, message: "Proforma invoice issued successfully" }, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error managing admin invoices:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
