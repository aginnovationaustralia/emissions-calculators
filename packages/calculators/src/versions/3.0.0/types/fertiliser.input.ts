import { z } from 'zod';
import { OtherFertiliserSchema } from './otherFertiliser.input';
import { CustomisedFertilisersWithLegacyKeys } from './types';

export const FertiliserSchema = z
  .object({
    singleSuperphosphate: z
      .number()
      .meta({ description: 'Single superphosphate usage in tonnes' }),
    otherType: z.enum(CustomisedFertilisersWithLegacyKeys).optional().meta({
      description:
        'Other N fertiliser type. Deprecated note: Use `otherFertilisers` instead',
    }),
    pastureDryland: z.number().meta({
      description: 'Urea fertiliser used for dryland pasture, in tonnes Urea',
    }),
    pastureIrrigated: z.number().meta({
      description: 'Urea fertiliser used for irrigated pasture, in tonnes Urea',
    }),
    cropsDryland: z.number().meta({
      description: 'Urea fertiliser used for dryland crops, in tonnes Urea',
    }),
    cropsIrrigated: z.number().meta({
      description: 'Urea fertiliser used for irrigated crops, in tonnes Urea',
    }),
    otherDryland: z.number().optional().meta({
      description:
        'Other N fertiliser used for dryland, in tonnes N. Deprecated note: Use `otherFertilisers` instead',
    }),
    otherIrrigated: z.number().optional().meta({
      description:
        'Other N fertiliser used for irrigated, in tonnes N. Deprecated note: Use `otherFertilisers` instead',
    }),
    otherFertilisers: z.array(OtherFertiliserSchema).optional().meta({
      description:
        'Array of Other N fertiliser. Version note: If this field is set and has a length > 0, the `other` fields within this object are ignored, and this array is used instead',
    }),
  })
  .meta({
    description:
      'Fertiliser used for different applications (such as dryland pasture)',
  });

export type Fertiliser = z.infer<typeof FertiliserSchema>;
