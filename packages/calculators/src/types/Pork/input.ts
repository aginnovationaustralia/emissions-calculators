import { States } from '@/types/types';
import { z } from 'zod';
import { AllocatedVegetationSchema } from '../allocated-vegetation.input';
import { DESCRIPTIONS } from '../descriptions.schema';
import { deprecated, singleEnterpriseInput } from '../schemas';
import { PorkCompleteSchema } from './pork.input';

export const PorkInputSchema = singleEnterpriseInput('Pork', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  northOfTropicOfCapricorn: z
    .boolean()
    .meta(deprecated(DESCRIPTIONS.NORTHOFTROPIC, 'This field is deprecated')),
  rainfallAbove600: z
    .boolean()
    .meta({ description: DESCRIPTIONS.RAINFALLABOVE600 }),
  pork: z.array(PorkCompleteSchema),
  vegetation: z.array(AllocatedVegetationSchema),
});

export type PorkInput = z.infer<typeof PorkInputSchema>;
