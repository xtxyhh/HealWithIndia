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
  const response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(
          name: string,
          value: string,
          options: Record<string, unknown>
        ) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(
          name: string,
          options: Record<string, unknown>
        ) {
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page
    if (request.nextUrl.pathname === '/admin/login') {
      return response;
    }
    
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    // Verify admin role from app_metadata
    const role = user.app_metadata?.role;
    // All CRM staff roles — sidebar filters what each role can see
    const allowedRoles = [
      'admin',
      'super_admin',
      'safety_operator',
      'coordinator',
      'doctor',
      'reception',
      'finance',
      'support',
      'hospital_partner',
    ];
    const isAuthorized = allowedRoles.includes(role);
    
    if (!isAuthorized) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('error', 'unauthorized');
      return redirectWithCookies(loginUrl, response);
    }

    // Enforce subpath-specific permissions
    const pathname = request.nextUrl.pathname;
    
    if (pathname.startsWith('/admin/employees') || pathname.startsWith('/admin/users')) {
      if (role !== 'admin' && role !== 'super_admin') {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('error', 'forbidden');
        return redirectWithCookies(loginUrl, response);
      }
    }
    
    if (pathname.startsWith('/admin/revenue')) {
      if (role !== 'admin' && role !== 'super_admin' && role !== 'finance') {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('error', 'forbidden');
        return redirectWithCookies(loginUrl, response);
      }
    }
    
    if (pathname.startsWith('/admin/settings')) {
      if (role !== 'admin' && role !== 'super_admin') {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('error', 'forbidden');
        return redirectWithCookies(loginUrl, response);
      }
    }
    
    if (pathname.startsWith('/admin/safety')) {
      if (role !== 'admin' && role !== 'super_admin' && role !== 'safety_operator') {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('error', 'forbidden');
        return redirectWithCookies(loginUrl, response);
      }
    }
  }

  // Protect patient safety hub
  if (request.nextUrl.pathname.startsWith('/safety')) {
    if (!user) {
      return NextResponse.redirect(new URL('/patient-login', request.url));
    }
    
    // Verify patient portal access
    const { data: hasAccess, error: accessError } = await supabase.rpc('verify_patient_portal_access');
    
    if (accessError || !hasAccess) {
      const loginUrl = new URL('/patient-login', request.url);
      loginUrl.searchParams.set('error', 'no_access');
      return redirectWithCookies(loginUrl, response);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/safety/:path*",
  ],
};
