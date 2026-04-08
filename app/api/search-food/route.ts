import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("query");

    if (!query || !query.trim()) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const searchUrl =
      `https://world.openfoodfacts.org/cgi/search.pl` +
      `?search_terms=${encodeURIComponent(query)}` +
      `&search_simple=1` +
      `&action=process` +
      `&json=1` +
      `&page_size=20` +
      `&fields=code,product_name,brands,nutriments`;

    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "GOAT-Fitness-SAIT/1.0",
      },
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") || "";
    const rawText = await response.text();

    if (!response.ok) {
      console.error("Open Food Facts response error:", rawText);

      return NextResponse.json(
        { error: "Failed to fetch food data from Open Food Facts" },
        { status: response.status }
      );
    }

    if (!contentType.includes("application/json")) {
      console.error("Expected JSON but got:", rawText);

      return NextResponse.json(
        { error: "Open Food Facts returned non-JSON response" },
        { status: 500 }
      );
    }

    const data = JSON.parse(rawText);

    return NextResponse.json({
      products: data.products || [],
    });
  } catch (error) {
    console.error("Food search API error:", error);

    return NextResponse.json(
      { error: "Internal server error while searching food" },
      { status: 500 }
    );
  }
}