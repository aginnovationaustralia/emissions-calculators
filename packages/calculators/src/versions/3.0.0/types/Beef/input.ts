import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { States } from '../types';
import { BeefCompleteSchema } from './beef.input';
import { BeefSavannahBurningSchema } from './beefsavannah.input';
import { BeefVegetationSchema } from './vegetation.input';

export const BeefInputSchema = z
  .object({
    state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
    northOfTropicOfCapricorn: z
      .boolean()
      .meta({ description: DESCRIPTIONS.NORTHOFTROPIC }),
    rainfallAbove600: z
      .boolean()
      .meta({ description: DESCRIPTIONS.RAINFALLABOVE600 }),
    beef: z.array(BeefCompleteSchema),
    burning: z.array(BeefSavannahBurningSchema),
    vegetation: z.array(BeefVegetationSchema).default([]),
  })
  .meta({ description: 'Input data required for the `beef` calculator' });

export type BeefInput = z.infer<typeof BeefInputSchema>;
