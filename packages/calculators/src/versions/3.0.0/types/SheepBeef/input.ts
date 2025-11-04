import { z } from 'zod';
import { BeefCompleteSchema } from '../Beef/beef.input';
import { SavannahBurningSchema } from '../Beef/savannah.input';
import { DESCRIPTIONS } from '../descriptions.schema';
import { calculatorInput } from '../schemas';
import { SheepCompleteSchema } from '../Sheep/sheep.input';
import { States } from '../types';
import { SheepBeefVegetationSchema } from './vegetation.input';

export const SheepBeefInputSchema = calculatorInput('SheepBeef', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  northOfTropicOfCapricorn: z
    .boolean()
    .meta({ description: DESCRIPTIONS.NORTHOFTROPIC }),
  rainfallAbove600: z
    .boolean()
    .meta({ description: DESCRIPTIONS.RAINFALLABOVE600 }),
  beef: z.array(BeefCompleteSchema),
  sheep: z.array(SheepCompleteSchema),
  burning: z.array(SavannahBurningSchema),
  vegetation: z.array(SheepBeefVegetationSchema).default([]),
});

export type SheepBeefInput = z.infer<typeof SheepBeefInputSchema>;
