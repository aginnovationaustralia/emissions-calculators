import { isProportion, numberInput } from '@/tools/inputs';
import { FERTILISER_MODULES } from '@/tools/modules';
import { realNumber } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

/**
 * Fraction of manure applied to soils within the activity boundary (*PF*). Only read
 * when livestock manure is the source of an organic fertiliser application (chapter 5),
 * for determining how much of the manure produced was actually applied to the soil.
 */
export const HasFractionAppliedToSoilsInputSchema = object({
  fractionAppliedToSoils: numberInput(
    (val) => realNumber(val),
    {
      name: 'PF',
      description:
        'The fraction of manure from this source applied to soil within the activity boundary.',
      modules: FERTILISER_MODULES,
    },
    isProportion,
  ),
});

export type HasFractionAppliedToSoilsInput = z.input<
  typeof HasFractionAppliedToSoilsInputSchema
>;
export type HasFractionAppliedToSoilsInputTransformed = z.output<
  typeof HasFractionAppliedToSoilsInputSchema
>;
