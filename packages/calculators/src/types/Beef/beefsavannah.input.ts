import { z } from 'zod';
import { proportion } from '../schemas';
import { SavannahBurningSchema } from './savannah.input';

export const BeefSavannahBurningSchema = z
  .object({
    burning: SavannahBurningSchema,
    allocationToBeef: z.array(proportion()).meta({
      description:
        'The proportion of the burning that is allocated to each beef activity',
    }),
  })
  .meta({ description: 'Savannah burning along with allocations to beef' });

export type BeefSavannahBurning = z.infer<typeof BeefSavannahBurningSchema>;
