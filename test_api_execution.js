const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load environment variables from .env.local
const envPath = '.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const serviceRoleKey = env['SUPABASE_SERVICE_ROLE_KEY'];

const serviceSupabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function run() {
  const patient_id = "17"; // Govind
  const action = "enable";

  console.log("[TEST] Starting enable process for patient_id:", patient_id);

  // Load patient data
  const { data: patient, error: patientError } = await serviceSupabase
    .from("patients")
    .select("email, full_name")
    .eq("id", patient_id)
    .single();

  if (patientError || !patient) {
    console.error("[TEST] Patient not found. error:", patientError);
    return;
  }

  console.log("[TEST] Patient email:", patient.email, "full_name:", patient.full_name);

  // Load initial mapping
  const { data: initialMapping } = await serviceSupabase
    .from("patient_auth_mapping")
    .select("*")
    .eq("patient_id", patient_id)
    .maybeSingle();

  console.log("[TEST] initialMapping:", initialMapping);

  let authUserId = null;
  let isNewUserCreated = false;

  if (initialMapping?.auth_user_id) {
    authUserId = initialMapping.auth_user_id;
  } else {
    console.log("[TEST] Creating new Auth user for email:", patient.email);
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
      console.log("[TEST] Created new Auth user with ID:", authUserId);
    } else {
      console.error("[TEST] Failed to create Auth user:", createError);
      return;
    }
  }

  console.log("[TEST] Calling database RPC enable_patient_portal_access. patient_id:", patient_id, "auth_user_id:", authUserId);
  const { error: mappingError } = await serviceSupabase.rpc("enable_patient_portal_access", {
    target_patient_id: patient_id,
    target_auth_user_id: authUserId
  });

  if (mappingError) {
    console.error("[TEST] RPC mapping error:", mappingError);
    if (isNewUserCreated) {
      await serviceSupabase.auth.admin.deleteUser(authUserId);
    }
    return;
  }

  console.log("[TEST] RPC mapping completed successfully.");

  // Invite result
  console.log("[TEST] Sending invite email to:", patient.email);
  const inviteRedirectUrl = `http://localhost:3000/auth/callback?next=/reset-password`;

  const { error: inviteError } = await serviceSupabase.auth.admin.inviteUserByEmail(patient.email, {
    redirectTo: inviteRedirectUrl
  });

  if (inviteError) {
    console.error("[TEST] Error sending invite:", inviteError);
    // Revert mapping
    await serviceSupabase
      .from("patient_auth_mapping")
      .delete()
      .eq("patient_id", patient_id);

    if (isNewUserCreated) {
      await serviceSupabase.auth.admin.deleteUser(authUserId);
    }
    return;
  }

  console.log("[TEST] Invite sent successfully.");

  // Read updated mapping
  const { data: updatedMapping, error: readError } = await serviceSupabase
    .from("patient_auth_mapping")
    .select("*")
    .eq("patient_id", patient_id)
    .eq("auth_user_id", authUserId)
    .single();

  if (readError || !updatedMapping) {
    console.error("[TEST] Error reading updated mapping:", readError);
    return;
  }

  console.log("[TEST] Updated mapping status read from db:", updatedMapping.portal_access_status);

  // Update invite timestamp
  const { error: timestampError } = await serviceSupabase
    .from("patient_auth_mapping")
    .update({
      invite_sent_at: new Date().toISOString(),
      invite_resend_count: 0
    })
    .eq("auth_user_id", authUserId)
    .eq("patient_id", patient_id);

  if (timestampError) {
    console.error("[TEST] Error updating invite timestamp:", timestampError);
  }

  console.log("[TEST] Success!");
}

run().catch(console.error);
