import { object } from '@/types/schemas';
import { z } from 'zod';
import { BurningInputSchema } from './burning-input';
import { LandUseChangeActivityInputSchema } from './land-use-change-activity-input';
import { PerennialCropInputSchema } from './perennial-crops-input';

export const LULUCFInputSchema = object({
  activities: z.array(LandUseChangeActivityInputSchema).optional(),
  burning: z.array(BurningInputSchema).optional(),
  perennialCrops: z.array(PerennialCropInputSchema).optional(),
});

export type LULUCFInput = z.input<typeof LULUCFInputSchema>;
export type LULUCFInputTransformed = z.output<typeof LULUCFInputSchema>;

export const LULUCFParentInputSchema = object({
  /* REVISIT: We need to review the scope for location based fields like isInLeachingZone and rainfallAbove600.
  When a cropping enterprise defines multiple crops, it seems necessary to accept leaching status per crop. Chapter 1 states a leaching zone is where "the land is irrigated (except drip irrigation)."
  For livestock, should it also be per herd? And what about here for LULUCF, should it be per activity record, or per activity area, or inherited from the rest of the calculator inputs?
  */
  isInLeachingZone: z.boolean().meta({
    description: 'Whether the activity is in a leaching zone.',
  }),
  rainfallAbove600: z.boolean().meta({
    description: 'Whether the activity is in a rainfall above 600mm zone.',
  }),
  landUse: LULUCFInputSchema.optional(),
});

export type LULUCFParentInput = z.input<typeof LULUCFParentInputSchema>;
export type LULUCFParentInputTransformed = z.output<
  typeof LULUCFParentInputSchema
>;
