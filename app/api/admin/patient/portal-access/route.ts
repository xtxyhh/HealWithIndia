import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { createServiceRoleClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

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
      
      // Load initial mapping if it exists
      const { data: initialMapping } = await serviceSupabase
        .from("patient_auth_mapping")
        .select("*")
        .eq("patient_id", patient_id)
        .maybeSingle();

      let authUserId: string | null = null;
      let isNewUserCreated = false;

      if (initialMapping?.auth_user_id) {
        authUserId = initialMapping.auth_user_id;
        console.log("[PORTAL ENABLE] Auth user ID resolved from initial mapping:", authUserId);
      } else {
        // Try creating new user optimistically
        console.log("[PORTAL ENABLE] Step 2: Creating new Auth user for email:", patient.email);
        const { data: newUser, error: createError } = await serviceSupabase.auth.admin.createUser({
          email: patient.email,
          email_confirm: false,
          user_metadata: {
            full_name: patient.full_name,
            patient_id: patient_id,
            is_staff: false
          },
          app_metadata: {
            role: "patient"
          }
        });

        if (newUser && !createError) {
          authUserId = newUser.user.id;
          isNewUserCreated = true;
          console.log("[PORTAL ENABLE] Step 2: Created new Auth user with ID:", authUserId);
        } else if (createError && (createError.message.includes("already exists") || createError.message.includes("already registered") || createError.status === 422 || createError.status === 400)) {
          console.log("[PORTAL ENABLE] Auth user already exists in Supabase. Attempting lookup...");
          
          // Attempt database lookup first (indexed, scale-friendly)
          const { data: siblingPatient } = await serviceSupabase
            .from("patients")
            .select("id")
            .eq("email", patient.email)
            .maybeSingle();

          if (siblingPatient) {
            const { data: siblingMapping } = await serviceSupabase
              .from("patient_auth_mapping")
              .select("auth_user_id")
              .eq("patient_id", siblingPatient.id)
              .maybeSingle();

            if (siblingMapping) {
              authUserId = siblingMapping.auth_user_id;
              console.log("[PORTAL ENABLE] Auth user ID resolved from sibling mapping:", authUserId);
            }
          }

          // Fallback to listUsers scanning only if database lookup yielded no mapping (e.g. orphaned auth account)
          if (!authUserId) {
            console.warn("[PORTAL ENABLE] Database lookup failed for existing user. Falling back to listUsers scan...");
            const { data: existingUsers, error: listError } = await serviceSupabase.auth.admin.listUsers();
            if (listError || !existingUsers) {
              console.error("[PORTAL ENABLE] listUsers fallback failed:", listError);
              return NextResponse.json({ error: `Failed to resolve existing auth user: ${listError?.message || "Unknown error"}` }, { status: 500 });
            }
            const foundUser = existingUsers.users.find(u => u.email === patient.email);
            if (foundUser) {
              authUserId = foundUser.id;
              console.log("[PORTAL ENABLE] Auth user ID resolved from listUsers fallback:", authUserId);
            }
          }
        } else {
          console.error("[PORTAL ENABLE] Step 2: Failed to create Auth user:", createError);
          return NextResponse.json({ error: `Failed to create auth user: ${createError?.message || "Unknown error"}` }, { status: 500 });
        }
      }

      if (!authUserId) {
        return NextResponse.json({ error: "Failed to resolve or create auth account for patient email" }, { status: 500 });
      }

      // 4. Portal status update & 5. Mapping update (via database functions/RPC)
      console.log("[PORTAL ENABLE] Step 4/5: Calling database RPC enable_patient_portal_access. patient_id:", patient_id, "auth_user_id:", authUserId);
      const { error: mappingError } = await serviceSupabase.rpc("enable_patient_portal_access", {
        target_patient_id: patient_id,
        target_auth_user_id: authUserId
      });

      if (mappingError) {
        console.error("[PORTAL ENABLE] Step 4/5: RPC mapping error:", mappingError);
        // Rollback new auth user if it was created
        if (isNewUserCreated) {
          console.log("[PORTAL ENABLE] Rollback: Deleting newly created Auth user due to mapping error.");
          await serviceSupabase.auth.admin.deleteUser(authUserId);
        }
        return NextResponse.json({ error: `Failed to map portal access: ${mappingError.message}` }, { status: 500 });
      }
      console.log("[PORTAL ENABLE] Step 4/5: RPC mapping completed successfully.");

      // 3. Invite result
      console.log("[PORTAL ENABLE] Step 3: Sending invite email to email:", patient.email);
      const requestUrl = new URL(request.url);
      const inviteRedirectUrl = `${requestUrl.origin}/auth/callback?next=/reset-password`;

      const { error: inviteError } = await serviceSupabase.auth.admin.inviteUserByEmail(patient.email, {
        redirectTo: inviteRedirectUrl
      });

      if (inviteError) {
        console.error("[PORTAL ENABLE] Step 3: Error sending invite, starting rollback:", inviteError);

        // ROLLBACK:
        // Revert mapping status back to initial state or delete mapping
        if (initialMapping) {
          console.log("[PORTAL ENABLE] Rollback: Reverting database mapping state to original status:", initialMapping.portal_access_status);
          await serviceSupabase
            .from("patient_auth_mapping")
            .update({
              portal_access_status: initialMapping.portal_access_status,
              portal_access_enabled_at: initialMapping.portal_access_enabled_at,
              invite_sent_at: initialMapping.invite_sent_at
            })
            .eq("patient_id", patient_id);
        } else {
          // If no mapping existed previously, delete it
          console.log("[PORTAL ENABLE] Rollback: Deleting database mapping row.");
          await serviceSupabase
            .from("patient_auth_mapping")
            .delete()
            .eq("patient_id", patient_id);
        }

        // Delete auth user if it was created during this request
        if (isNewUserCreated) {
          console.log("[PORTAL ENABLE] Rollback: Deleting newly created Auth user due to invite error. ID:", authUserId);
          await serviceSupabase.auth.admin.deleteUser(authUserId);
        }

        return NextResponse.json({ 
          error: `Portal access enable failed. Invite email could not be sent: ${inviteError.message}`
        }, { status: 500 });
      }

      console.log("[PORTAL ENABLE] Step 3: Invite sent successfully to email:", patient.email);

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

      console.log("[PORTAL ENABLE] Updated mapping status read from db:", updatedMapping.portal_access_status);

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
      }

      console.log("[PORTAL ENABLE] Enable process completed successfully. portal_access_status:", updatedMapping.portal_access_status);
      
      revalidatePath("/admin/patient");
      revalidatePath(`/admin/patient/${patient_id}`);

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

      console.log("[PORTAL RESEND] Sending invite. email:", patient.email);
      const requestUrl = new URL(request.url);
      const inviteRedirectUrl = `${requestUrl.origin}/auth/callback?next=/reset-password`;

      const { error: inviteError } = await serviceSupabase.auth.admin.inviteUserByEmail(patient.email, {
        redirectTo: inviteRedirectUrl
      });

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

      revalidatePath("/admin/patient");
      revalidatePath(`/admin/patient/${patient_id}`);

      return NextResponse.json({ 
        message: "Invite resent successfully",
        portal_access_status: "INVITE_PENDING"
      });
    }

    if (action === "suspend") {
      // Suspend portal access
      const { data, error } = await serviceSupabase
        .from("patient_auth_mapping")
        .update({
          portal_access_status: "SUSPENDED",
          portal_access_suspended_at: new Date().toISOString()
        })
        .eq("patient_id", patient_id)
        .select();

      if (error) {
        console.error("Error suspending portal access:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      if (!data || data.length === 0) {
        return NextResponse.json({ error: "Portal access mapping not found" }, { status: 404 });
      }

      revalidatePath("/admin/patient");
      revalidatePath(`/admin/patient/${patient_id}`);

      return NextResponse.json({ 
        message: "Portal access suspended successfully",
        portal_access_status: "SUSPENDED"
      });
    }

    if (action === "restore") {
      // Restore portal access
      const { data, error } = await serviceSupabase
        .from("patient_auth_mapping")
        .update({
          portal_access_status: "ACTIVE",
          portal_access_suspended_at: null
        })
        .eq("patient_id", patient_id)
        .select();

      if (error) {
        console.error("Error restoring portal access:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      if (!data || data.length === 0) {
        return NextResponse.json({ error: "Portal access mapping not found" }, { status: 404 });
      }

      revalidatePath("/admin/patient");
      revalidatePath(`/admin/patient/${patient_id}`);

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
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = user?.app_metadata?.role;
    if (userRole !== 'admin' && userRole !== 'super_admin' && userRole !== 'coordinator') {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

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
