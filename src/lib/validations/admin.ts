import { z } from 'zod';

export const setupAssistantSchema = z.object({
  businessId: z.string().uuid('businessId must be a valid UUID'),
  phoneNumberId: z.string().min(1, 'phoneNumberId is required'),
});

export type SetupAssistantInput = z.infer<typeof setupAssistantSchema>;
