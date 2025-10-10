import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { FreightTypes } from '../types';

export const FreightInputSchema = z.object({
  type: z
    .nativeEnum(FreightTypes)
    .meta({ description: DESCRIPTIONS.FREIGHT_TYPE }),
  totalKmTonnes: z.number().meta({ description: DESCRIPTIONS.TOTAL_KM_TONNES }),
});

export type FreightInput = z.infer<typeof FreightInputSchema>;
