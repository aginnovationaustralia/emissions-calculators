import { input } from '@/tools/inputs';
import { tonnesToKg } from '@/tools/unit-conversion';
import { mass, massPerMass, realNumber } from '@/tools/units';
import { DESCRIPTIONS } from '@/types/descriptions.schema';
import { object, proportion } from '@/types/schemas';
import { z } from 'zod';

export const LimeInputSchema = object({
  limestone: z
    .number()
    .min(0)
    .transform((val) => input('limestone', mass('Lime', tonnesToKg(val))))
    .meta({ description: DESCRIPTIONS.LIMESTONE }),
  limestoneFraction: proportion(DESCRIPTIONS.LIMESTONEFRACTION).transform(
    (val) => input('limestoneFraction', realNumber(val)),
  ),
  customEmissionsFactor: z
    .number()
    .min(0)
    .optional()
    .transform((val) =>
      val ? input('lpg', massPerMass('CO2e', 'Lime', val)) : undefined,
    ),
});

export type LimeInput = z.input<typeof LimeInputSchema>;
export type LimeInputTransformed = z.output<typeof LimeInputSchema>;
