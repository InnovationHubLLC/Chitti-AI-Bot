import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockResults = {
      servicesCount: Math.floor(Math.random() * 15) + 5,
      faqsCount: Math.floor(Math.random() * 10) + 3,
    };

    return NextResponse.json(mockResults);
  } catch (error) {
    console.error("Error scanning website:", error);
    return NextResponse.json(
      { error: "Failed to scan website" },
      { status: 500 }
    );
  }
}
