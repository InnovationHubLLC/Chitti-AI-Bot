import { serve } from 'inngest/next';

import { inngest } from '@/lib/inngest/client';
import { analyzeCall } from '@/lib/inngest/functions/analyze-call';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [analyzeCall],
});
