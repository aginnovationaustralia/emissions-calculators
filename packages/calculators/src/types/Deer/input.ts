import { States } from '@/types/types';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { singleEnterpriseInput } from '../schemas';
import { DeerCompleteSchema } from './deer.input';
import { DeerVegetationSchema } from './vegetation.input';

export const DeerInputSchema = singleEnterpriseInput('Deer', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  rainfallAbove600: z
    .boolean()
    .meta({ description: DESCRIPTIONS.RAINFALLABOVE600 }),
  deers: z.array(DeerCompleteSchema),
  vegetation: z.array(DeerVegetationSchema).default([]),
});

export type DeerInput = z.infer<typeof DeerInputSchema>;
