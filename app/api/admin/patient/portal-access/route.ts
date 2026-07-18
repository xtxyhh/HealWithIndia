/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { createServiceRoleClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
console.log("[MODULE EVALUATION] START - app/api/admin/patient/portal-access/route.ts");
console.log("[MODULE EVALUATION] env details:", {
  VERCEL_DEPLOYMENT_ID: process.env.VERCEL_DEPLOYMENT_ID,
  VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
  VERCEL_URL: process.env.VERCEL_URL,
  __filename: typeof __filename !== 'undefined' ? __filename : 'unknown',
  cwd: process.cwd()
});
console.log("[MODULE EVALUATION] SUCCESS - app/api/admin/patient/portal-access/route.ts");

export async function POST(request: NextRequest) {
  console.log("[ROUTE-TRACE 1] Entered POST handler function body");
  let lastCompletedStep = "None";
  try {
    let supabase;
    try {
      console.log("[ROUTE-TRACE 2] Before calling createClient()");
      supabase = await createClient();
      console.log("[ROUTE-TRACE 3] After calling createClient() successfully");
    } catch (err: any) {
    console.error("[ROUTE-TRACE ERROR] createClient() failed:", err);
    return NextResponse.json({
      success: false,
      step: "createClient invocation",
      message: err?.message || String(err),
      stack: err?.stack || null
    }, { status: 500 });
  }

  let user, userError;
  try {
    console.log("[ROUTE-TRACE 4] Before calling supabase.auth.getUser()");
    const res = await supabase.auth.getUser();
    user = res.data.user;
    userError = res.error;
    console.log("[ROUTE-TRACE 5] After calling supabase.auth.getUser() successfully");
  } catch (err: any) {
    console.error("[ROUTE-TRACE ERROR] supabase.auth.getUser() failed:", err);
    return NextResponse.json({
      success: false,
      step: "supabase.auth.getUser invocation",
      message: err?.message || String(err),
      stack: err?.stack || null
    }, { status: 500 });
  }

  try {
    console.log("[ROUTE-TRACE 6] Before checking userError / user existence");
    if (userError || !user) {
      console.log("[ROUTE-TRACE 6.1] Authorization check failed, userError:", userError, "userExists:", !!user);
      if (userError) {
        console.error(userError);
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("[ROUTE-TRACE 7] Authorization check passed");
    lastCompletedStep = "STEP 1 - get authenticated user";
  } catch (err: any) {
    console.error("[ROUTE-TRACE ERROR] Auth check logic failed:", err);
    throw err;
  }

  try {
    console.log("[ROUTE-TRACE 8] Before checking userRole");
    const userRole = user?.app_metadata?.role;
    console.log("[ROUTE-TRACE 8.1] userRole is:", userRole);
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      console.log("[ROUTE-TRACE 8.2] Forbidden: user is not admin/super_admin");
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }
    console.log("[ROUTE-TRACE 9] Role check passed");
  } catch (err: any) {
    console.error("[ROUTE-TRACE ERROR] Role check logic failed:", err);
    throw err;
  }

  let body;
  try {
    console.log("[ROUTE-TRACE 10] Before parsing request body via request.json()");
    body = await request.json();
    console.log("[ROUTE-TRACE 11] After parsing request body successfully");
    lastCompletedStep = "STEP 2 - parse request body";
  } catch (err: any) {
    console.error("[ROUTE-TRACE ERROR] request.json() failed:", err);
    return NextResponse.json({
      success: false,
      step: "request.json invocation",
      message: err?.message || String(err),
      stack: err?.stack || null
    }, { status: 500 });
  }

  let patient_id: any, auth_user_id: any, action: any;
  try {
    console.log("[ROUTE-TRACE 12] Before destructuring body parameters");
    patient_id = body.patient_id;
    auth_user_id = body.auth_user_id;
    action = body.action;
    console.log("[ROUTE-TRACE 13] Parameters:", { patient_id, auth_user_id, action });

    if (!patient_id || !action) {
      console.log("[ROUTE-TRACE 13.1] Validation failed: patient_id or action missing");
      return NextResponse.json({ error: "patient_id and action are required" }, { status: 400 });
    }
    console.log("[ROUTE-TRACE 14] Parameter validation passed");
  } catch (err: any) {
    console.error("[ROUTE-TRACE ERROR] Param parsing logic failed:", err);
    throw err;
  }

  let serviceSupabase;
  try {
    console.log("[ROUTE-TRACE 15] Before calling createServiceRoleClient()");
    serviceSupabase = createServiceRoleClient();
    console.log("[ROUTE-TRACE 16] After calling createServiceRoleClient() successfully");
  } catch (err: any) {
    console.error("[ROUTE-TRACE ERROR] createServiceRoleClient() failed:", err);
    return NextResponse.json({
      success: false,
      step: "createServiceRoleClient invocation",
      message: err?.message || String(err),
      stack: err?.stack || null
    }, { status: 500 });
  }

  if (action === "enable") {
    let patient, patientError;
    try {
      console.log("[ROUTE-TRACE 17] Before serviceSupabase.from('patients').select().eq().single()");
      const res = await serviceSupabase
        .from("patients")
        .select("email, full_name")
        .eq("id", patient_id)
        .single();
      patient = res.data;
      patientError = res.error;
      console.log("[ROUTE-TRACE 18] After querying patients table successfully");
      lastCompletedStep = "STEP 3 - load patient";
    } catch (err: any) {
      console.error("[ROUTE-TRACE ERROR] Querying patients failed:", err);
      return NextResponse.json({
        success: false,
        step: "Querying patients table",
        message: err?.message || String(err),
        stack: err?.stack || null
      }, { status: 500 });
    }

    try {
      console.log("[ROUTE-TRACE 19] Before checking patient validation");
      if (patientError || !patient) {
        console.log("[ROUTE-TRACE 19.1] Patient not found in DB");
        if (patientError) {
          console.error(patientError);
        }
        return NextResponse.json({ error: "Patient not found" }, { status: 404 });
      }

      if (!patient.email) {
        console.log("[ROUTE-TRACE 19.2] Patient email is missing in DB");
        return NextResponse.json({ error: "Patient email is required" }, { status: 400 });
      }
      console.log("[ROUTE-TRACE 20] Patient validation passed");
    } catch (err: any) {
      console.error("[ROUTE-TRACE ERROR] Patient validation logic failed:", err);
      throw err;
    }

    let initialMapping, initMapError;
    try {
      console.log("[ROUTE-TRACE 21] Before serviceSupabase.from('patient_auth_mapping').select().eq().maybeSingle()");
      const res = await serviceSupabase
        .from("patient_auth_mapping")
        .select("*")
        .eq("patient_id", patient_id)
        .maybeSingle();
      initialMapping = res.data;
      initMapError = res.error;
      console.log("[ROUTE-TRACE 22] After querying patient_auth_mapping table successfully");
      lastCompletedStep = "STEP 4 - load patient_auth_mapping";
    } catch (err: any) {
      console.error("[ROUTE-TRACE ERROR] Querying patient_auth_mapping failed:", err);
      return NextResponse.json({
        success: false,
        step: "Querying patient_auth_mapping table",
        message: err?.message || String(err),
        stack: err?.stack || null
      }, { status: 500 });
    }

    try {
      if (initMapError) {
        console.error("[ROUTE-TRACE ERROR] initMapError details:", initMapError);
      }
    } catch (err: any) {
      console.error("[ROUTE-TRACE ERROR] Logging initMapError failed:", err);
    }

    let authUserId: string | null = null;
    let isNewUserCreated = false;

    try {
      console.log("[ROUTE-TRACE 23] Checking if mapping has auth_user_id");
      if (initialMapping?.auth_user_id) {
        authUserId = initialMapping.auth_user_id;
        console.log("[ROUTE-TRACE 23.1] Reusing authUserId from mapping:", authUserId);
      } else {
        console.log("[ROUTE-TRACE 23.2] No auth_user_id in mapping, attempting to create auth user");
        
        let newUser, createError;
        try {
          console.log("[ROUTE-TRACE 24] Before calling serviceSupabase.auth.admin.createUser()");
          const res = await serviceSupabase.auth.admin.createUser({
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
          newUser = res.data;
          createError = res.error;
          console.log("[ROUTE-TRACE 25] After serviceSupabase.auth.admin.createUser() successfully");
        } catch (err: any) {
          console.error("[ROUTE-TRACE ERROR] createUser() invocation failed:", err);
          return NextResponse.json({
            success: false,
            step: "auth.admin.createUser invocation",
            message: err?.message || String(err),
            stack: err?.stack || null
          }, { status: 500 });
        }

        lastCompletedStep = "STEP 5 - create auth user attempt";

        if (newUser && newUser.user && !createError) {
          authUserId = newUser.user.id;
          isNewUserCreated = true;
          console.log("[ROUTE-TRACE 25.1] New auth user created successfully. authUserId:", authUserId);
        } else if (createError && (createError.message.includes("already exists") || createError.message.includes("already registered") || createError.status === 422 || createError.status === 400)) {
          console.log("[ROUTE-TRACE 25.2] User already exists error, searching sibling patients");
          
          let siblingPatient, sibError;
          try {
            console.log("[ROUTE-TRACE 26] Before serviceSupabase.from('patients').select('id').eq().maybeSingle()");
            const res = await serviceSupabase
              .from("patients")
              .select("id")
              .eq("email", patient.email)
              .maybeSingle();
            siblingPatient = res.data;
            sibError = res.error;
            console.log("[ROUTE-TRACE 27] After searching sibling patients successfully");
          } catch (err: any) {
            console.error("[ROUTE-TRACE ERROR] Sibling patient search failed:", err);
          }

          if (sibError) {
            console.error("[ROUTE-TRACE ERROR] sibError details:", sibError);
          }

          if (siblingPatient) {
            console.log("[ROUTE-TRACE 27.1] Found sibling patient, searching sibling mapping");
            let siblingMapping, sibMapError;
            try {
              console.log("[ROUTE-TRACE 28] Before serviceSupabase.from('patient_auth_mapping').select().eq().maybeSingle()");
              const res = await serviceSupabase
                .from("patient_auth_mapping")
                .select("auth_user_id")
                .eq("patient_id", siblingPatient.id)
                .maybeSingle();
              siblingMapping = res.data;
              sibMapError = res.error;
              console.log("[ROUTE-TRACE 29] After searching sibling mapping successfully");
            } catch (err: any) {
              console.error("[ROUTE-TRACE ERROR] Sibling mapping search failed:", err);
            }

            if (sibMapError) {
              console.error("[ROUTE-TRACE ERROR] sibMapError details:", sibMapError);
            }

            if (siblingMapping) {
              authUserId = siblingMapping.auth_user_id;
              console.log("[ROUTE-TRACE 29.1] Reusing sibling authUserId:", authUserId);
            }
          }

          if (!authUserId) {
            console.log("[ROUTE-TRACE 29.2] No sibling mapping found, calling listUsers()");
            let existingUsers, listError;
            try {
              console.log("[ROUTE-TRACE 30] Before serviceSupabase.auth.admin.listUsers()");
              const res = await serviceSupabase.auth.admin.listUsers();
              existingUsers = res.data;
              listError = res.error;
              console.log("[ROUTE-TRACE 31] After listUsers() successfully");
            } catch (err: any) {
              console.error("[ROUTE-TRACE ERROR] listUsers() failed:", err);
              return NextResponse.json({ error: `Failed to list users: ${err.message}` }, { status: 500 });
            }

            if (listError) {
              console.error("[ROUTE-TRACE ERROR] listError details:", listError);
              return NextResponse.json({ error: `Failed to resolve auth user: ${listError.message}` }, { status: 500 });
            }

            const foundUser = existingUsers?.users?.find((u: any) => u.email === patient.email);
            if (foundUser) {
              authUserId = foundUser.id;
              console.log("[ROUTE-TRACE 31.1] Found user in listUsers list. authUserId:", authUserId);
            }
          }
          lastCompletedStep = "STEP 5 - reuse auth user resolved";
        } else {
          if (createError) {
            console.error("[ROUTE-TRACE ERROR] createUser returned error:", createError);
          }
          return NextResponse.json({ error: `Failed to create auth user: ${createError?.message}` }, { status: 500 });
        }
      }
    } catch (err: any) {
      console.error("[ROUTE-TRACE ERROR] Auth resolution logic block failed:", err);
      return NextResponse.json({
        success: false,
        step: "Auth user resolution block",
        message: err?.message || String(err),
        stack: err?.stack || null
      }, { status: 500 });
    }

    try {
      if (!authUserId) {
        console.log("[ROUTE-TRACE ERROR] authUserId is still falsy after resolution");
        return NextResponse.json({ error: "Failed to resolve or create auth account" }, { status: 500 });
      }
    } catch (err: any) {
      console.error("[ROUTE-TRACE ERROR] authUserId check failed:", err);
      throw err;
    }

    let mappingError;
    try {
      console.log("[ROUTE-TRACE 32] Before serviceSupabase.rpc('enable_patient_portal_access')");
      const res = await serviceSupabase.rpc("enable_patient_portal_access", {
        target_patient_id: patient_id,
        target_auth_user_id: authUserId
      });
      mappingError = res.error;
      console.log("[ROUTE-TRACE 33] After serviceSupabase.rpc('enable_patient_portal_access') successfully");
      lastCompletedStep = "STEP 6 - enable_patient_portal_access RPC";
    } catch (err: any) {
      console.error("[ROUTE-TRACE ERROR] RPC call failed:", err);
      return NextResponse.json({
        success: false,
        step: "enable_patient_portal_access RPC invocation",
        message: err?.message || String(err),
        stack: err?.stack || null
      }, { status: 500 });
    }

    try {
      if (mappingError) {
        console.error("[ROUTE-TRACE ERROR] mappingError details:", mappingError);
        if (isNewUserCreated) {
          console.log("[ROUTE-TRACE 33.1] Deleting rollback user because mapping failed");
          await serviceSupabase.auth.admin.deleteUser(authUserId);
        }
        return NextResponse.json({ error: `Failed to map portal access: ${mappingError.message}` }, { status: 500 });
      }
    } catch (err: any) {
      console.error("[ROUTE-TRACE ERROR] Mapping error check failed:", err);
      throw err;
    }

    let inviteError;
    try {
      console.log("[ROUTE-TRACE 34] Before serviceSupabase.auth.admin.inviteUserByEmail()");
      const requestUrl = new URL(request.url);
      const inviteRedirectUrl = `${requestUrl.origin}/auth/callback?next=/reset-password`;
      const res = await serviceSupabase.auth.admin.inviteUserByEmail(patient.email, {
        redirectTo: inviteRedirectUrl
      });
      inviteError = res.error;
      console.log("[ROUTE-TRACE 34.5] inviteUserByEmail result: error=", inviteError?.message, "| status=", (inviteError as any)?.status, "| code=", (inviteError as any)?.code);

      // Handle the case where the user already has a confirmed account (422 email_exists).
      // inviteUserByEmail only works for accounts that have never been confirmed.
      // For existing confirmed users (e.g. the same email is also an admin account),
      // send a password recovery email via the GoTrue /recover endpoint instead.
      // This email has the same effect: the patient clicks the link, sets a password,
      // and gains access to their portal.
      if (
        inviteError &&
        ((inviteError as any)?.status === 422 ||
          (inviteError as any)?.code === 'email_exists' ||
          inviteError.message?.toLowerCase().includes('already'))
      ) {
        console.log("[ROUTE-TRACE 34.6] inviteUserByEmail returned email_exists — falling back to /recover REST call");
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        let recoverFailed = false;
        try {
          const recoverResponse = await fetch(`${supabaseUrl}/auth/v1/recover`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': serviceRoleKey,
              'Authorization': `Bearer ${serviceRoleKey}`,
            },
            body: JSON.stringify({
              email: patient.email,
              redirect_to: inviteRedirectUrl,
            }),
          });
          const recoverBody = await recoverResponse.text();
          console.log("[ROUTE-TRACE 34.7] /recover response status:", recoverResponse.status, "body:", recoverBody);
          if (!recoverResponse.ok) {
            console.error("[ROUTE-TRACE 34.8] /recover endpoint returned non-OK:", recoverResponse.status, recoverBody);
            // Recovery email failed — keep inviteError set so rollback runs below
            recoverFailed = true;
          }
        } catch (fetchErr: any) {
          console.error("[ROUTE-TRACE 34.8] /recover fetch threw:", fetchErr?.message);
          recoverFailed = true;
        }

        if (!recoverFailed) {
          // Recovery email sent — treat as success, clear inviteError
          console.log("[ROUTE-TRACE 34.9] Recovery email sent successfully — email_exists resolved");
          inviteError = null;
        }
        // If recoverFailed is true, inviteError remains set and rollback runs below
      }

      console.log("[ROUTE-TRACE 35] After invite/recovery flow. inviteError=", inviteError?.message ?? "none");
      lastCompletedStep = "STEP 7 - inviteUserByEmail";
    } catch (err: any) {
      console.error("[ROUTE-TRACE ERROR] inviteUserByEmail invocation failed:", err);
      return NextResponse.json({
        success: false,
        step: "inviteUserByEmail invocation",
        message: err?.message || String(err),
        stack: err?.stack || null
      }, { status: 500 });
    }

    try {
      if (inviteError) {
        console.error("[ROUTE-TRACE ERROR] inviteError details:", inviteError);
        if (initialMapping) {
          console.log("[ROUTE-TRACE 35.1] Restoring initial mapping state");
          await serviceSupabase
            .from("patient_auth_mapping")
            .update({
              portal_access_status: initialMapping.portal_access_status,
              portal_access_enabled_at: initialMapping.portal_access_enabled_at,
              invite_sent_at: initialMapping.invite_sent_at
            })
            .eq("patient_id", patient_id);
        } else {
          console.log("[ROUTE-TRACE 35.2] Deleting mapping state because it was a new enablement");
          await serviceSupabase
            .from("patient_auth_mapping")
            .delete()
            .eq("patient_id", patient_id);
        }
        if (isNewUserCreated) {
          console.log("[ROUTE-TRACE 35.3] Deleting rollback user because invite failed");
          await serviceSupabase.auth.admin.deleteUser(authUserId!);
        }
        return NextResponse.json({ error: `Invite email could not be sent: ${inviteError.message}` }, { status: 500 });
      }
    } catch (err: any) {
      console.error("[ROUTE-TRACE ERROR] Invite error checks failed:", err);
      throw err;
    }

    let updatedMapping, readError;
    try {
      console.log("[ROUTE-TRACE 36] Before serviceSupabase.from('patient_auth_mapping').select().eq().single()");
      const res = await serviceSupabase
        .from("patient_auth_mapping")
        .select("*")
        .eq("patient_id", patient_id)
        .eq("auth_user_id", authUserId)
        .single();
      updatedMapping = res.data;
      readError = res.error;
      console.log("[ROUTE-TRACE 37] After serviceSupabase.from('patient_auth_mapping').select().eq().single() successfully");
      lastCompletedStep = "STEP 8 - reload mapping";
    } catch (err: any) {
      console.error("[ROUTE-TRACE ERROR] Querying updatedMapping failed:", err);
      return NextResponse.json({
        success: false,
        step: "Querying updated patient_auth_mapping table",
        message: err?.message || String(err),
        stack: err?.stack || null
      }, { status: 500 });
    }

    try {
      if (readError || !updatedMapping) {
        console.log("[ROUTE-TRACE ERROR] readError details:", readError);
        return NextResponse.json({ error: "Failed to read updated mapping" }, { status: 500 });
      }
    } catch (err: any) {
      console.error("[ROUTE-TRACE ERROR] updatedMapping check failed:", err);
      throw err;
    }

    let timestampError;
    try {
      console.log("[ROUTE-TRACE 38] Before serviceSupabase.from('patient_auth_mapping').update().eq()");
      const res = await serviceSupabase
        .from("patient_auth_mapping")
        .update({
          invite_sent_at: new Date().toISOString(),
          invite_resend_count: 0
        })
        .eq("auth_user_id", authUserId)
        .eq("patient_id", patient_id);
      timestampError = res.error;
      console.log("[ROUTE-TRACE 39] After serviceSupabase.from('patient_auth_mapping').update().eq() successfully");
      lastCompletedStep = "STEP 9 - update invite timestamp";
    } catch (err: any) {
      console.error("[ROUTE-TRACE ERROR] Updating timestamp failed:", err);
    }

    try {
      if (timestampError) {
        console.error("[ROUTE-TRACE ERROR] timestampError details:", timestampError);
      }
    } catch (err: any) {
      console.error("[ROUTE-TRACE ERROR] Logging timestampError failed:", err);
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
      console.log("[POST RESEND] START");
      console.log("[POST RESEND 1] Before serviceSupabase.from('patient_auth_mapping').select().single()");
      const { data: mapping, error: mappingError } = await serviceSupabase
        .from("patient_auth_mapping")
        .select("*")
        .eq("patient_id", patient_id)
        .single();
      console.log("[POST RESEND 2] Mapping query completed, hasMapping:", !!mapping, "error:", mappingError?.message);

      if (mappingError || !mapping) {
        console.log("[POST RESEND 2.1] Error: Portal access not found");
        return NextResponse.json({ error: "Portal access not found" }, { status: 404 });
      }

      if (mapping.portal_access_status !== "INVITE_PENDING") {
        console.log("[POST RESEND 2.2] Error: Can only resend invite for pending status, current status:", mapping.portal_access_status);
        return NextResponse.json({ error: "Can only resend invite for pending status" }, { status: 400 });
      }

      console.log("[POST RESEND 3] Before serviceSupabase.from('patients').select().single()");
      const { data: patient, error: patientError } = await serviceSupabase
        .from("patients")
        .select("email")
        .eq("id", patient_id)
        .single();
      console.log("[POST RESEND 4] Patient query completed, hasEmail:", !!patient?.email, "error:", patientError?.message);

      if (patientError || !patient || !patient.email) {
        console.log("[POST RESEND 4.1] Error: Patient email not found");
        return NextResponse.json({ error: "Patient email not found" }, { status: 404 });
      }

      if (mapping.invite_sent_at) {
        const lastInviteTime = new Date(mapping.invite_sent_at).getTime();
        const currentTime = new Date().getTime();
        const cooldownMs = 5 * 60 * 1000;
        
        if (currentTime - lastInviteTime < cooldownMs) {
          console.log("[POST RESEND 4.2] Error: Cooldown active. Last invite at:", mapping.invite_sent_at);
          return NextResponse.json({ 
            error: "Please wait 5 minutes before resending invite" 
          }, { status: 429 });
        }
      }

      const requestUrl = new URL(request.url);
      const inviteRedirectUrl = `${requestUrl.origin}/auth/callback?next=/reset-password`;

      console.log("[POST RESEND 5] Before serviceSupabase.auth.admin.inviteUserByEmail()");
      const { error: inviteError } = await serviceSupabase.auth.admin.inviteUserByEmail(patient.email, {
        redirectTo: inviteRedirectUrl
      });
      console.log("[POST RESEND 6] Invite user completed, error:", inviteError?.message);

      if (inviteError) {
        console.log("[POST RESEND 6.1] Invite error occurred. Trying recovery fallback if email exists.");
        if ((inviteError as any)?.status === 422 || (inviteError as any)?.code === 'email_exists' || inviteError.message?.toLowerCase().includes('already')) {
          console.log("[POST RESEND 6.2] Falling back to direct /recover call");
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
          const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
          let recoverFailed = false;
          try {
            const recoverResponse = await fetch(`${supabaseUrl}/auth/v1/recover`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': serviceRoleKey,
                'Authorization': `Bearer ${serviceRoleKey}`,
              },
              body: JSON.stringify({
                email: patient.email,
                redirect_to: inviteRedirectUrl,
              }),
            });
            const recoverBody = await recoverResponse.text();
            console.log("[POST RESEND 6.3] /recover response status:", recoverResponse.status, "body:", recoverBody);
            if (!recoverResponse.ok) {
              recoverFailed = true;
            }
          } catch (fetchErr: any) {
            console.error("[POST RESEND 6.4] /recover fetch threw:", fetchErr?.message);
            recoverFailed = true;
          }

          if (!recoverFailed) {
            console.log("[POST RESEND 6.5] Recovery fallback succeeded!");
          } else {
            return NextResponse.json({ error: "Failed to resend invite", details: inviteError.message }, { status: 500 });
          }
        } else {
          return NextResponse.json({ error: "Failed to resend invite", details: inviteError.message }, { status: 500 });
        }
      }

      console.log("[POST RESEND 7] Before serviceSupabase.from('patient_auth_mapping').update()");
      const { error: updateError } = await serviceSupabase
        .from("patient_auth_mapping")
        .update({
          invite_sent_at: new Date().toISOString(),
          invite_resend_count: mapping.invite_resend_count + 1
        })
        .eq("patient_id", patient_id);
      console.log("[POST RESEND 8] Update query completed, error:", updateError?.message);

      if (updateError) {
        console.log("[POST RESEND 8.1] Error: Failed to update mapping timestamp");
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      console.log("[POST RESEND 9] Before revalidatePath calls");
      revalidatePath("/admin/patient");
      revalidatePath(`/admin/patient/${patient_id}`);
      console.log("[POST RESEND 10] After revalidatePath calls");

      console.log("[POST RESEND] SUCCESS");
      return NextResponse.json({ 
        message: "Invite resent successfully",
        portal_access_status: "INVITE_PENDING"
      });
    }

    if (action === "suspend") {
      console.log("[POST SUSPEND] START");
      console.log("[POST SUSPEND 1] Before serviceSupabase.from('patient_auth_mapping').update().select()");
      const { data, error } = await serviceSupabase
        .from("patient_auth_mapping")
        .update({
          portal_access_status: "SUSPENDED",
          portal_access_suspended_at: new Date().toISOString()
        })
        .eq("patient_id", patient_id)
        .select();
      console.log("[POST SUSPEND 2] Mapping update completed, count:", data?.length, "error:", error?.message);

      if (error) {
        console.log("[POST SUSPEND 2.1] Error: Failed to suspend portal access");
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      if (!data || data.length === 0) {
        console.log("[POST SUSPEND 2.2] Error: Mapping not found");
        return NextResponse.json({ error: "Portal access mapping not found" }, { status: 404 });
      }

      console.log("[POST SUSPEND 3] Before revalidatePath calls");
      revalidatePath("/admin/patient");
      revalidatePath(`/admin/patient/${patient_id}`);
      console.log("[POST SUSPEND 4] After revalidatePath calls");

      console.log("[POST SUSPEND] SUCCESS");
      return NextResponse.json({ 
        message: "Portal access suspended successfully",
        portal_access_status: "SUSPENDED"
      });
    }

    if (action === "restore") {
      console.log("[POST RESTORE] START");
      console.log("[POST RESTORE 1] Before serviceSupabase.from('patient_auth_mapping').update().select()");
      const { data, error } = await serviceSupabase
        .from("patient_auth_mapping")
        .update({
          portal_access_status: "ACTIVE",
          portal_access_suspended_at: null
        })
        .eq("patient_id", patient_id)
        .select();
      console.log("[POST RESTORE 2] Mapping update completed, count:", data?.length, "error:", error?.message);

      if (error) {
        console.log("[POST RESTORE 2.1] Error: Failed to restore portal access");
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      if (!data || data.length === 0) {
        console.log("[POST RESTORE 2.2] Error: Mapping not found");
        return NextResponse.json({ error: "Portal access mapping not found" }, { status: 404 });
      }

      console.log("[POST RESTORE 3] Before revalidatePath calls");
      revalidatePath("/admin/patient");
      revalidatePath(`/admin/patient/${patient_id}`);
      console.log("[POST RESTORE 4] After revalidatePath calls");

      console.log("[POST RESTORE] SUCCESS");
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
  console.log("[GET PORTAL ACCESS] START");
  try {
    console.log("[GET PORTAL ACCESS 1] Before calling createClient()");
    const supabase = await createClient();
    console.log("[GET PORTAL ACCESS 2] After calling createClient() successfully");

    console.log("[GET PORTAL ACCESS 3] Before calling supabase.auth.getUser()");
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log("[GET PORTAL ACCESS 4] After calling supabase.auth.getUser() successfully, userExists:", !!user, "error:", userError?.message);

    if (userError || !user) {
      console.log("[GET PORTAL ACCESS 4.1] Error: Unauthorized user request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = user?.app_metadata?.role;
    console.log("[GET PORTAL ACCESS 4.2] userRole:", userRole);
    if (userRole !== 'admin' && userRole !== 'super_admin' && userRole !== 'coordinator') {
      console.log("[GET PORTAL ACCESS 4.3] Error: Forbidden access");
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const patient_id = searchParams.get("patient_id");
    console.log("[GET PORTAL ACCESS 4.4] Query parameter patient_id:", patient_id);

    if (!patient_id) {
      console.log("[GET PORTAL ACCESS 4.5] Error: patient_id parameter is required");
      return NextResponse.json({ error: "patient_id is required" }, { status: 400 });
    }

    console.log("[GET PORTAL ACCESS 5] Before calling createServiceRoleClient()");
    const serviceSupabase = createServiceRoleClient();
    console.log("[GET PORTAL ACCESS 6] After calling createServiceRoleClient() successfully");

    console.log("[GET PORTAL ACCESS 7] Before querying patient_auth_mapping table");
    const { data, error } = await serviceSupabase
      .from("patient_auth_mapping")
      .select("*")
      .eq("patient_id", patient_id)
      .single();
    console.log("[GET PORTAL ACCESS 8] Query result mappingExists:", !!data, "error:", error?.message, "code:", error?.code);

    if (error) {
      if (error.code === 'PGRST116') {
        console.log("[GET PORTAL ACCESS 8.1] Query returned no row (PGRST116), status is NOT_ENABLED");
        return NextResponse.json({ 
          portal_access_status: "NOT_ENABLED",
          has_mapping: false
        });
      }
      console.log("[GET PORTAL ACCESS 8.2] Query returned error, failing request");
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("[GET PORTAL ACCESS] SUCCESS");
    return NextResponse.json({
      portal_access_status: data.portal_access_status,
      portal_access_enabled_at: data.portal_access_enabled_at,
      portal_access_suspended_at: data.portal_access_suspended_at,
      invite_sent_at: data.invite_sent_at,
      invite_resend_count: data.invite_resend_count,
      has_mapping: true
    });

  } catch (error: any) {
    console.error("[PORTAL ACCESS GET EXCEPTION] Caught error:", {
      message: error?.message,
      stack: error?.stack,
      cause: error?.cause,
      constructorName: error?.constructor?.name,
      file: "app/api/admin/patient/portal-access/route.ts"
    });
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error?.message || String(error),
      stack: error?.stack
    }, { status: 500 });
  }
}
