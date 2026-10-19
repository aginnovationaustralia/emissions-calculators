import { ElectricityInputsSchema } from '@/modules/scope2/14-electricity/electricity.input';
import { object } from '@/types/schemas';
import { WildCatchFisheryInputSchema } from './wild-catch-fishery.input';
import z from 'zod';

export const WildCatchFisheriesInputSchema = object({
  electricity: ElectricityInputsSchema,
  fisheries: z.array(WildCatchFisheryInputSchema),
});

export type WildCatchFisheriesInput = z.input<
  typeof WildCatchFisheriesInputSchema
>;
export type WildCatchFisheriesInputTransformed = z.output<
  typeof WildCatchFisheriesInputSchema
>;
