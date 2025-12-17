import { FreightTypes } from '@/types/enums';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { object } from '../schemas';

export const FreightInputSchema = object({
  type: z.enum(FreightTypes).meta({ description: DESCRIPTIONS.FREIGHT_TYPE }),
  totalKmTonnes: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.TOTAL_KM_TONNES }),
});

export type FreightInput = z.infer<typeof FreightInputSchema>;
