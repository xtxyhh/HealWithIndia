import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Server-side authorization check
    const appMetadata = user.app_metadata;
    const isAdmin = appMetadata?.role === "admin" || appMetadata?.role === "super_admin" || appMetadata?.role === "safety_operator";

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { action, notes, resolution_category } = body;

    if (!action) {
      return NextResponse.json({ error: "Missing action" }, { status: 400 });
    }

    const caseId = id;

    // Fetch current case state
    const { data: safetyCase, error: caseError } = await supabase
      .from("safety_cases")
      .select("*")
      .eq("id", caseId)
      .single();

    if (caseError || !safetyCase) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const now = new Date().toISOString();
    const updates: any = {};
    let eventType: string = '';
    let eventDescription: string = '';

    // Handle different response actions
    switch (action) {
      case 'acknowledge':
        updates.response_state = 'acknowledged';
        updates.acknowledged_at = now;
        updates.response_operator_id = user.id;
        if (safetyCase.status === 'open') {
          updates.status = 'acknowledged';
        }
        eventType = 'acknowledged';
        eventDescription = `Case acknowledged by ${user.email}`;
        break;

      case 'claim':
        updates.response_state = 'in_response';
        updates.response_operator_id = user.id;
        if (!safetyCase.acknowledged_at) {
          updates.acknowledged_at = now;
        }
        eventType = 'assigned';
        eventDescription = `Case claimed by ${user.email}`;
        break;

      case 'patient_contact_attempt':
        eventType = 'note_added';
        eventDescription = `Patient contact attempt recorded by ${user.email}. ${notes || ''}`;
        break;

      case 'patient_contacted':
        updates.patient_contacted_at = now;
        updates.response_state = 'in_response';
        eventType = 'patient_contacted';
        eventDescription = `Patient successfully contacted by ${user.email}`;
        break;

      case 'coordinator_contacted':
        updates.response_state = 'in_response';
        eventType = 'coordinator_contacted';
        eventDescription = `Coordinator contacted by ${user.email}. ${notes || ''}`;
        break;

      case 'external_guidance':
        updates.response_state = 'external_guidance_provided';
        eventType = 'external_guidance_provided';
        eventDescription = `External emergency guidance provided. ${notes || ''}`;
        break;

      case 'monitoring':
        updates.response_state = 'monitoring';
        eventType = 'status_changed';
        eventDescription = `Case moved to monitoring state. ${notes || ''}`;
        break;

      case 'resolve':
        if (!resolution_category) {
          return NextResponse.json({ error: "Missing resolution_category" }, { status: 400 });
        }
        updates.response_state = 'resolved';
        updates.status = 'resolved';
        updates.resolution_category = resolution_category;
        updates.resolved_at = now;
        eventType = 'resolved';
        eventDescription = `Case resolved. Category: ${resolution_category}. ${notes || ''}`;
        break;

      case 'escalate':
        if (safetyCase.priority === 'critical') {
          return NextResponse.json({ error: "Case is already critical" }, { status: 400 });
        }
        const newPriority = safetyCase.priority === 'low' ? 'medium' : 
                           safetyCase.priority === 'medium' ? 'high' : 'critical';
        updates.priority = newPriority;
        eventType = 'status_changed';
        eventDescription = `Case priority escalated to ${newPriority} by ${user.email}`;
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Update case
    const { data: updatedCase, error: updateError } = await supabase
      .from("safety_cases")
      .update(updates)
      .eq("id", caseId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Create timeline event
    const { error: eventError } = await supabase
      .from("safety_case_events")
      .insert({
        safety_case_id: caseId,
        event_type: eventType,
        description: eventDescription,
        created_by: user.email,
        created_at: now
      });

    if (eventError) {
      console.error("Failed to create timeline event:", eventError);
      // Don't fail the response if event creation fails
    }

    // Create monitoring audit event for response action
    let auditEventType = '';
    switch (action) {
      case 'acknowledge':
        auditEventType = 'case_acknowledged';
        break;
      case 'claim':
        auditEventType = 'case_claimed';
        break;
      case 'patient_contacted':
        auditEventType = 'patient_contact_recorded';
        break;
      case 'coordinator_contacted':
        auditEventType = 'coordinator_contact_recorded';
        break;
      case 'resolve':
        auditEventType = 'case_resolved';
        break;
      case 'escalate':
        auditEventType = 'case_priority_escalated';
        break;
      default:
        auditEventType = 'case_response_state_changed';
    }

    await supabase.rpc('create_monitoring_audit_event', {
      p_event_type: auditEventType,
      p_entity_type: 'safety_case',
      p_entity_id: caseId,
      p_patient_id: safetyCase.patient_id,
      p_actor_type: 'admin',
      p_actor_id: user.email,
      p_context: {
        action: action,
        response_state: updates.response_state,
        priority: updates.priority,
        resolution_category: updates.resolution_category
      }
    });

    return NextResponse.json({ 
      data: updatedCase,
      message: "Response action recorded successfully"
    });
  } catch (error) {
    console.error("Error recording response action:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
