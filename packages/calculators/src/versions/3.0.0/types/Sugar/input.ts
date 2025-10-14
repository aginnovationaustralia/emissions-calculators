import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { States } from '../types';
import { SugarCropSchema } from './sugar.input';
import { SugarVegetationSchema } from './vegetation.input';

export const SugarInputSchema = z
  .object({
    state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
    crops: z.array(SugarCropSchema),
    electricityRenewable: z
      .number()
      .min(0)
      .max(1)
      .meta({ description: DESCRIPTIONS.ELECTRICITY_RENEWABLE }),
    electricityUse: z
      .number()
      .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
    vegetation: z.array(SugarVegetationSchema),
  })
  .meta({ description: 'Input data required for the `sugar` calculator' });

export type SugarInput = z.infer<typeof SugarInputSchema>;
