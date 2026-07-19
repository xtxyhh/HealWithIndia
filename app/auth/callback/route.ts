import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/reset-password";

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // In route handlers cookies may not be settable in all contexts
          }
        },
        remove(name: string, options: Record<string, unknown>) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // In route handlers cookies may not be removable in all contexts
          }
        },
      },
    }
  );

  if (code) {
    // 1. Perform code exchange to authenticate the user specified by the code
    const { data: exchangeData, error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      console.log(
        "[AUTH CALLBACK] Code exchanged successfully. User:",
        exchangeData.user?.id
      );
      return NextResponse.redirect(new URL(next, request.url));
    }

    console.error("[AUTH CALLBACK] Code exchange error:", error.message);

    // 2. Fallback check (for browser prefetch where the code has already been consumed)
    const {
      data: { session: fallbackSession },
    } = await supabase.auth.getSession();

    if (fallbackSession) {
      const role = fallbackSession.user.app_metadata?.role;
      const isStaff = fallbackSession.user.user_metadata?.is_staff === true || (role && role !== "patient");
      
      // Only trust fallback session for patient flows (staff must re-authenticate to prevent admin session leak)
      if (!isStaff) {
        console.log("[AUTH CALLBACK] Using patient fallback session from prefetch");
        return NextResponse.redirect(new URL(next, request.url));
      }
    }
  }

  // If no code, or code exchange failed and no valid fallback exists, redirect to login page.
  // We preserve the hash fragment so the client-side AuthListener can parse the implicit flow recovery/invite token.
  return NextResponse.redirect(
    new URL("/patient-login?error=auth_callback_failed", request.url)
  );
}
