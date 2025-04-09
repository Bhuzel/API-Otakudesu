import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  const method = request.nextUrl.searchParams.get("method") || "GET"

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
      Referer: "https://otakudesu.cloud/",
    }

    const response = await fetch(url, {
      method,
      headers,
      redirect: "follow",
    })

    // Get the response body as text
    const text = await response.text()

    // Create a new response with the same status and headers
    const newResponse = new NextResponse(text, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "text/plain",
      },
    })

    // Add all the original headers to the new response
    response.headers.forEach((value, key) => {
      if (key !== "content-encoding" && key !== "content-length") {
        newResponse.headers.set(key, value)
      }
    })

    return newResponse
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 })
  }
}
