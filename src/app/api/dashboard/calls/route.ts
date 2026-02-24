import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");
    const minScore = searchParams.get("minScore");

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    let query = supabase
      .from("calls")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (minScore) {
      query = query.gte("deal_intent_score", parseInt(minScore, 10));
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching calls:", error);
      return NextResponse.json(
        { error: "Failed to fetch calls" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in calls API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { id, businessId, ...updates } = body;

    if (!id || !businessId) {
      return NextResponse.json(
        { error: "Call ID and Business ID are required" },
        { status: 400 }
      );
    }

    const allowedFields = ["status", "is_read"];
    const sanitized: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in updates) {
        sanitized[key] = updates[key];
      }
    }

    if (Object.keys(sanitized).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("calls")
      .update(sanitized)
      .eq("id", id)
      .eq("business_id", businessId)
      .select()
      .single();

    if (error) {
      console.error("Error updating call:", error);
      return NextResponse.json(
        { error: "Failed to update call" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in calls PATCH:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
