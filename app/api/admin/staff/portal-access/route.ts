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

    // Verify admin role (only super_admin can manage staff accounts)
    const userRole = user?.app_metadata?.role;
    
    if (userRole !== 'super_admin') {
      return NextResponse.json({ error: "Forbidden: Super admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { action, email, full_name, role, staff_id } = body;

    const serviceSupabase = createServiceRoleClient();

    if (action === "invite") {
      if (!email || !full_name || !role) {
        return NextResponse.json({ error: "email, full_name, and role are required" }, { status: 400 });
      }

      // Validate role
      const allowedRoles = ['admin', 'safety_operator', 'super_admin'];
      if (!allowedRoles.includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }

      // Only super_admin can create another super_admin
      if (role === 'super_admin') {
        return NextResponse.json({ error: "Cannot create super_admin via this endpoint" }, { status: 403 });
      }

      // Check if auth user already exists for this email
      const { data: existingUsers } = await serviceSupabase.auth.admin.listUsers();
      const existingUser = existingUsers.users.find(u => u.email === email);

      if (existingUser) {
        return NextResponse.json({ 
          error: "An auth account with this email already exists" 
        }, { status: 409 });
      }

      // Create new auth user with invite
      const { data: newUser, error: createError } = await serviceSupabase.auth.admin.createUser({
        email,
        email_confirm: false,
        user_metadata: {
          full_name,
          is_staff: true
        },
        app_metadata: {
          role
        }
      });

      if (createError || !newUser) {
        console.error("Error creating staff auth user:", createError);
        return NextResponse.json({ error: "Failed to create staff auth user" }, { status: 500 });
      }

      const authUserId = newUser.user.id;
      
      // Send invite to the newly created user
      const { error: inviteError } = await serviceSupabase.auth.admin.inviteUserByEmail(authUserId);
      if (inviteError) {
        console.error("Error sending invite to staff user:", inviteError);
        return NextResponse.json({ 
          error: "Auth account created but invite failed. Please retry.",
          details: inviteError.message
        }, { status: 500 });
      }

      // Create employee record if staff_id provided
      if (staff_id) {
        const { error: employeeError } = await serviceSupabase
          .from("employees")
          .update({
            auth_user_id: authUserId,
            portal_status: "INVITE_PENDING"
          })
          .eq("id", staff_id);

        if (employeeError) {
          console.error("Error updating employee record:", employeeError);
          // Non-critical - auth user created and invited
        }
      }

      return NextResponse.json({ 
        message: "Staff invite sent successfully",
        portal_status: "INVITE_PENDING",
        auth_user_id: authUserId
      });
    }

    if (action === "resend") {
      if (!staff_id) {
        return NextResponse.json({ error: "staff_id is required" }, { status: 400 });
      }

      // Get employee record
      const { data: employee, error: employeeError } = await serviceSupabase
        .from("employees")
        .select("*")
        .eq("id", staff_id)
        .single();

      if (employeeError || !employee) {
        return NextResponse.json({ error: "Employee not found" }, { status: 404 });
      }

      if (!employee.auth_user_id) {
        return NextResponse.json({ error: "No auth account linked to this employee" }, { status: 400 });
      }

      // Rate limit: check if last invite was sent less than 5 minutes ago
      if (employee.invite_sent_at) {
        const lastInviteTime = new Date(employee.invite_sent_at).getTime();
        const currentTime = new Date().getTime();
        const cooldownMs = 5 * 60 * 1000; // 5 minutes
        
        if (currentTime - lastInviteTime < cooldownMs) {
          return NextResponse.json({ 
            error: "Please wait 5 minutes before resending invite" 
          }, { status: 429 });
        }
      }

      // Resend invite using Supabase Auth
      const { error: inviteError } = await serviceSupabase.auth.admin.inviteUserByEmail(employee.auth_user_id);

      if (inviteError) {
        console.error("Error resending staff invite:", inviteError);
        return NextResponse.json({ error: "Failed to resend invite" }, { status: 500 });
      }

      // Update invite timestamp and count
      const { error: updateError } = await serviceSupabase
        .from("employees")
        .update({
          invite_sent_at: new Date().toISOString(),
          invite_resend_count: (employee.invite_resend_count || 0) + 1
        })
        .eq("id", staff_id);

      if (updateError) {
        console.error("Error updating invite metadata:", updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ 
        message: "Staff invite resent successfully",
        portal_status: "INVITE_PENDING"
      });
    }

    if (action === "change_role") {
      if (!staff_id || !role) {
        return NextResponse.json({ error: "staff_id and role are required" }, { status: 400 });
      }

      // Validate role
      const allowedRoles = ['admin', 'safety_operator', 'super_admin'];
      if (!allowedRoles.includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }

      // Only super_admin can assign super_admin role
      if (role === 'super_admin') {
        return NextResponse.json({ error: "Cannot assign super_admin role via this endpoint" }, { status: 403 });
      }

      // Get employee record
      const { data: employee, error: employeeError } = await serviceSupabase
        .from("employees")
        .select("*")
        .eq("id", staff_id)
        .single();

      if (employeeError || !employee) {
        return NextResponse.json({ error: "Employee not found" }, { status: 404 });
      }

      if (!employee.auth_user_id) {
        return NextResponse.json({ error: "No auth account linked to this employee" }, { status: 400 });
      }

      // Update user's app_metadata.role using service role
      const { error: updateError } = await serviceSupabase.auth.admin.updateUserById(
        employee.auth_user_id,
        {
          app_metadata: {
            role
          }
        }
      );

      if (updateError) {
        console.error("Error updating staff role:", updateError);
        return NextResponse.json({ error: "Failed to update staff role" }, { status: 500 });
      }

      // Update employee record
      const { error: employeeUpdateError } = await serviceSupabase
        .from("employees")
        .update({
          role
        })
        .eq("id", staff_id);

      if (employeeUpdateError) {
        console.error("Error updating employee role:", employeeUpdateError);
        // Non-critical - auth role updated
      }

      return NextResponse.json({ 
        message: "Staff role updated successfully",
        role
      });
    }

    if (action === "suspend") {
      if (!staff_id) {
        return NextResponse.json({ error: "staff_id is required" }, { status: 400 });
      }

      // Get employee record
      const { data: employee, error: employeeError } = await serviceSupabase
        .from("employees")
        .select("*")
        .eq("id", staff_id)
        .single();

      if (employeeError || !employee) {
        return NextResponse.json({ error: "Employee not found" }, { status: 404 });
      }

      // Update employee portal status
      const { error: updateError } = await serviceSupabase
        .from("employees")
        .update({
          portal_status: "SUSPENDED",
          portal_suspended_at: new Date().toISOString()
        })
        .eq("id", staff_id);

      if (updateError) {
        console.error("Error suspending staff portal access:", updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      // Also disable auth account
      if (employee.auth_user_id) {
        const { error: authError } = await serviceSupabase.auth.admin.updateUserById(
          employee.auth_user_id,
          {
            user_metadata: {
              disabled: true
            }
          }
        );

        if (authError) {
          console.error("Error disabling auth account:", authError);
          // Non-critical - portal status updated
        }
      }

      return NextResponse.json({ 
        message: "Staff portal access suspended successfully",
        portal_status: "SUSPENDED"
      });
    }

    if (action === "restore") {
      if (!staff_id) {
        return NextResponse.json({ error: "staff_id is required" }, { status: 400 });
      }

      // Get employee record
      const { data: employee, error: employeeError } = await serviceSupabase
        .from("employees")
        .select("*")
        .eq("id", staff_id)
        .single();

      if (employeeError || !employee) {
        return NextResponse.json({ error: "Employee not found" }, { status: 404 });
      }

      // Update employee portal status
      const { error: updateError } = await serviceSupabase
        .from("employees")
        .update({
          portal_status: "ACTIVE",
          portal_suspended_at: null
        })
        .eq("id", staff_id);

      if (updateError) {
        console.error("Error restoring staff portal access:", updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      // Re-enable auth account
      if (employee.auth_user_id) {
        const { error: authError } = await serviceSupabase.auth.admin.updateUserById(
          employee.auth_user_id,
          {
            user_metadata: {
              disabled: false
            }
          }
        );

        if (authError) {
          console.error("Error re-enabling auth account:", authError);
          // Non-critical - portal status updated
        }
      }

      return NextResponse.json({ 
        message: "Staff portal access restored successfully",
        portal_status: "ACTIVE"
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Error in staff portal access endpoint:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
