import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { setupAssistantSchema } from '@/lib/validations/admin';
import { VapiClient, VapiApiError } from '@/lib/vapi/client';
import { buildAssistantPayload } from '@/lib/vapi/create-assistant';
import { ZodError } from 'zod';

interface BusinessRow {
  id: string;
  business_name: string;
  industry: string;
  owner_name: string;
  phone_number: string;
  vapi_assistant_id: string | null;
  vapi_phone_number_id: string | null;
  vapi_phone_number: string | null;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const { businessId, phoneNumberId } = setupAssistantSchema.parse(body);

    const supabase = await createClient();

    // 1. Fetch business
    const { data: business, error: fetchError } = await supabase
      .from('businesses')
      .select('id, business_name, industry, owner_name, phone_number, vapi_assistant_id, vapi_phone_number_id, vapi_phone_number')
      .eq('id', businessId)
      .single<BusinessRow>();

    if (fetchError || !business) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 },
      );
    }

    // Check if already provisioned
    if (business.vapi_assistant_id && business.vapi_phone_number_id) {
      return NextResponse.json({
        success: true,
        alreadyProvisioned: true,
        assistantId: business.vapi_assistant_id,
        phoneNumberId: business.vapi_phone_number_id,
        phoneNumber: business.vapi_phone_number,
      });
    }

    const vapi = new VapiClient();

    // 2. Build and create assistant
    const assistantPayload = buildAssistantPayload({
      businessId: business.id,
      businessName: business.business_name,
      industry: business.industry,
      greeting: `Hi, thanks for calling ${business.business_name}! How can I help you today?`,
      ownerName: business.owner_name,
      consentScript: 'This call may be recorded for quality purposes.',
      escalationRules: {
        triggerPhrases: ['speak to manager', 'talk to owner', 'speak to someone'],
        ownerPhone: business.phone_number,
        maxAttempts: 3,
      },
    });

    const assistant = await vapi.createAssistant(assistantPayload);

    // 3. Link existing phone number to assistant — clean up assistant on failure
    let linkedPhone;
    try {
      linkedPhone = await vapi.updatePhoneNumber(phoneNumberId, {
        assistantId: assistant.id,
      });
    } catch (linkError) {
      // Roll back: delete the assistant we just created
      try {
        await vapi.deleteAssistant(assistant.id);
      } catch {
        // Best-effort cleanup
      }

      const message = linkError instanceof VapiApiError
        ? `Failed to link phone number: ${linkError.status}`
        : 'Failed to link phone number';

      return NextResponse.json(
        { success: false, error: message },
        { status: 502 },
      );
    }

    // 4. Save to Supabase
    const { error: updateError } = await supabase
      .from('businesses')
      .update({
        vapi_assistant_id: assistant.id,
        vapi_phone_number_id: linkedPhone.id,
        vapi_phone_number: linkedPhone.number,
      })
      .eq('id', businessId);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: 'Failed to save setup results' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      assistantId: assistant.id,
      phoneNumberId: linkedPhone.id,
      phoneNumber: linkedPhone.number,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof VapiApiError) {
      return NextResponse.json(
        { success: false, error: `Vapi API error: ${error.status}` },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const businessId = request.nextUrl.searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json(
        { success: false, error: 'businessId query parameter is required' },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { data: business, error } = await supabase
      .from('businesses')
      .select('id, vapi_assistant_id, vapi_phone_number_id, vapi_phone_number')
      .eq('id', businessId)
      .single<Pick<BusinessRow, 'id' | 'vapi_assistant_id' | 'vapi_phone_number_id' | 'vapi_phone_number'>>();

    if (error || !business) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 },
      );
    }

    const isProvisioned = Boolean(business.vapi_assistant_id && business.vapi_phone_number_id);

    return NextResponse.json({
      success: true,
      provisioned: isProvisioned,
      assistantId: business.vapi_assistant_id,
      phoneNumberId: business.vapi_phone_number_id,
      phoneNumber: business.vapi_phone_number,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
