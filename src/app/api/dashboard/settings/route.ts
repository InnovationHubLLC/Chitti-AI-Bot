import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
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

    const [businessResult, hoursResult] = await Promise.all([
      supabase
        .from("businesses")
        .select("*")
        .eq("id", businessId)
        .single(),
      supabase
        .from("business_hours")
        .select("*")
        .eq("business_id", businessId)
        .order("day_of_week"),
    ]);

    if (businessResult.error) {
      console.error("Error fetching business:", businessResult.error);
      return NextResponse.json(
        { error: "Failed to fetch business data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        business: businessResult.data,
        hours: hoursResult.data ?? [],
      },
    });
  } catch (error) {
    console.error("Error in settings GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { businessId, section, ...data } = body;

    if (!businessId || !section) {
      return NextResponse.json(
        { error: "Business ID and section are required" },
        { status: 400 }
      );
    }

    if (section === "profile") {
      const { error } = await supabase
        .from("businesses")
        .update({
          business_name: data.name,
          industry: data.industry,
          business_state: data.state,
          owner_name: data.ownerName,
          phone_number: data.phone,
          website_url: data.websiteUrl,
        })
        .eq("id", businessId);

      if (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }

    if (section === "hours") {
      const hoursArray = data.hours;
      if (!Array.isArray(hoursArray)) {
        return NextResponse.json({ error: "Hours must be an array" }, { status: 400 });
      }

      await supabase.from("business_hours").delete().eq("business_id", businessId);

      if (hoursArray.length > 0) {
        const rows = hoursArray.map((h: { dayOfWeek: number; isClosed: boolean; openTime: string | null; closeTime: string | null }) => ({
          business_id: businessId,
          day_of_week: h.dayOfWeek,
          is_closed: h.isClosed,
          open_time: h.openTime ?? null,
          close_time: h.closeTime ?? null,
        }));

        const { error } = await supabase.from("business_hours").insert(rows);
        if (error) {
          console.error("Error updating hours:", error);
          return NextResponse.json({ error: "Failed to update hours" }, { status: 500 });
        }
      }

      return NextResponse.json({ success: true });
    }

    if (section === "notifications") {
      const { error } = await supabase
        .from("businesses")
        .update({ notification_preferences: data.preferences })
        .eq("id", businessId);

      if (error) {
        console.error("Error updating notifications:", error);
        return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  } catch (error) {
    console.error("Error in settings PUT:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
