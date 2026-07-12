import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

// Server-side authorization helper
async function checkAdminAuth(supabase: any) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return { authorized: false, user: null };
  }

  // Check if user is admin via trusted app_metadata (not user-editable user_metadata)
  const appMetadata = user.app_metadata;
  const isAdmin = appMetadata?.role === "admin" || appMetadata?.role === "super_admin" || appMetadata?.role === "safety_operator";

  if (!isAdmin) {
    return { authorized: false, user: null };
  }

  return { authorized: true, user };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { authorized } = await checkAdminAuth(supabase);

    if (!authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch case with limited patient info to prevent data leakage
    const { data, error } = await supabase
      .from("safety_cases")
      .select(`
        id,
        category,
        priority,
        status,
        description,
        created_at,
        updated_at,
        assigned_coordinator_id,
        resolved_at,
        patients (
          id,
          full_name,
          country
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching safety case:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { authorized, user } = await checkAdminAuth(supabase);

    if (!authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { status, priority, assigned_coordinator_id, notes } = body;

    // Validate fields
    if (status) {
      const validStatuses = ["open", "acknowledged", "in_progress", "resolved", "closed"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
    }

    if (priority) {
      const validPriorities = ["low", "medium", "high", "critical"];
      if (!validPriorities.includes(priority)) {
        return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
      }
    }

    // Update the case
    const { data: caseData, error: caseError } = await supabase
      .from("safety_cases")
      .update({
        status: status || undefined,
        priority: priority || undefined,
        assigned_coordinator_id: assigned_coordinator_id || undefined,
        resolved_at: status === "resolved" ? new Date().toISOString() : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (caseError) {
      return NextResponse.json({ error: caseError.message }, { status: 500 });
    }

    // Create timeline event for status change
    if (status) {
      await supabase
        .from("safety_case_events")
        .insert({
          safety_case_id: id,
          event_type: "status_changed",
          description: `Status changed to ${status}`,
          created_by: "admin", // Anonymized to prevent email leakage
        });
    }

    // Create timeline event for priority change
    if (priority) {
      await supabase
        .from("safety_case_events")
        .insert({
          safety_case_id: id,
          event_type: "note_added",
          description: `Priority changed to ${priority}`,
          created_by: "admin", // Anonymized to prevent email leakage
        });
    }

    // Create timeline event for notes
    if (notes) {
      await supabase
        .from("safety_case_events")
        .insert({
          safety_case_id: id,
          event_type: "note_added",
          description: notes,
          created_by: "admin", // Anonymized to prevent email leakage
        });
    }

    return NextResponse.json({ data: caseData });
  } catch (error) {
    console.error("Error updating safety case:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
