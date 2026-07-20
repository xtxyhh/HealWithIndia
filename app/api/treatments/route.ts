import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = supabase.from("treatments").select("*, treatment_packages(*)").order("name");

    if (category) {
      query = query.ilike("category", `%${category}%`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error("Error fetching treatments:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || (user.app_metadata?.role !== "admin" && user.app_metadata?.role !== "super_admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, slug, category, department, description, duration_days, recovery_days, cost_usd_min, cost_usd_max } = body;

    if (!name || !slug || !category || !cost_usd_min || !cost_usd_max) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("treatments")
      .insert({
        name,
        slug,
        category,
        department,
        description,
        duration_days: duration_days || 7,
        recovery_days: recovery_days || 14,
        cost_usd_min,
        cost_usd_max,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Error creating treatment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
