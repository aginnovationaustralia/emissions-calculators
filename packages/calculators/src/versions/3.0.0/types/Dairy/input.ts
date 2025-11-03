import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { singleEnterpriseInput } from '../schemas';
import { DairyProductionSystems, States } from '../types';
import { DairyCompleteSchema } from './dairy.input';
import { DairyVegetationSchema } from './vegetation.input';

export const DairyInputSchema = singleEnterpriseInput('Dairy', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  rainfallAbove600: z
    .boolean()
    .meta({ description: DESCRIPTIONS.RAINFALLABOVE600 }),
  productionSystem: z
    .enum(DairyProductionSystems)
    .meta({ description: 'Production system' }),
  dairy: z.array(DairyCompleteSchema),
  vegetation: z.array(DairyVegetationSchema),
});

export type DairyInput = z.infer<typeof DairyInputSchema>;
