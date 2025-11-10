import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';

export const SolidWasteInputSchema = z.object({
  sentOffsiteTonnes: z
    .number()
    .meta({ description: DESCRIPTIONS.SOLID_WASTE_SENT_OFFSITE }),
  onsiteCompostingTonnes: z
    .number()
    .meta({ description: DESCRIPTIONS.SOLID_WASTE_COMPOSTED_ONSITE }),
});

export type SolidWasteInput = z.infer<typeof SolidWasteInputSchema>;
