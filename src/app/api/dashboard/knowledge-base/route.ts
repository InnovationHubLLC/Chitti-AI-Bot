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

    const [pricingResult, faqsResult] = await Promise.all([
      supabase
        .from("pricing_services")
        .select("*")
        .eq("business_id", businessId)
        .order("created_at"),
      supabase
        .from("faqs")
        .select("*")
        .eq("business_id", businessId)
        .order("created_at"),
    ]);

    if (pricingResult.error || faqsResult.error) {
      console.error("Error fetching KB:", pricingResult.error ?? faqsResult.error);
      return NextResponse.json(
        { error: "Failed to fetch knowledge base data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        pricing: pricingResult.data,
        faqs: faqsResult.data,
      },
    });
  } catch (error) {
    console.error("Error in KB API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { businessId, type, ...itemData } = body;

    if (!businessId || !type) {
      return NextResponse.json(
        { error: "Business ID and type are required" },
        { status: 400 }
      );
    }

    if (type === "pricing") {
      const { data, error } = await supabase
        .from("pricing_services")
        .insert({
          business_id: businessId,
          service_name: itemData.service,
          price_low: itemData.price,
          price_high: itemData.price,
          duration: itemData.duration ?? null,
          category: itemData.category ?? "services",
          is_active: itemData.is_active ?? true,
          conditions: itemData.conditions ?? null,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating pricing item:", error);
        return NextResponse.json({ error: "Failed to create pricing item" }, { status: 500 });
      }
      return NextResponse.json({ success: true, data });
    }

    if (type === "faq") {
      const { data, error } = await supabase
        .from("faqs")
        .insert({
          business_id: businessId,
          question: itemData.question,
          answer: itemData.answer,
          source: itemData.source ?? "manual",
          category: itemData.category ?? "general",
          is_active: itemData.is_active ?? true,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating FAQ:", error);
        return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
      }
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Error in KB POST:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { id, businessId, type, ...updates } = body;

    if (!id || !businessId || !type) {
      return NextResponse.json(
        { error: "ID, Business ID, and type are required" },
        { status: 400 }
      );
    }

    if (type === "pricing") {
      const updateData: Record<string, unknown> = {};
      if (updates.service !== undefined) updateData.service_name = updates.service;
      if (updates.price !== undefined) {
        updateData.price_low = updates.price;
        updateData.price_high = updates.price;
      }
      if (updates.duration !== undefined) updateData.duration = updates.duration;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.is_active !== undefined) updateData.is_active = updates.is_active;
      if (updates.conditions !== undefined) updateData.conditions = updates.conditions;

      const { data, error } = await supabase
        .from("pricing_services")
        .update(updateData)
        .eq("id", id)
        .eq("business_id", businessId)
        .select()
        .single();

      if (error) {
        console.error("Error updating pricing:", error);
        return NextResponse.json({ error: "Failed to update pricing item" }, { status: 500 });
      }
      return NextResponse.json({ success: true, data });
    }

    if (type === "faq") {
      const updateData: Record<string, unknown> = {};
      if (updates.question !== undefined) updateData.question = updates.question;
      if (updates.answer !== undefined) updateData.answer = updates.answer;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.is_active !== undefined) updateData.is_active = updates.is_active;
      if (updates.source !== undefined) updateData.source = updates.source;

      const { data, error } = await supabase
        .from("faqs")
        .update(updateData)
        .eq("id", id)
        .eq("business_id", businessId)
        .select()
        .single();

      if (error) {
        console.error("Error updating FAQ:", error);
        return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 });
      }
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Error in KB PUT:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const businessId = searchParams.get("businessId");
    const type = searchParams.get("type");

    if (!id || !businessId || !type) {
      return NextResponse.json(
        { error: "ID, Business ID, and type are required" },
        { status: 400 }
      );
    }

    const table = type === "pricing" ? "pricing_services" : "faqs";
    const { error } = await supabase
      .from(table)
      .delete()
      .eq("id", id)
      .eq("business_id", businessId);

    if (error) {
      console.error("Error deleting KB item:", error);
      return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in KB DELETE:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
