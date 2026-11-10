import { ElectricityInputsSchema } from '@/modules/scope2/14-electricity/electricity.input';
import z from 'zod';
import { AquacultureFisheryInputSchema } from './aquaculture-fishery.input';
import { object } from '@/types/schemas';

export const AquacultureInputSchema = object({
  electricity: ElectricityInputsSchema,
  fisheries: z.array(AquacultureFisheryInputSchema),
});

export type AquacultureInput = z.input<typeof AquacultureInputSchema>;
export type AquacultureInputTransformed = z.output<
  typeof AquacultureInputSchema
>;
