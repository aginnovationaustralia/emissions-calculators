import { z } from 'zod';
import { OtherFertiliserSchema } from './otherFertiliser.input';

export const FertiliserSchema = z
  .object({
    singleSuperphosphate: z
      .number()
      .min(0)
      .meta({ description: 'Single superphosphate usage in tonnes' }),
    pastureDryland: z.number().min(0).meta({
      description: 'Urea fertiliser used for dryland pasture, in tonnes Urea',
    }),
    pastureIrrigated: z.number().min(0).meta({
      description: 'Urea fertiliser used for irrigated pasture, in tonnes Urea',
    }),
    cropsDryland: z.number().min(0).meta({
      description: 'Urea fertiliser used for dryland crops, in tonnes Urea',
    }),
    cropsIrrigated: z.number().min(0).meta({
      description: 'Urea fertiliser used for irrigated crops, in tonnes Urea',
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
