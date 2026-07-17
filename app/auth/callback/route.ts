import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/reset-password';

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (err) {
            // Handle server action / route handler cookie setting edge cases
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (err) {
            // Handle cookie removal edge cases
          }
        },
      },
    }
  );

  // Check if we already have an active session (e.g. from a prior code exchange or verify redirect)
  const { data: { session: existingSession } } = await supabase.auth.getSession();
  if (existingSession) {
    console.log("[AUTH CALLBACK] Existing active session found. Redirecting straight to:", next);
    return NextResponse.redirect(new URL(next, request.url));
  }

  if (code) {
    console.log("[AUTH CALLBACK] Step 6: Resolving code exchange. next destination:", next);
    const { data: exchangeData, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      console.log("[AUTH CALLBACK] Step 6: Code successfully exchanged for session. User ID:", exchangeData.user?.id);
      return NextResponse.redirect(new URL(next, request.url));
    } else {
      console.error("[AUTH CALLBACK] Step 6: Failed to exchange code for session:", error.message);
      
      // Fallback check: Did another concurrent request/prefetch successfully set the session cookies anyway?
      const { data: { session: fallbackSession } } = await supabase.auth.getSession();
      if (fallbackSession) {
        console.log("[AUTH CALLBACK] Session found post-failure (concurrency/cookies set). Redirecting to:", next);
        return NextResponse.redirect(new URL(next, request.url));
      }
    }
  } else {
    console.warn("[AUTH CALLBACK] Step 6: No code parameter found in callback URL query params.");
  }

  console.log("[AUTH CALLBACK] Redirecting to fallback path.");
  return NextResponse.redirect(new URL(`/patient-login?error=auth_callback_failed`, request.url));
}
