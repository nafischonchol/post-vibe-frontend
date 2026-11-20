import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ platform: string }> }
) {
  const { platform } = await context.params;
  const searchParams = request.nextUrl.searchParams.toString();

  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    "https://api.mohima.skin/api/v1";

  // Strip trailing /api/v1 or /api to reach the base backend domain
  const backendBaseUrl = apiBase.replace(/\/api(\/v1)?\/?$/, "");

  const targetUrl = `${backendBaseUrl}/oauth/${platform}/callback${
    searchParams ? `?${searchParams}` : ""
  }`;

  return NextResponse.redirect(targetUrl);
}
