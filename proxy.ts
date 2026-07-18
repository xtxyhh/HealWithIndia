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
  const cookieNames = request.cookies.getAll().map(c => c.name);
  console.log("[TEMPORARY AUDIT LOG proxy.ts] First Line. pathname:", pathname);
  console.log("[TEMPORARY AUDIT LOG proxy.ts] Cookie names received:", JSON.stringify(cookieNames));

  const response = NextResponse.next({
    request,
  });

  console.log("[RUNTIME LOG] [proxy.ts] env check BEFORE createServerClient:", {
    URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    ANON: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SERVICE: !!process.env.SUPABASE_SERVICE_ROLE_KEY
  });
  console.log("[RUNTIME LOG] [proxy.ts] runtime check:", {
    VERCEL: process.env.VERCEL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_RUNTIME: process.env.NEXT_RUNTIME,
    VERCEL_ENV: process.env.VERCEL_ENV
  });
  console.log("[RUNTIME LOG] [proxy.ts] deployment check:", {
    BUILD_ID: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'unknown',
    COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
    DEPLOYMENT_URL: process.env.VERCEL_URL || 'unknown'
  });

  console.log("[CREATE PROXY SERVER CLIENT] BEFORE");
  let supabase;
  try {
    supabase = createServerClient(
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
    console.log("[CREATE PROXY SERVER CLIENT] AFTER");
  } catch (error: any) {
    console.error("[CREATE PROXY SERVER CLIENT] ERROR THROWN:", {
      message: error?.message,
      stack: error?.stack,
      cause: error?.cause,
      constructorName: error?.constructor?.name,
      file: "proxy.ts",
      line: 60
    });
    throw error;
  }

  const { data: { user } } = await supabase.auth.getUser();
  console.log("[TEMPORARY AUDIT LOG proxy.ts] getUser() user resolved:", !!user);
  if (user) {
    console.log("[TEMPORARY AUDIT LOG proxy.ts] user.id:", user.id);
    console.log("[TEMPORARY AUDIT LOG proxy.ts] user.email:", user.email);
    console.log("[TEMPORARY AUDIT LOG proxy.ts] user.app_metadata.role:", user.app_metadata?.role);
    console.log("[TEMPORARY AUDIT LOG proxy.ts] user.user_metadata:", JSON.stringify(user.user_metadata));
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    // Allow access to login page
    if (pathname === '/admin/login') {
      console.log("[TEMPORARY AUDIT LOG proxy.ts] Allowing public admin login page path");
      return response;
    }
    
    if (!user) {
      console.log("[TEMPORARY AUDIT LOG proxy.ts] Redirect trigger: NO USER. Redirecting /admin/* -> /admin/login");
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    // Verify admin role from app_metadata and user_metadata
    const role = user.app_metadata?.role;
    const isStaff = user.user_metadata?.is_staff === true || (role && role !== "patient");
    
    if (!isStaff) {
      console.log("[TEMPORARY AUDIT LOG proxy.ts] Redirect trigger: ROLE FAILED / UNAUTHORIZED. role:", role, "isStaff:", isStaff);
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('error', 'unauthorized');
      return redirectWithCookies(loginUrl, response);
    }

    // Enforce subpath-specific permissions
    
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
