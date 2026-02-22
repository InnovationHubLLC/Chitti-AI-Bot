import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { businessId } = body;

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    const { data: testCall, error: callError } = await supabase
      .from("test_calls")
      .insert({ business_id: businessId, status: "pending" })
      .select()
      .maybeSingle();

    if (callError) {
      console.error("Error creating test call:", callError);
      return NextResponse.json(
        { error: "Failed to create test call" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: testCall });
  } catch (error) {
    console.error("Error in test-call API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    const { data: testCall, error: callError } = await supabase
      .from("test_calls")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (callError) {
      console.error("Error fetching test call:", callError);
      return NextResponse.json(
        { error: "Failed to fetch test call" },
        { status: 500 }
      );
    }

    if (!testCall) {
      return NextResponse.json({ success: true, data: null });
    }

    const { data: transcripts } = await supabase
      .from("call_transcripts")
      .select("*")
      .eq("test_call_id", testCall.id)
      .order("timestamp_offset");

    const { data: analysis } = await supabase
      .from("call_analysis")
      .select("*")
      .eq("test_call_id", testCall.id)
      .maybeSingle();

    return NextResponse.json({
      success: true,
      data: { ...testCall, transcripts, analysis },
    });
  } catch (error) {
    console.error("Error in test-call API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
