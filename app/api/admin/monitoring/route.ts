import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { fetchMonitoringData } from "@/lib/monitoring/query";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Server-side authorization check - only allow authorized admins
    const appMetadata = user.app_metadata;
    const isAdmin =
      appMetadata?.role === "admin" ||
      appMetadata?.role === "super_admin" ||
      appMetadata?.role === "safety_operator";

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);

    // Validate and parse pagination parameters
    const pageParam = searchParams.get("page");
    const pageSizeParam = searchParams.get("page_size");

    let page = 1;
    let pageSize = 20;

    if (pageParam) {
      const parsedPage = parseInt(pageParam, 10);
      if (isNaN(parsedPage) || parsedPage < 1) {
        return NextResponse.json(
          { error: "Invalid page parameter" },
          { status: 400 }
        );
      }
      page = parsedPage;
    }

    if (pageSizeParam) {
      const parsedPageSize = parseInt(pageSizeParam, 10);
      if (isNaN(parsedPageSize) || parsedPageSize < 1 || parsedPageSize > 50) {
        return NextResponse.json(
          { error: "page_size must be between 1 and 50" },
          { status: 400 }
        );
      }
      pageSize = parsedPageSize;
    }

    const data = await fetchMonitoringData(supabase, page, pageSize);

    if (data.error) {
      return NextResponse.json(
        {
          error: "Failed to load monitoring data",
          details: data.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching monitoring data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
