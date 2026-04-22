import {
  RiceCultivationOrganicAmendmentType,
  RiceCultivationOrganicAmendmentTypes,
} from '@/constants/enums';
import { input } from '@/tools/inputs';
import { tonnesPerHectareToKgPerSquareMetres } from '@/tools/unit-conversion';
import { massPerArea } from '@/tools/units';
import { object } from '@/types/schemas';
import z from 'zod';

export const RiceCultivationOrganicAmendmentInputSchema = object({
  type: z
    .literal(RiceCultivationOrganicAmendmentTypes)
    .transform((val) =>
      input(
        'organic amendment type',
        val as RiceCultivationOrganicAmendmentType,
      ),
    )
    .meta({
      description: 'The type of organic amendment applied.',
    }),
  rateOfApplication: z
    .number()
    .min(0)
    .transform((val) =>
      input(
        'rate of application',
        massPerArea(
          'Organic Amendment',
          tonnesPerHectareToKgPerSquareMetres(val),
        ),
      ),
    )
    .meta({
      description:
        'The rate of application of this organic amendment, in tonnes per hectare. For straw, this should be measured in dry weight. Everything else should be given in terms of fresh weight.',
    }),
});

export type RiceCultivationOrganicAmendmentInput = z.input<
  typeof RiceCultivationOrganicAmendmentInputSchema
>;
export type RiceCultivationOrganicAmendmentInputTransformed = z.output<
  typeof RiceCultivationOrganicAmendmentInputSchema
>;
