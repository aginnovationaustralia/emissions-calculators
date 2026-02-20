import { OrganicFertiliserTypes } from '@/calculators/Grains/constants/enums';
import { input } from '@/tools/inputs';
import { massPerMass } from '@/tools/units';
import { object, proportion } from '@/types/schemas';
import { z } from 'zod';

export const OrganicFertiliserPurchasedUntracedInputSchema = object({
  origin: z.literal('Purchased_Untraced'),
  organicFertiliserType: z.enum(OrganicFertiliserTypes).meta({
    description: 'Type of organic fertiliser',
  }),
  customNitrogenFraction: proportion()
    .optional()
    .meta({
      description: 'Custom nitrogen fraction for the organic fertiliser',
    })
    .transform((val) =>
      val === undefined
        ? undefined
        : input(
            'customNitrogenFraction',
            massPerMass('N', 'Organic Fertiliser', val),
          ),
    ),
});

export type OrganicFertiliserPurchasedUntracedInput = z.input<
  typeof OrganicFertiliserPurchasedUntracedInputSchema
>;
export type OrganicFertiliserPurchasedUntracedInputTransformed = z.output<
  typeof OrganicFertiliserPurchasedUntracedInputSchema
>;
