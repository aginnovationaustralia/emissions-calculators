import { ElectricityInputsSchema } from '@/modules/scope2/14-electricity/electricity.input';
import { object } from '@/types/schemas';
import { z } from 'zod';
import { ForestryPlantationInputSchema } from './plantation.input';

// NOTE: The forestry calculator doesn't accept a top level landUse key, you just supply it on each plantation
export const ForestryInputSchema = object({
  plantations: z.array(ForestryPlantationInputSchema),
  electricity: ElectricityInputsSchema,
});

export type ForestryInput = z.input<typeof ForestryInputSchema>;
export type ForestryInputTransformed = z.output<typeof ForestryInputSchema>;
