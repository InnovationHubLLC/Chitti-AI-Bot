import { inngest } from '../client';
import { createServiceClient } from '@/lib/supabase/service';
import { scrubPHIRegex } from '@/lib/services/analysis/phi-scrubber';
import { trackCallCosts } from '@/lib/services/cost-tracker';

const PHI_SENSITIVE_INDUSTRIES = ['dental_practice', 'medical', 'healthcare'];

interface CallRecord { id: string }
interface AnalysisRecord { id: string }
interface BusinessRecord { industry: string }

export const analyzeCall = inngest.createFunction(
  { id: 'analyze-call', name: 'Analyze Call' },
  { event: 'call/ended' },
  async ({ event, step }) => {
    const { businessId, callId, callerPhone, duration, transcript, summary, vapiCallCost } =
      event.data as {
        businessId: string;
        callId: string;
        callerPhone: string;
        duration: number;
        transcript: string;
        summary: string;
        vapiCallCost: number;
      };

    const supabase = createServiceClient();

    // Step 1: Save call record
    const callRecord = await step.run('save-call-record', async () => {
      const { data, error } = await supabase
        .from('calls' as never)
        .insert({
          id: callId,
          business_id: businessId,
          caller_phone: callerPhone,
          duration_seconds: duration,
          transcript,
          summary,
          status: 'completed',
        } as never)
        .select('id')
        .single();

      if (error) throw new Error(`Failed to save call: ${error.message}`);
      return data as unknown as CallRecord;
    });

    // Step 2: Scrub PHI (dental/medical only)
    const scrubbedTranscript = await step.run('scrub-phi', async () => {
      const { data: business } = await supabase
        .from('businesses' as never)
        .select('industry')
        .eq('id' as never, businessId as never)
        .single();

      const industry = (business as unknown as BusinessRecord | null)?.industry ?? '';

      if (PHI_SENSITIVE_INDUSTRIES.includes(industry)) {
        const { text } = scrubPHIRegex(transcript);
        return text;
      }

      return transcript;
    });

    // Step 3: Analyze with Claude (stub — real analysis wired later)
    const analysis = await step.run('analyze-with-claude', async () => {
      const { data, error } = await supabase
        .from('call_analysis' as never)
        .insert({
          call_id: callRecord.id,
          business_id: businessId,
          lead_score: 0,
          sentiment: 'neutral',
          summary: scrubbedTranscript.slice(0, 500),
          analysis_status: 'pending',
        } as never)
        .select('id')
        .single();

      if (error) throw new Error(`Failed to save analysis: ${error.message}`);
      return data as unknown as AnalysisRecord;
    });

    // Step 4: Track costs
    await step.run('track-costs', async () => {
      await trackCallCosts({
        callId,
        businessId,
        vapiCost: vapiCallCost,
        claudeTokens: { input: 0, output: 0 },
        durationSeconds: duration,
        smsCount: 0,
      });
    });

    // Step 5: Send notification (stub — real SMS/email wired with Twilio later)
    await step.run('send-notification', () => {
      console.info('Lead notification stub', {
        businessId,
        callId,
        callerPhone,
        duration,
      });
    });

    return { callId: callRecord.id, analysisId: analysis.id };
  },
);
