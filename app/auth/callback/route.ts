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

  // Check if we already have an active session (e.g. from a prior code exchange or verify redirect).
  // This prevents double-consuming the one-time-use token from browser prefetches or email scanners.
  const {
    data: { session: existingSession },
  } = await supabase.auth.getSession();
  if (existingSession) {
    return NextResponse.redirect(new URL(next, request.url));
  }

  if (code) {
    const { data: exchangeData, error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      console.log(
        "[AUTH CALLBACK] Code exchanged for session. User:",
        exchangeData.user?.id
      );
      return NextResponse.redirect(new URL(next, request.url));
    }

    // Fallback: check if a concurrent request already set the session cookies
    const {
      data: { session: fallbackSession },
    } = await supabase.auth.getSession();
    if (fallbackSession) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // No code or code exchange failed — redirect to patient login with error
  return NextResponse.redirect(
    new URL("/patient-login?error=auth_callback_failed", request.url)
  );
}
