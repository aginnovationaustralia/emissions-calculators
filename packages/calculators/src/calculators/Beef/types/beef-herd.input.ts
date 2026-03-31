import { input } from '@/tools/inputs';
import { realNumber } from '@/tools/units';
import { object, proportion } from '@/types/schemas';
import { z } from 'zod';
import { BeefClassesInputSchema } from './beef-classes.input';

export const BeefHerdInputSchema = object({
  classes: BeefClassesInputSchema,
  method2NoUnfencedNaturalWater: z
    .boolean()
    .meta({
      description:
        'Whether animals have access to unfenced natural water. If animals are on bore or reticulated water systems where water is provided in troughs (i.e. no unfenced natural water sources) then set to false',
    })
    .optional(),
  method2Dmd: object({
    spring: proportion()
      .meta({ description: 'Dry matter digestibility in spring' })
      .transform((val) => input('DMDijk=spring', realNumber(val))),
    summer: proportion()
      .meta({ description: 'Dry matter digestibility in summer' })
      .transform((val) => input('DMDijk=summer', realNumber(val))),
    autumn: proportion()
      .meta({ description: 'Dry matter digestibility in autumn' })
      .transform((val) => input('DMDijk=autumn', realNumber(val))),
    winter: proportion()
      .meta({ description: 'Dry matter digestibility in winter' })
      .transform((val) => input('DMDijk=winter', realNumber(val))),
  }).optional(),
});

export type BeefHerdInput = z.input<typeof BeefHerdInputSchema>;
export type BeefHerdInputTransformed = z.output<typeof BeefHerdInputSchema>;
