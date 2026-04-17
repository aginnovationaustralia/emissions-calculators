import { input } from '@/tools/inputs';
import { hectaresToSquareMetres } from '@/tools/unit-conversion';
import { area, years } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const PerennialCropPlantingBaseInputSchema = object({
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

export const PerennialCropPlantingFullInputSchema =
  PerennialCropPlantingBaseInputSchema.extend({});

export type PerennialCropPlantingFullInput = z.input<
  typeof PerennialCropPlantingFullInputSchema
>;
export type PerennialCropPlantingFullInputTransformed = z.output<
  typeof PerennialCropPlantingFullInputSchema
>;

export const PerennialCropPlantingPartialInputSchema =
  PerennialCropPlantingBaseInputSchema.extend({});

export type PerennialCropPlantingPartialInput = z.input<
  typeof PerennialCropPlantingPartialInputSchema
>;
export type PerennialCropPlantingPartialInputTransformed = z.output<
  typeof PerennialCropPlantingPartialInputSchema
>;

export type PerennialCropPlantingInputTransformed =
  | PerennialCropPlantingFullInputTransformed
  | PerennialCropPlantingPartialInputTransformed;
