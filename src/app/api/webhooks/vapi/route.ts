import { NextResponse } from 'next/server';

import { vapiWebhookBodySchema } from '@/lib/validations/vapi';
import { dispatchFunctionCall } from '@/lib/vapi/function-handlers';
import { inngest } from '@/lib/inngest/client';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const raw = await request.json();
    const { message } = vapiWebhookBodySchema.parse(raw);

    const metadata = message.call.metadata as Record<string, string>;
    const businessId = metadata.businessId ?? '';

    switch (message.type) {
      case 'function-call': {
        const result = await dispatchFunctionCall(businessId, message.functionCall);
        return NextResponse.json({ result: JSON.stringify(result) });
      }

      case 'end-of-call-report': {
        await inngest.send({
          name: 'call/ended',
          data: {
            businessId,
            callId: message.call.id,
            callerPhone: message.call.customer.number,
            duration: message.call.duration,
            transcript: message.transcript,
            summary: message.summary,
            vapiCallCost: message.call.cost,
          },
        });
        return NextResponse.json({ ok: true });
      }

      case 'status-update': {
        console.info('Vapi status update', {
          callId: message.call.id,
          status: message.status,
        });
        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json({ ok: true });
    }
  } catch (error) {
    console.error('Vapi webhook error', error);
    // Always return 200 to prevent Vapi retries
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 200 });
  }
}
