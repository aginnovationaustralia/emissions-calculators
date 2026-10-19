import { numberInput } from '@/tools/inputs';
import { PERENNIAL_16_6 } from '@/tools/modules';
import { hectaresToSquareMetres } from '@/tools/unit-conversion';
import { area, years } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const PerennialCropClearingMethod1InputSchema = object({
  areaCleared: numberInput(
    (val) => area(hectaresToSquareMetres(val)),
    {
      name: 'Ac,t',
      description: 'Area cleared',
      modules: [PERENNIAL_16_6],
    },
    (s) => s.min(0),
  ),
});

export type PerennialCropClearingMethod1Input = z.input<
  typeof PerennialCropClearingMethod1InputSchema
>;
export type PerennialCropClearingMethod1InputTransformed = z.output<
  typeof PerennialCropClearingMethod1InputSchema
>;

export const PerennialCropClearingMethod2InputSchema =
  PerennialCropClearingMethod1InputSchema.extend({
    method2AgeAtClearing: numberInput(
      (val) => years(val),
      {
        name: 't',
        method: '2',
        description:
          'Time since original planting when clearing occurs. This must be less than the maturity age for the crop type',
        modules: [PERENNIAL_16_6],
      },
      (s) => s.min(0),
    ),
  });

export type PerennialCropClearingMethod2Input = z.input<
  typeof PerennialCropClearingMethod2InputSchema
>;
export type PerennialCropClearingMethod2InputTransformed = z.output<
  typeof PerennialCropClearingMethod2InputSchema
>;

export type PerennialCropClearingInput =
  | PerennialCropClearingMethod1Input
  | PerennialCropClearingMethod2Input;

export type PerennialCropClearingInputTransformed =
  | PerennialCropClearingMethod1InputTransformed
  | PerennialCropClearingMethod2InputTransformed;

export const isPerennialCropClearingMethod2 = (
  clearing: PerennialCropClearingInputTransformed,
): clearing is PerennialCropClearingMethod2InputTransformed => {
  return 'method2AgeAtClearing' in clearing;
};
