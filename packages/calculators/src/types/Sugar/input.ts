import { States } from '@/types/types';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { calculatorInput, proportion } from '../schemas';
import { SugarCropSchema } from './sugar.input';
import { SugarVegetationSchema } from './vegetation.input';

export const SugarInputSchema = calculatorInput('Sugar', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  crops: z.array(SugarCropSchema),
  electricityRenewable: proportion(DESCRIPTIONS.ELECTRICITY_RENEWABLE),
  electricityUse: z
    .number()
    .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
  vegetation: z.array(SugarVegetationSchema),
});

export type SugarInput = z.infer<typeof SugarInputSchema>;
