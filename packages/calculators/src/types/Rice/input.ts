import { States } from '@/types/enums';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { calculatorInput, proportion } from '../schemas';
import { RiceCropSchema } from './rice.input';
import { RiceVegetationSchema } from './vegetation.input';

export const RiceInputSchema = calculatorInput('Rice', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  crops: z.array(RiceCropSchema),
  electricityRenewable: proportion(DESCRIPTIONS.ELECTRICITY_RENEWABLE),
  electricityUse: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
  vegetation: z.array(RiceVegetationSchema),
});

export type RiceInput = z.infer<typeof RiceInputSchema>;
