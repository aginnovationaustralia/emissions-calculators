import { input } from '@/tools/inputs';
import { realNumber } from '@/tools/units';
import { object, proportion } from '@/types/schemas';
import { z } from 'zod';
import { SheepClassesInputSchema } from './sheep-classes.input';

export const SheepFlockInputSchema = object({
  classes: SheepClassesInputSchema,
  noUnfencedNaturalWater: z.boolean().meta({
    description:
      'Method 2: Whether animals have access to unfenced natural water. If animals are on bore or reticulated water systems where water is provided in troughs (i.e. no unfenced natural water sources) then set to false',
  }),
  method2Dmd: object({
    spring: proportion()
      .meta({
        description:
          'Method 2: Specific dry matter digestibility in spring, based on farm records',
      })
      .transform((val) => input('DMDijk=spring', realNumber(val))),
    summer: proportion()
      .meta({
        description:
          'Method 2: Specific dry matter digestibility in summer, based on farm records',
      })
      .transform((val) => input('DMDijk=summer', realNumber(val))),
    autumn: proportion()
      .meta({
        description:
          'Method 2: Specific dry matter digestibility in autumn, based on farm records',
      })
      .transform((val) => input('DMDijk=autumn', realNumber(val))),
    winter: proportion()
      .meta({
        description:
          'Method 2: Specific dry matter digestibility in winter, based on farm records',
      })
      .transform((val) => input('DMDijk=winter', realNumber(val))),
  }).optional(),
  method2CrudeProteinContent: object({
    spring: proportion()
      .meta({
        description:
          'Method 2: Specific crude protein content in spring, based on farm records',
      })
      .transform((val) => input('CPijk=spring', realNumber(val))),
    summer: proportion()
      .meta({
        description:
          'Method 2: Specific crude protein content in summer, based on farm records',
      })
      .transform((val) => input('CPijk=summer', realNumber(val))),
    autumn: proportion()
      .meta({
        description:
          'Method 2: Specific crude protein content in autumn, based on farm records',
      })
      .transform((val) => input('CPijk=autumn', realNumber(val))),
    winter: proportion()
      .meta({
        description:
          'Method 2: Specific dry matter digestibility in winter, based on farm records',
      })
      .transform((val) => input('CPijk=winter', realNumber(val))),
  }).optional(),
});

export type SheepFlockInput = z.input<typeof SheepFlockInputSchema>;
export type SheepFlockInputTransformed = z.output<typeof SheepFlockInputSchema>;
