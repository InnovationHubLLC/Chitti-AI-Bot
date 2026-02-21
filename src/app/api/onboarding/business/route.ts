import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { businessInfoSchema } from "@/lib/validations/business-info";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = businessInfoSchema.parse(body);

    const supabase = await createClient();

    const businessId = request.cookies.get("onboarding_business_id")?.value;

    const dbData = {
      business_name: validatedData.businessName,
      industry: validatedData.industry,
      custom_industry: validatedData.customIndustry || null,
      website_url: validatedData.websiteUrl || null,
      phone_number: validatedData.phoneNumber,
      business_state: validatedData.businessState,
      owner_name: validatedData.ownerName,
      onboarding_step: "review_content",
    };

    let result;

    if (businessId) {
      const { data, error } = await supabase
        .from("businesses")
        .update(dbData)
        .eq("id", businessId)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from("businesses")
        .insert(dbData)
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    const response = NextResponse.json({
      success: true,
      businessId: result.id,
      nextStep: "/onboarding/step-2",
    });

    response.cookies.set("onboarding_business_id", result.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Error saving business info:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save business information" },
      { status: 500 }
    );
  }
}
