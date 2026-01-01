import { z } from 'zod';
import { SavannahBurningSchema } from '../Beef/savannah.input';
import { deprecated, proportion } from '../schemas';

export const TemporarySavannahInputSchema = SavannahBurningSchema.extend({
  allocationToBeef: z.array(proportion()).meta({
    description:
      'The proportion of the burning that is allocated to each beef activity',
  }),
}).meta(
  deprecated(
    'Temporary savannah burning input format that is more compatible with older API versions.',
    'Please migrate to passing burning detail keys under the `burning` key.',
  ),
);
