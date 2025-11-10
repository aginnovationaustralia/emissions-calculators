import { States } from '@/types/enums';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { calculatorInput } from '../schemas';
import { SheepCompleteSchema } from './sheep.input';
import { SheepVegetationSchema } from './vegetation.input';

export const SheepInputSchema = calculatorInput('Sheep', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  northOfTropicOfCapricorn: z
    .boolean()
    .meta({ description: DESCRIPTIONS.NORTHOFTROPIC }),
  rainfallAbove600: z
    .boolean()
    .meta({ description: DESCRIPTIONS.RAINFALLABOVE600 }),
  sheep: z.array(SheepCompleteSchema),
  vegetation: z.array(SheepVegetationSchema),
});

export type SheepInput = z.infer<typeof SheepInputSchema>;
