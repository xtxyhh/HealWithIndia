import { createBrowserClient } from "@supabase/ssr";

console.log("[RUNTIME LOG] [lib/supabase.ts] EARLY INITIALIZATION AT IMPORT");
console.log("[RUNTIME LOG] [lib/supabase.ts] env check BEFORE createBrowserClient:", {
  URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  ANON: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SERVICE: !!process.env.SUPABASE_SERVICE_ROLE_KEY
});
console.log("[RUNTIME LOG] [lib/supabase.ts] runtime check:", {
  VERCEL: process.env.VERCEL,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_RUNTIME: process.env.NEXT_RUNTIME,
  VERCEL_ENV: process.env.VERCEL_ENV
});
console.log("[RUNTIME LOG] [lib/supabase.ts] deployment check:", {
  BUILD_ID: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'unknown',
  COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
  DEPLOYMENT_URL: process.env.VERCEL_URL || 'unknown'
});

console.log("[CREATE BROWSER CLIENT] BEFORE");
let clientInstance;
try {
  clientInstance = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  console.log("[CREATE BROWSER CLIENT] AFTER");
} catch (error: any) {
  console.error("[CREATE BROWSER CLIENT] ERROR THROWN:", {
    message: error?.message,
    stack: error?.stack,
    cause: error?.cause,
    constructorName: error?.constructor?.name,
    file: "lib/supabase.ts",
    line: 25
  });
  throw error;
}

export const supabase = clientInstance;