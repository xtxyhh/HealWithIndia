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
    if (role !== "admin" && role !== "super_admin" && role !== "finance") {
      return NextResponse.json({ error: "Forbidden: Admin or Finance access required" }, { status: 403 });
    }

    const body = await request.json();
    const { patient_id, estimated_cost, paid_amount, currency, invoice_status, notes_text } = body;

    if (!patient_id) {
      return NextResponse.json({ error: "patient_id is required" }, { status: 400 });
    }

    const serviceSupabase = createServiceRoleClient();

    const notesJSON = JSON.stringify({
      notes_text: notes_text || "",
      estimated_cost: Number(estimated_cost) || 0,
      paid_amount: Number(paid_amount) || 0,
      currency: currency || "USD",
      invoice_status: invoice_status || "UNPAID"
    });

    const { error } = await serviceSupabase
      .from("patients")
      .update({
        estimated_revenue: Number(paid_amount) || 0, // actual paid revenue
        notes: notesJSON,
        description: notes_text || null
      })
      .eq("id", patient_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Financials and notes updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
