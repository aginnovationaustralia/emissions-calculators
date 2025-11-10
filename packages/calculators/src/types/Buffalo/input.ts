import { States } from '@/types/enums';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { calculatorInput } from '../schemas';
import { BuffaloCompleteSchema } from './buffalo.input';
import { BuffaloVegetationSchema } from './vegetation.input';

export const BuffaloInputSchema = calculatorInput('Buffalo', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  rainfallAbove600: z
    .boolean()
    .meta({ description: DESCRIPTIONS.RAINFALLABOVE600 }),
  buffalos: z.array(BuffaloCompleteSchema),
  vegetation: z.array(BuffaloVegetationSchema).default([]),
});

export type BuffaloInput = z.infer<typeof BuffaloInputSchema>;
