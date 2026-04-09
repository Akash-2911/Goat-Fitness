import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("query")

    if (!query || !query.trim()) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      )
    }

    // Use the more reliable Open Food Facts search endpoint
    const searchUrl =
      `https://world.openfoodfacts.org/cgi/search.pl` +
      `?search_terms=${encodeURIComponent(query.trim())}` +
      `&search_simple=1` +
      `&action=process` +
      `&json=1` +
      `&page_size=10` +
      `&fields=code,product_name,brands,nutriments,serving_size`

    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "GOATFitness/1.0 (contact@goatfitness.app)",
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      // If Open Food Facts is down try backup search
      return await backupSearch(query)
    }

    const contentType = response.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
      return await backupSearch(query)
    }

    const data = await response.json()
    const products = (data.products || []).filter(
      (p: any) => p.product_name && p.product_name.trim() !== ""
    )

    return NextResponse.json({ products })

  } catch (error) {
    console.error("Food search error:", error)
    return NextResponse.json(
      { error: "Failed to search foods. Please try again." },
      { status: 500 }
    )
  }
}

// Backup search using Open Food Facts v2 API
async function backupSearch(query: string) {
  try {
    const url = `https://world.openfoodfacts.org/api/v2/search?` +
      `categories_tags_en=${encodeURIComponent(query)}` +
      `&fields=code,product_name,brands,nutriments` +
      `&page_size=10`

    const response = await fetch(url, {
      headers: {
        "User-Agent": "GOATFitness/1.0",
        "Accept": "application/json",
      },
    })

    if (!response.ok) {
      return NextResponse.json({ products: [] })
    }

    const data = await response.json()
    return NextResponse.json({ products: data.products || [] })

  } catch {
    return NextResponse.json({ products: [] })
  }
}