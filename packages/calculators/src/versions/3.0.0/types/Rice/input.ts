import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { States } from '../types';
import { RiceCropSchema } from './rice.input';
import { RiceVegetationSchema } from './vegetation.input';

export const RiceInputSchema = z
  .object({
    state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
    crops: z.array(RiceCropSchema),
    electricityRenewable: z
      .number()
      .min(0)
      .max(1)
      .meta({ description: DESCRIPTIONS.ELECTRICITY_RENEWABLE }),
    electricityUse: z
      .number()
      .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
    vegetation: z.array(RiceVegetationSchema),
  })
  .meta({ description: 'Input data required for the `rice` calculator' });

export type RiceInput = z.infer<typeof RiceInputSchema>;
