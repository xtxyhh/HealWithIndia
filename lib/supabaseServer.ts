import { createServerClient } from "@supabase/ssr";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  console.log("[RUNTIME LOG] [lib/supabaseServer.ts:createClient] env check BEFORE createServerClient:", {
    URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    ANON: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SERVICE: !!process.env.SUPABASE_SERVICE_ROLE_KEY
  });
  console.log("[RUNTIME LOG] [lib/supabaseServer.ts:createClient] runtime check:", {
    VERCEL: process.env.VERCEL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_RUNTIME: process.env.NEXT_RUNTIME,
    VERCEL_ENV: process.env.VERCEL_ENV
  });
  console.log("[RUNTIME LOG] [lib/supabaseServer.ts:createClient] deployment check:", {
    BUILD_ID: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'unknown',
    COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
    DEPLOYMENT_URL: process.env.VERCEL_URL || 'unknown'
  });

  console.log("[CREATE SERVER CLIENT] BEFORE");
  let client;
  try {
    client = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );
    console.log("[CREATE SERVER CLIENT] AFTER");
  } catch (error: any) {
    console.error("[CREATE SERVER CLIENT] ERROR THROWN:", {
      message: error?.message,
      stack: error?.stack,
      cause: error?.cause,
      constructorName: error?.constructor?.name,
      file: "lib/supabaseServer.ts",
      line: 30
    });
    throw error;
  }
  return client;
}

// Create a service role client for admin operations
// This should ONLY be used in server-side API routes, never in client components
export function createServiceRoleClient() {
  // ── FORENSIC BLOCK START ─────────────────────────────────────────
  const urlValue   = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // 1. Existence and length
  console.log("[SVC-CLIENT FORENSIC] urlExists:", !!urlValue, "| serviceExists:", !!serviceKey, "| serviceLength:", serviceKey?.length ?? 'N/A');

  // 2. typeof
  console.log("[SVC-CLIENT FORENSIC] typeof urlValue:", typeof urlValue);
  console.log("[SVC-CLIENT FORENSIC] typeof serviceKey:", typeof serviceKey);

  // 3. Identity checks
  console.log("[SVC-CLIENT FORENSIC] serviceKey === undefined:", serviceKey === undefined);
  console.log("[SVC-CLIENT FORENSIC] serviceKey === \"\":", serviceKey === "");
  console.log("[SVC-CLIENT FORENSIC] serviceKey === null:", serviceKey === null);

  // 4. All SUPABASE-related key NAMES in process.env (no values)
  const supabaseEnvKeys = Object.keys(process.env).filter(k => k.includes("SUPABASE"));
  console.log("[SVC-CLIENT FORENSIC] process.env keys containing SUPABASE:", supabaseEnvKeys);

  // 5. Runtime / deployment context
  console.log("[SVC-CLIENT FORENSIC] runtime:", {
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_RUNTIME: process.env.NEXT_RUNTIME,
    DEPLOYMENT_URL: process.env.VERCEL_URL || 'unknown',
    COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
  });
  // ── FORENSIC BLOCK END ───────────────────────────────────────────

  console.log("[CREATE SERVICE ROLE CLIENT] BEFORE");
  let client;
  try {
    client = createSupabaseClient(
      urlValue!,
      serviceKey!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    console.log("[CREATE SERVICE ROLE CLIENT] AFTER — constructor succeeded");
  } catch (error: any) {
    console.error("[CREATE SERVICE ROLE CLIENT] ERROR THROWN:", {
      message: error?.message,
      stack: error?.stack,
      cause: error?.cause,
      constructorName: error?.constructor?.name,
      file: "lib/supabaseServer.ts",
      urlExistsAtThrow: !!urlValue,
      serviceExistsAtThrow: !!serviceKey,
      serviceLengthAtThrow: serviceKey?.length ?? 'N/A',
    });
    throw error;
  }
  return client;
}