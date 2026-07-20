import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

function redirectWithCookies(url: URL, supabaseResponse: NextResponse) {
  const redirectResponse = NextResponse.redirect(url);

  supabaseResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  return redirectResponse;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: Record<string, unknown>) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    // Allow public access to the login page
    if (pathname === "/admin/login") {
      return response;
    }

    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Verify admin role from app_metadata
    const role = user.app_metadata?.role;
    const isStaff =
      user.user_metadata?.is_staff === true || (role && role !== "patient");

    if (!isStaff) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return redirectWithCookies(loginUrl, response);
    }

    // Enforce subpath-specific role permissions
    if (
      pathname.startsWith("/admin/employees") ||
      pathname.startsWith("/admin/users")
    ) {
      if (role !== "admin" && role !== "super_admin") {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("error", "forbidden");
        return redirectWithCookies(loginUrl, response);
      }
    }

    if (pathname.startsWith("/admin/revenue")) {
      if (
        role !== "admin" &&
        role !== "super_admin" &&
        role !== "finance"
      ) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("error", "forbidden");
        return redirectWithCookies(loginUrl, response);
      }
    }

    if (pathname.startsWith("/admin/settings")) {
      if (role !== "admin" && role !== "super_admin") {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("error", "forbidden");
        return redirectWithCookies(loginUrl, response);
      }
    }

    if (pathname.startsWith("/admin/safety")) {
      if (
        role !== "admin" &&
        role !== "super_admin" &&
        role !== "safety_operator"
      ) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("error", "forbidden");
        return redirectWithCookies(loginUrl, response);
      }
    }
  }

  // Protect patient safety hub
  if (pathname.startsWith("/safety")) {
    if (!user) {
      return NextResponse.redirect(new URL("/patient-login", request.url));
    }

    // Verify patient portal access via RPC
    const { data: hasAccess, error: accessError } =
      await supabase.rpc("verify_patient_portal_access");

    if (accessError || !hasAccess) {
      const loginUrl = new URL("/patient-login", request.url);
      loginUrl.searchParams.set("error", "no_access");
      return redirectWithCookies(loginUrl, response);
    }
  }

  // Protect patient portal
  if (pathname.startsWith("/patient")) {
    if (pathname === "/patient/login") {
      return response;
    }
    if (!user) {
      return NextResponse.redirect(new URL("/patient-login", request.url));
    }
  }

  // Protect coordinator portal
  if (pathname.startsWith("/coordinator")) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    const role = user.app_metadata?.role;
    if (role !== "coordinator" && role !== "admin" && role !== "super_admin") {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return redirectWithCookies(loginUrl, response);
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/safety/:path*", "/patient/:path*", "/coordinator/:path*"],
};
