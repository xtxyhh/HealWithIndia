import { createServerClient } from "@supabase/ssr";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { cookies } from "next/headers";

export async function createClient() {

  const cookieStore = await cookies();

  return createServerClient(

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

}

// Create a service role client for admin operations
// This should ONLY be used in server-side API routes, never in client components
export function createServiceRoleClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}