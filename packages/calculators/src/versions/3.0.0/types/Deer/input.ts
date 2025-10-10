import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { States } from '../types';
import { DeerCompleteSchema } from './deer.input';
import { DeerVegetationSchema } from './vegetation.input';

export const DeerInputSchema = z
  .object({
    state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
    rainfallAbove600: z
      .boolean()
      .meta({ description: DESCRIPTIONS.RAINFALLABOVE600 }),
    deers: z.array(DeerCompleteSchema),
    vegetation: z.array(DeerVegetationSchema).default([]),
  })
  .meta({ description: 'Input data required for the `deer` calculator' });

export type DeerInput = z.infer<typeof DeerInputSchema>;
