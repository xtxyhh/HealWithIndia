import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { createServiceRoleClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

console.log("[RUNTIME LOG] Imported helper");

export async function POST(request: NextRequest) {
  console.log("[RUNTIME LOG] Entered route");
  let lastCompletedStep = "None";
  try {
    // STEP 1 - get authenticated user
    console.log("[STEP 1] START");
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log("[STEP 1] SUCCESS");
    lastCompletedStep = "STEP 1 - get authenticated user";

    if (userError || !user) {
      if (userError) {
        console.error(userError);
        console.error(JSON.stringify(userError, null, 2));
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = user?.app_metadata?.role;
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    // STEP 2 - parse request body
    console.log("[STEP 2] START");
    const body = await request.json();
    console.log("[STEP 2] SUCCESS");
    lastCompletedStep = "STEP 2 - parse request body";

    const { patient_id, auth_user_id, action } = body;
    if (!patient_id || !action) {
      return NextResponse.json({ error: "patient_id and action are required" }, { status: 400 });
    }

    const serviceSupabase = createServiceRoleClient();

    if (action === "enable") {
      // STEP 3 - load patient
      console.log("[STEP 3] START");
      const { data: patient, error: patientError } = await serviceSupabase
        .from("patients")
        .select("email, full_name")
        .eq("id", patient_id)
        .single();
      console.log("[STEP 3] SUCCESS");
      lastCompletedStep = "STEP 3 - load patient";

      if (patientError || !patient) {
        if (patientError) {
          console.error(patientError);
          console.error(JSON.stringify(patientError, null, 2));
        }
        return NextResponse.json({ error: "Patient not found" }, { status: 404 });
      }

      if (!patient.email) {
        return NextResponse.json({ error: "Patient email is required" }, { status: 400 });
      }

      // STEP 4 - load patient_auth_mapping
      console.log("[STEP 4] START");
      const { data: initialMapping, error: initMapError } = await serviceSupabase
        .from("patient_auth_mapping")
        .select("*")
        .eq("patient_id", patient_id)
        .maybeSingle();
      console.log("[STEP 4] SUCCESS");
      lastCompletedStep = "STEP 4 - load patient_auth_mapping";

      if (initMapError) {
        console.error(initMapError);
        console.error(JSON.stringify(initMapError, null, 2));
      }

      let authUserId: string | null = null;
      let isNewUserCreated = false;

      if (initialMapping?.auth_user_id) {
        authUserId = initialMapping.auth_user_id;
      } else {
        // STEP 5 - create/reuse auth user
        console.log("[STEP 5] START - createUser");
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
        console.log("[STEP 5] SUCCESS - createUser");
        lastCompletedStep = "STEP 5 - create auth user attempt";

        if (newUser && !createError) {
          authUserId = newUser.user.id;
          isNewUserCreated = true;
        } else if (createError && (createError.message.includes("already exists") || createError.message.includes("already registered") || createError.status === 422 || createError.status === 400)) {
          console.log("[STEP 5a] SIBLING PATIENT START");
          const { data: siblingPatient, error: sibError } = await serviceSupabase
            .from("patients")
            .select("id")
            .eq("email", patient.email)
            .maybeSingle();
          console.log("[STEP 5a] SIBLING PATIENT SUCCESS");

          if (sibError) {
            console.error(sibError);
            console.error(JSON.stringify(sibError, null, 2));
          }

          if (siblingPatient) {
            console.log("[STEP 5b] SIBLING MAPPING START");
            const { data: siblingMapping, error: sibMapError } = await serviceSupabase
              .from("patient_auth_mapping")
              .select("auth_user_id")
              .eq("patient_id", siblingPatient.id)
              .maybeSingle();
            console.log("[STEP 5b] SIBLING MAPPING SUCCESS");

            if (sibMapError) {
              console.error(sibMapError);
              console.error(JSON.stringify(sibMapError, null, 2));
            }

            if (siblingMapping) {
              authUserId = siblingMapping.auth_user_id;
            }
          }

          if (!authUserId) {
            console.log("[STEP 5c] LIST USERS START");
            const { data: existingUsers, error: listError } = await serviceSupabase.auth.admin.listUsers();
            console.log("[STEP 5c] LIST USERS SUCCESS");

            if (listError) {
              console.error(listError);
              console.error(JSON.stringify(listError, null, 2));
              return NextResponse.json({ error: `Failed to resolve auth user: ${listError.message}` }, { status: 500 });
            }

            const foundUser = existingUsers?.users?.find((u: any) => u.email === patient.email);
            if (foundUser) {
              authUserId = foundUser.id;
            }
          }
          lastCompletedStep = "STEP 5 - reuse auth user resolved";
        } else {
          if (createError) {
            console.error(createError);
            console.error(JSON.stringify(createError, null, 2));
          }
          return NextResponse.json({ error: `Failed to create auth user: ${createError?.message}` }, { status: 500 });
        }
      }

      if (!authUserId) {
        return NextResponse.json({ error: "Failed to resolve or create auth account" }, { status: 500 });
      }

      // STEP 6 - enable_patient_portal_access RPC
      console.log("[STEP 6] START");
      const { error: mappingError } = await serviceSupabase.rpc("enable_patient_portal_access", {
        target_patient_id: patient_id,
        target_auth_user_id: authUserId
      });
      console.log("[STEP 6] SUCCESS");
      lastCompletedStep = "STEP 6 - enable_patient_portal_access RPC";

      if (mappingError) {
        console.error(mappingError);
        console.error(JSON.stringify(mappingError, null, 2));
        if (isNewUserCreated) {
          await serviceSupabase.auth.admin.deleteUser(authUserId);
        }
        return NextResponse.json({ error: `Failed to map portal access: ${mappingError.message}` }, { status: 500 });
      }

      // STEP 7 - inviteUserByEmail
      console.log("[STEP 7] START");
      const requestUrl = new URL(request.url);
      const inviteRedirectUrl = `${requestUrl.origin}/auth/callback?next=/reset-password`;
      const { error: inviteError } = await serviceSupabase.auth.admin.inviteUserByEmail(patient.email, {
        redirectTo: inviteRedirectUrl
      });
      console.log("[STEP 7] SUCCESS");
      lastCompletedStep = "STEP 7 - inviteUserByEmail";

      if (inviteError) {
        console.error(inviteError);
        console.error(JSON.stringify(inviteError, null, 2));
        if (initialMapping) {
          await serviceSupabase
            .from("patient_auth_mapping")
            .update({
              portal_access_status: initialMapping.portal_access_status,
              portal_access_enabled_at: initialMapping.portal_access_enabled_at,
              invite_sent_at: initialMapping.invite_sent_at
            })
            .eq("patient_id", patient_id);
        } else {
          await serviceSupabase
            .from("patient_auth_mapping")
            .delete()
            .eq("patient_id", patient_id);
        }
        if (isNewUserCreated) {
          await serviceSupabase.auth.admin.deleteUser(authUserId);
        }
        return NextResponse.json({ error: `Invite email could not be sent: ${inviteError.message}` }, { status: 500 });
      }

      // STEP 8 - reload mapping
      console.log("[STEP 8] START");
      const { data: updatedMapping, error: readError } = await serviceSupabase
        .from("patient_auth_mapping")
        .select("*")
        .eq("patient_id", patient_id)
        .eq("auth_user_id", authUserId)
        .single();
      console.log("[STEP 8] SUCCESS");
      lastCompletedStep = "STEP 8 - reload mapping";

      if (readError || !updatedMapping) {
        if (readError) {
          console.error(readError);
          console.error(JSON.stringify(readError, null, 2));
        }
        return NextResponse.json({ error: "Failed to read updated mapping" }, { status: 500 });
      }

      // STEP 9 - update invite timestamp
      console.log("[STEP 9] START");
      const { error: timestampError } = await serviceSupabase
        .from("patient_auth_mapping")
        .update({
          invite_sent_at: new Date().toISOString(),
          invite_resend_count: 0
        })
        .eq("auth_user_id", authUserId)
        .eq("patient_id", patient_id);
      console.log("[STEP 9] SUCCESS");
      lastCompletedStep = "STEP 9 - update invite timestamp";

      if (timestampError) {
        console.error(timestampError);
        console.error(JSON.stringify(timestampError, null, 2));
      }

      // STEP 10 - revalidatePath
      console.log("[STEP 10] START");
      revalidatePath("/admin/patient");
      revalidatePath(`/admin/patient/${patient_id}`);
      console.log("[STEP 10] SUCCESS");
      lastCompletedStep = "STEP 10 - revalidatePath";

      // STEP 11 - return success
      console.log("[STEP 11] START");
      console.log("[STEP 11] SUCCESS");
      return NextResponse.json({ 
        message: "Portal access updated successfully",
        portal_access_status: updatedMapping.portal_access_status,
        auth_user_id: authUserId
      });
    }

    if (action === "resend") {
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

      const { data: patient, error: patientError } = await serviceSupabase
        .from("patients")
        .select("email")
        .eq("id", patient_id)
        .single();

      if (patientError || !patient || !patient.email) {
        return NextResponse.json({ error: "Patient email not found" }, { status: 404 });
      }

      if (mapping.invite_sent_at) {
        const lastInviteTime = new Date(mapping.invite_sent_at).getTime();
        const currentTime = new Date().getTime();
        const cooldownMs = 5 * 60 * 1000;
        
        if (currentTime - lastInviteTime < cooldownMs) {
          return NextResponse.json({ 
            error: "Please wait 5 minutes before resending invite" 
          }, { status: 429 });
        }
      }

      const requestUrl = new URL(request.url);
      const inviteRedirectUrl = `${requestUrl.origin}/auth/callback?next=/reset-password`;

      const { error: inviteError } = await serviceSupabase.auth.admin.inviteUserByEmail(patient.email, {
        redirectTo: inviteRedirectUrl
      });

      if (inviteError) {
        return NextResponse.json({ error: "Failed to resend invite", details: inviteError.message }, { status: 500 });
      }

      const { error: updateError } = await serviceSupabase
        .from("patient_auth_mapping")
        .update({
          invite_sent_at: new Date().toISOString(),
          invite_resend_count: mapping.invite_resend_count + 1
        })
        .eq("patient_id", patient_id);

      if (updateError) {
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
      const { data, error } = await serviceSupabase
        .from("patient_auth_mapping")
        .update({
          portal_access_status: "SUSPENDED",
          portal_access_suspended_at: new Date().toISOString()
        })
        .eq("patient_id", patient_id)
        .select();

      if (error) {
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
      const { data, error } = await serviceSupabase
        .from("patient_auth_mapping")
        .update({
          portal_access_status: "ACTIVE",
          portal_access_suspended_at: null
        })
        .eq("patient_id", patient_id)
        .select();

      if (error) {
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

  } catch (error: any) {
    console.error("[PORTAL ACCESS ROUTE EXCEPTION] Caught error:", {
      message: error?.message,
      stack: error?.stack,
      cause: error?.cause,
      constructorName: error?.constructor?.name,
      file: "app/api/admin/patient/portal-access/route.ts"
    });
    return NextResponse.json({ 
      success: false,
      step: lastCompletedStep,
      message: error?.message || String(error),
      stack: error?.stack || null,
      cause: error?.cause || null,
      constructorName: error?.constructor?.name || null,
      file: "app/api/admin/patient/portal-access/route.ts"
    }, { status: 500 });
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

  } catch (error: any) {
    console.error("[PORTAL ACCESS GET EXCEPTION] Caught error:");
    console.error(error);
    if (error && error.stack) {
      console.error(error.stack);
    }
    if (error && error.message) {
      console.error(error.message);
    }
    try {
      console.error(JSON.stringify(error));
    } catch (e) {}
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error?.message || String(error),
      stack: error?.stack
    }, { status: 500 });
  }
}
