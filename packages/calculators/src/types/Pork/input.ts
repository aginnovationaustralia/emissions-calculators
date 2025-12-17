import { States } from '@/types/enums';
import { z } from 'zod';
import { AllocatedVegetationSchema } from '../allocated-vegetation.input';
import { DESCRIPTIONS } from '../descriptions.schema';
import { singleEnterpriseInput } from '../schemas';
import { PorkCompleteSchema } from './pork.input';

export const PorkInputSchema = singleEnterpriseInput('Pork', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  rainfallAbove600: z
    .boolean()
    .meta({ description: DESCRIPTIONS.RAINFALLABOVE600 }),
  pork: z.array(PorkCompleteSchema),
  vegetation: z.array(AllocatedVegetationSchema),
});

export type PorkInput = z.infer<typeof PorkInputSchema>;
