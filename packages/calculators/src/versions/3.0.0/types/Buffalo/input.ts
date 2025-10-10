import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { States } from '../types';
import { BuffaloCompleteSchema } from './buffalo.input';
import { BuffaloVegetationSchema } from './vegetation.input';

export const BuffaloInputSchema = z
  .object({
    state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
    rainfallAbove600: z
      .boolean()
      .meta({ description: DESCRIPTIONS.RAINFALLABOVE600 }),
    buffalos: z.array(BuffaloCompleteSchema),
    vegetation: z.array(BuffaloVegetationSchema).default([]),
  })
  .meta({ description: 'Input data required for the `Buffalo` calculator' });

export type BuffaloInput = z.infer<typeof BuffaloInputSchema>;
