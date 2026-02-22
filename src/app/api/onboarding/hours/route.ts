import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { businessId, hours } = body;

    if (!businessId || !hours || !Array.isArray(hours)) {
      return NextResponse.json(
        { error: "Business ID and hours array are required" },
        { status: 400 }
      );
    }

    await supabase.from("business_hours").delete().eq("business_id", businessId);

    const hoursToInsert = hours.map((dayHours: { dayOfWeek: number; isClosed: boolean; openTime: string | null; closeTime: string | null }) => ({
      business_id: businessId,
      day_of_week: dayHours.dayOfWeek,
      is_closed: dayHours.isClosed,
      open_time: dayHours.openTime || null,
      close_time: dayHours.closeTime || null,
    }));

    const { data, error } = await supabase
      .from("business_hours")
      .insert(hoursToInsert)
      .select();

    if (error) {
      console.error("Error saving business hours:", error);
      return NextResponse.json(
        { error: "Failed to save business hours" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in hours API:", error);
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

    const { data, error } = await supabase
      .from("business_hours")
      .select("*")
      .eq("business_id", businessId)
      .order("day_of_week");

    if (error) {
      console.error("Error fetching business hours:", error);
      return NextResponse.json(
        { error: "Failed to fetch business hours" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in hours API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
