import { input } from '@/tools/inputs';
import { mass, massPerMass, realNumber } from '@/tools/units';
import { DESCRIPTIONS } from '@/types/descriptions.schema';
import { object, proportion } from '@/types/schemas';
import { z } from 'zod';

export const LimeInputSchema = object({
  limestone: z
    .number()
    .min(0)
    .transform((val) => input('limestone', mass('Lime', val)))
    .meta({ description: 'Lime applied in kg' }),
  limestoneFraction: proportion(DESCRIPTIONS.LIMESTONEFRACTION).transform(
    (val) => input('limestoneFraction', realNumber(val)),
  ),
  dolomiteFraction: proportion(
    'Fraction of lime as dolomite, between 0 and 1',
  ).transform((val) => input('dolomiteFraction', realNumber(val))),
  customScope3EmissionsFactor: z
    .number()
    .min(0)
    .optional()
    .transform((val) =>
      input('customScope3EmissionsFactor', massPerMass('CO2e', 'Lime', val)),
    ),
});

export type LimeInput = z.input<typeof LimeInputSchema>;
export type LimeInputTransformed = z.output<typeof LimeInputSchema>;
