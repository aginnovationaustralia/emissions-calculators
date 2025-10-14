import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { States } from '../types';
import { SheepCompleteSchema } from './sheep.input';
import { SheepVegetationSchema } from './vegetation.input';

export const SheepInputSchema = z
  .object({
    state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
    northOfTropicOfCapricorn: z
      .boolean()
      .meta({ description: DESCRIPTIONS.NORTHOFTROPIC }),
    rainfallAbove600: z
      .boolean()
      .meta({ description: DESCRIPTIONS.RAINFALLABOVE600 }),
    sheep: z.array(SheepCompleteSchema),
    vegetation: z.array(SheepVegetationSchema),
  })
  .meta({ description: 'Input data required for the `sheep` calculator' });

export type SheepInput = z.infer<typeof SheepInputSchema>;
