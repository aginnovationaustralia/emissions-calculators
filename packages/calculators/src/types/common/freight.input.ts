import { FreightTypes } from '@/types/enums';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';

export const FreightInputSchema = z.object({
  type: z.enum(FreightTypes).meta({ description: DESCRIPTIONS.FREIGHT_TYPE }),
  totalKmTonnes: z.number().meta({ description: DESCRIPTIONS.TOTAL_KM_TONNES }),
});

export type FreightInput = z.infer<typeof FreightInputSchema>;
