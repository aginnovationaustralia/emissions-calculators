import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { DairyProductionSystems, States } from '../types';
import { DairyCompleteSchema } from './dairy.input';
import { DairyVegetationSchema } from './vegetation.input';

export const DairyInputSchema = z
  .object({
    state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
    rainfallAbove600: z
      .boolean()
      .meta({ description: DESCRIPTIONS.RAINFALLABOVE600 }),
    productionSystem: z
      .enum(DairyProductionSystems)
      .meta({ description: 'Production system' }),
    dairy: z.array(DairyCompleteSchema),
    vegetation: z.array(DairyVegetationSchema),
  })
  .meta({ description: 'Input data required for the `dairy` calculator' });

export type DairyInput = z.infer<typeof DairyInputSchema>;
