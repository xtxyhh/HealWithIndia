import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { createServiceRoleClient } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    // Verify caller is authenticated and has admin role
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role (admin or super_admin only for portal access management)
    const userRole = user?.app_metadata?.role;
    
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { patient_id, auth_user_id, action } = body;

    if (!patient_id || !action) {
      return NextResponse.json({ error: "patient_id and action are required" }, { status: 400 });
    }

    const serviceSupabase = createServiceRoleClient();

    if (action === "enable") {
      console.log("[PORTAL ENABLE] Starting enable process for patient_id:", patient_id);
      
      // Load patient data to verify email exists
      const { data: patient, error: patientError } = await serviceSupabase
        .from("patients")
        .select("email, full_name")
        .eq("id", patient_id)
        .single();

      if (patientError || !patient) {
        console.log("[PORTAL ENABLE] Patient not found. patient_id:", patient_id, "error:", patientError);
        return NextResponse.json({ error: "Patient not found" }, { status: 404 });
      }

      if (!patient.email) {
        console.log("[PORTAL ENABLE] Patient has no email. patient_id:", patient_id);
        return NextResponse.json({ error: "Patient email is required to enable portal access" }, { status: 400 });
      }
      
      console.log("[PORTAL ENABLE] Patient loaded. email:", patient.email, "full_name:", patient.full_name);

      // Check if auth user already exists for this email
      const { data: existingUsers } = await serviceSupabase.auth.admin.listUsers();
      const existingUser = existingUsers.users.find(u => u.email === patient.email);

      let authUserId: string;

      if (existingUser) {
        console.log("[PORTAL ENABLE] Existing auth user found by email. id:", existingUser.id, "email:", existingUser.email, "email_confirmed_at:", existingUser.email_confirmed_at, "last_sign_in_at:", existingUser.last_sign_in_at, "created_at:", existingUser.created_at, "banned_until:", existingUser.banned_until, "deleted_at:", existingUser.deleted_at);
        authUserId = existingUser.id;
      } else {
        console.log("[PORTAL ENABLE] No existing auth user. Creating new auth user. email:", patient.email);
        // Create new auth user
        const { data: newUser, error: createError } = await serviceSupabase.auth.admin.createUser({
          email: patient.email,
          email_confirm: false,
          user_metadata: {
            full_name: patient.full_name,
            patient_id: patient_id
          }
        });

        if (createError || !newUser) {
          console.error("[PORTAL ENABLE] Error creating auth user:", createError);
          return NextResponse.json({ error: "Failed to create auth user" }, { status: 500 });
        }

        authUserId = newUser.user.id;
        console.log("[PORTAL ENABLE] New auth user created. id:", authUserId, "email:", patient.email);
      }

      // Call RPC to handle state transitions (single source of truth)
      console.log("[PORTAL ENABLE] Calling RPC enable_patient_portal_access. patient_id:", patient_id, "auth_user_id:", authUserId);
      const { error: mappingError } = await serviceSupabase.rpc("enable_patient_portal_access", {
        target_patient_id: patient_id,
        target_auth_user_id: authUserId
      });

      if (mappingError) {
        console.error("[PORTAL ENABLE] RPC error:", mappingError);
        
        // Check if this is a conflict error (auth user or patient already mapped)
        if (mappingError.message?.includes('Conflict')) {
          console.log("[PORTAL ENABLE] Conflict error in RPC:", mappingError.message);
          return NextResponse.json({ error: mappingError.message }, { status: 409 });
        }
        
        return NextResponse.json({ 
          error: "Failed to enable portal access",
          details: mappingError.message
        }, { status: 500 });
      }
      console.log("[PORTAL ENABLE] RPC completed successfully.");

      // Read the UPDATED mapping from database (single source of truth)
      const { data: updatedMapping, error: readError } = await serviceSupabase
        .from("patient_auth_mapping")
        .select("*")
        .eq("patient_id", patient_id)
        .eq("auth_user_id", authUserId)
        .single();

      if (readError || !updatedMapping) {
        console.error("[PORTAL ENABLE] Error reading updated mapping:", readError);
        return NextResponse.json({ error: "Failed to read updated mapping" }, { status: 500 });
      }

      console.log("[PORTAL ENABLE] Updated mapping status:", updatedMapping.portal_access_status);

      // Use UPDATED status to decide whether to send invite
      // Only send invite if status is INVITE_PENDING AND invite_sent_at IS NULL
      // This prevents duplicate emails from repeated clicks, refreshes, network retries
      if (updatedMapping.portal_access_status === 'INVITE_PENDING' && !updatedMapping.invite_sent_at) {
        console.log("[PORTAL ENABLE] Status is INVITE_PENDING and invite_sent_at is NULL. Sending invite.");
        const { error: inviteError } = await serviceSupabase.auth.admin.inviteUserByEmail(patient.email);
        if (inviteError) {
          console.error("[PORTAL ENABLE] Error sending invite:", {
            message: inviteError.message,
            status: inviteError.status,
            code: inviteError.code
          });
          // Invite failed but mapping exists - partial failure
          return NextResponse.json({ 
            error: "Portal access enabled but invite failed. Please retry or contact support.",
            details: inviteError.message,
            portal_access_status: updatedMapping.portal_access_status
          }, { status: 500 });
        }
        console.log("[PORTAL ENABLE] Invite sent successfully.");

        // Update invite timestamp ONLY after successful invite
        const { error: timestampError } = await serviceSupabase
          .from("patient_auth_mapping")
          .update({
            invite_sent_at: new Date().toISOString(),
            invite_resend_count: 0
          })
          .eq("auth_user_id", authUserId)
          .eq("patient_id", patient_id);

        if (timestampError) {
          console.error("[PORTAL ENABLE] Error updating invite timestamp:", timestampError);
          // Non-critical - invite sent, timestamp can be updated later
        }
      } else if (updatedMapping.portal_access_status === 'INVITE_PENDING' && updatedMapping.invite_sent_at) {
        console.log("[PORTAL ENABLE] Status is INVITE_PENDING but invite already sent at:", updatedMapping.invite_sent_at, ". Skipping duplicate invite.");
      } else {
        console.log("[PORTAL ENABLE] Status is", updatedMapping.portal_access_status, ". Skipping invite.");
      }

      console.log("[PORTAL ENABLE] Enable process completed successfully. portal_access_status:", updatedMapping.portal_access_status);
      return NextResponse.json({ 
        message: "Portal access updated successfully",
        portal_access_status: updatedMapping.portal_access_status,
        auth_user_id: authUserId
      });
    }

    if (action === "resend") {
      // Get current mapping
      const { data: mapping, error: mappingError } = await serviceSupabase
        .from("patient_auth_mapping")
        .select("*")
        .eq("patient_id", patient_id)
        .single();

      if (mappingError || !mapping) {
        return NextResponse.json({ error: "Portal access not found" }, { status: 404 });
      }

      if (mapping.portal_access_status !== "INVITE_PENDING") {
        return NextResponse.json({ error: "Can only resend invite for pending status" }, { status: 400 });
      }

      // Get patient email for invite
      const { data: patient, error: patientError } = await serviceSupabase
        .from("patients")
        .select("email")
        .eq("id", patient_id)
        .single();

      if (patientError || !patient || !patient.email) {
        return NextResponse.json({ error: "Patient email not found" }, { status: 404 });
      }

      // Rate limit: check if last invite was sent less than 5 minutes ago
      if (mapping.invite_sent_at) {
        const lastInviteTime = new Date(mapping.invite_sent_at).getTime();
        const currentTime = new Date().getTime();
        const cooldownMs = 5 * 60 * 1000; // 5 minutes
        
        if (currentTime - lastInviteTime < cooldownMs) {
          return NextResponse.json({ 
            error: "Please wait 5 minutes before resending invite" 
          }, { status: 429 });
        }
      }

      // Resend invite using Supabase Auth
      console.log("[PORTAL RESEND] Sending invite. email:", patient.email);
      const { error: inviteError } = await serviceSupabase.auth.admin.inviteUserByEmail(patient.email);

      if (inviteError) {
        console.error("[PORTAL RESEND] Error resending invite:", {
          message: inviteError.message,
          status: inviteError.status,
          code: inviteError.code
        });
        return NextResponse.json({ error: "Failed to resend invite", details: inviteError.message }, { status: 500 });
      }
      console.log("[PORTAL RESEND] Invite sent successfully.");

      // Update invite timestamp and count ONLY after successful invite
      const { error: updateError } = await serviceSupabase
        .from("patient_auth_mapping")
        .update({
          invite_sent_at: new Date().toISOString(),
          invite_resend_count: mapping.invite_resend_count + 1
        })
        .eq("patient_id", patient_id);

      if (updateError) {
        console.error("[PORTAL RESEND] Error updating invite metadata:", updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ 
        message: "Invite resent successfully",
        portal_access_status: "INVITE_PENDING"
      });
    }

    if (action === "suspend") {
      // Suspend portal access
      const { error } = await serviceSupabase
        .from("patient_auth_mapping")
        .update({
          portal_access_status: "SUSPENDED",
          portal_access_suspended_at: new Date().toISOString()
        })
        .eq("patient_id", patient_id);

      if (error) {
        console.error("Error suspending portal access:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ 
        message: "Portal access suspended successfully",
        portal_access_status: "SUSPENDED"
      });
    }

    if (action === "restore") {
      // Restore portal access
      const { error } = await serviceSupabase
        .from("patient_auth_mapping")
        .update({
          portal_access_status: "ACTIVE",
          portal_access_suspended_at: null
        })
        .eq("patient_id", patient_id);

      if (error) {
        console.error("Error restoring portal access:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ 
        message: "Portal access restored successfully",
        portal_access_status: "ACTIVE"
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Error in portal access endpoint:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patient_id = searchParams.get("patient_id");

    if (!patient_id) {
      return NextResponse.json({ error: "patient_id is required" }, { status: 400 });
    }

    const serviceSupabase = createServiceRoleClient();

    const { data, error } = await serviceSupabase
      .from("patient_auth_mapping")
      .select("*")
      .eq("patient_id", patient_id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ 
          portal_access_status: "NOT_ENABLED",
          has_mapping: false
        });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      portal_access_status: data.portal_access_status,
      portal_access_enabled_at: data.portal_access_enabled_at,
      portal_access_suspended_at: data.portal_access_suspended_at,
      invite_sent_at: data.invite_sent_at,
      invite_resend_count: data.invite_resend_count,
      has_mapping: true
    });

  } catch (error) {
    console.error("Error getting portal access status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
