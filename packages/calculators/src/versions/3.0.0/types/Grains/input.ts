import { z } from 'zod';
import { CropVegetationSchema } from '../common/crop-vegetation.input';
import { DESCRIPTIONS } from '../descriptions.schema';
import { States } from '../types';
import { GrainsCropSchema } from './crop.input';

export const GrainsInputSchema = z
  .object({
    state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
    crops: z.array(GrainsCropSchema),
    electricityRenewable: z
      .number()
      .min(0)
      .max(1)
      .meta({ description: DESCRIPTIONS.ELECTRICITY_RENEWABLE }),
    electricityUse: z
      .number()
      .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
    vegetation: z.array(CropVegetationSchema),
  })
  .meta({ description: 'Input data required for the `grains` calculator' });

export type GrainsInput = z.infer<typeof GrainsInputSchema>;
