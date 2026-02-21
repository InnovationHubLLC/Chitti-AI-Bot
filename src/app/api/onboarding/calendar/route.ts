import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const {
      businessId,
      integrationType,
      calendarEmail,
      defaultDurationMinutes,
      bufferTimeMinutes,
      advanceBookingDays,
      sameDayCutoffTime,
    } = body;

    if (!businessId || !integrationType) {
      return NextResponse.json(
        { error: "Business ID and integration type are required" },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from("calendar_settings")
      .select("id")
      .eq("business_id", businessId)
      .maybeSingle();

    const settingsData = {
      business_id: businessId,
      integration_type: integrationType,
      calendar_email: calendarEmail || null,
      default_duration_minutes: defaultDurationMinutes || 60,
      buffer_time_minutes: bufferTimeMinutes || 15,
      advance_booking_days: advanceBookingDays || 30,
      same_day_cutoff_time: sameDayCutoffTime || "16:00",
    };

    let data, error;

    if (existing) {
      const result = await supabase
        .from("calendar_settings")
        .update(settingsData)
        .eq("id", existing.id)
        .select();
      data = result.data;
      error = result.error;
    } else {
      const result = await supabase
        .from("calendar_settings")
        .insert(settingsData)
        .select();
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error("Error saving calendar settings:", error);
      return NextResponse.json(
        { error: "Failed to save calendar settings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in calendar API:", error);
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
      .from("calendar_settings")
      .select("*")
      .eq("business_id", businessId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching calendar settings:", error);
      return NextResponse.json(
        { error: "Failed to fetch calendar settings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in calendar API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
