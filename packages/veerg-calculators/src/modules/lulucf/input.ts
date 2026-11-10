import { object } from '@/types/schemas';
import { z } from 'zod';
import { BurningInputSchema } from './burning-input';
import { LandUseChangeActivityInputSchema } from './land-use-change-activity-input';
import { PerennialCropsInputSchema } from './perennial-crops-input';

export const LULUCFInputSchema = object({
  activities: z.array(LandUseChangeActivityInputSchema).optional(),
  burning: z.array(BurningInputSchema).optional(),
  perennialCrops: PerennialCropsInputSchema.optional(),
}).meta({
  id: 'LandUseInput',
});

export type LULUCFInput = z.input<typeof LULUCFInputSchema>;
export type LULUCFInputTransformed = z.output<typeof LULUCFInputSchema>;

export const LULUCFParentInputSchema = object({
  landUse: LULUCFInputSchema.optional(),
});

export type LULUCFParentInput = z.input<typeof LULUCFParentInputSchema>;
export type LULUCFParentInputTransformed = z.output<
  typeof LULUCFParentInputSchema
>;
