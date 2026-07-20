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

  let redirectUrl = "/patient-login?error=auth_callback_failed";

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
      const isStaff =
        fallbackSession.user.user_metadata?.is_staff === true ||
        (role && role !== "patient");

      // Only trust fallback session for patient flows (staff must re-authenticate to prevent admin session leak)
      if (!isStaff) {
        console.log("[AUTH CALLBACK] Using patient fallback session from prefetch");
        return NextResponse.redirect(new URL(next, request.url));
      }
    }
  } else {
    redirectUrl = "/patient-login?error=auth_callback_failed";
  }

  // If no valid code-based sign-in flow is available, preserve hash if present and forward to the next page.
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Signing in...</title>
  </head>
  <body>
    <script>
      const nextUrl = ${JSON.stringify(next)};
      const fallbackUrl = ${JSON.stringify(redirectUrl)};
      const hash = window.location.hash || "";
      if (hash) {
        window.location.replace(nextUrl + hash);
      } else {
        window.location.replace(fallbackUrl);
      }
    </script>
    <p>Signing you in...</p>
  </body>
</html>`;

  return new NextResponse(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export async function POST(request: Request) {
  return GET(request);
}
