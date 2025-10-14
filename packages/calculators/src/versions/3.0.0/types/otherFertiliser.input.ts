import { z } from 'zod';
import { CustomisedFertilisers } from './types';

export const OtherFertiliserSchema = z
  .object({
    otherType: z
      .enum(CustomisedFertilisers)
      .meta({ description: 'Other N fertiliser type' }),
    otherDryland: z.number().meta({
      description:
        'Other N fertiliser used for dryland. From v1.1.0, supply tonnes of product. For earlier versions, supply tonnes of N',
    }),
    otherIrrigated: z.number().meta({
      description:
        'Other N fertiliser used for irrigated. From v1.1.0, supply tonnes of product. For earlier versions, supply tonnes of N',
    }),
  })
  .meta({
    description:
      'Other fertiliser, of a specific type, used for different applications (such as dryland pasture)',
  });

export type OtherFertiliser = z.infer<typeof OtherFertiliserSchema>;
