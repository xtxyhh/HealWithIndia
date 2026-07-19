import { createBrowserClient } from "@supabase/ssr";

const clientInstance = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const supabase = clientInstance;