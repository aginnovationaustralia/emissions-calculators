import { object } from '@/types/schemas';
import { z } from 'zod';
import { BurningInputSchema } from './burning-input';
import { LandUseChangeActivityInputSchema } from './land-user-change-activity-input';

export const LULUCFInputSchema = object({
  /* REVISIT: When we create full calculator inputs, we will probably want to move this input.
  If we assume all LULUCF activity areas are within the activity boundary, this input should be added to all top level calculators.
  We could also make it optional on a LULUCF activity to let the user enter areas outside the property.
  */
  isInLeachingZone: z.boolean().meta({
    description: 'Whether the activity is in a leaching zone.',
  }),
  activities: z.array(LandUseChangeActivityInputSchema),
  burning: z.array(BurningInputSchema).optional(),
});

export type LULUCFInput = z.input<typeof LULUCFInputSchema>;
export type LULUCFInputTransformed = z.output<typeof LULUCFInputSchema>;
