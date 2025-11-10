import { Refrigerants } from '@/types/enums';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';

export const WildSeaFisheriesRefrigerantSchema = z.object({
  refrigerant: z
    .enum(Refrigerants)
    .meta({ description: DESCRIPTIONS.REFRIGERANT }),
  annualRecharge: z.number().meta({
    description: 'Amount of refrigerant annually recharged, kg product/year',
  }),
});

export type WildSeaFisheriesRefrigerant = z.infer<
  typeof WildSeaFisheriesRefrigerantSchema
>;
