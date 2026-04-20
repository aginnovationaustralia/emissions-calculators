import { input } from '@/tools/inputs';
import { hectaresToSquareMetres } from '@/tools/unit-conversion';
import { area, years } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const PerennialCropPlantingInputSchema = object({
  areaPlanted: z
    .number()
    .min(0)
    .meta({
      description: 'Area planted t years ago, in hectares',
    })
    .transform((val) => input('Ac,t', area(hectaresToSquareMetres(val)))),
  yearsSincePlanting: z
    .number()
    .min(0)
    .meta({
      description: 'Years since planting',
    })
    .transform((val) => input('t', years(val))),
});

export type PerennialCropPlantingInput = z.input<
  typeof PerennialCropPlantingInputSchema
>;
export type PerennialCropPlantingInputTransformed = z.output<
  typeof PerennialCropPlantingInputSchema
>;
