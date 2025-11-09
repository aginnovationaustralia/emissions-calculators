import { States } from '@/types/types';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { singleEnterpriseInput } from '../schemas';
import { GoatCompleteSchema } from './goat.input';
import { GoatVegetationSchema } from './vegetation.input';

export const GoatInputSchema = singleEnterpriseInput('Goat', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  rainfallAbove600: z
    .boolean()
    .meta({ description: DESCRIPTIONS.RAINFALLABOVE600 }),
  goats: z.array(GoatCompleteSchema),
  vegetation: z.array(GoatVegetationSchema).default([]),
});

export type GoatInput = z.infer<typeof GoatInputSchema>;
