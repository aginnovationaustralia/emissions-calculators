import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { States } from '../types';
import { CottonCropSchema } from './cotton.input';
import { CottonVegetationSchema } from './vegetation.input';

export const CottonInputSchema = z
  .object({
    state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
    crops: z.array(CottonCropSchema),
    electricityRenewable: z
      .number()
      .min(0)
      .max(1)
      .meta({ description: DESCRIPTIONS.ELECTRICITY_RENEWABLE }),
    electricityUse: z
      .number()
      .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
    vegetation: z.array(CottonVegetationSchema),
  })
  .meta({ description: 'Input data required for the `cotton` calculator' });

export type CottonInput = z.infer<typeof CottonInputSchema>;
