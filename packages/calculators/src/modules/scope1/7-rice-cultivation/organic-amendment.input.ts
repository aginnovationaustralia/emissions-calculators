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
      description: 'TODO',
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
      description: 'TODO',
    }),
});

export type RiceCultivationOrganicAmendmentInput = z.input<
  typeof RiceCultivationOrganicAmendmentInputSchema
>;
export type RiceCultivationOrganicAmendmentInputTransformed = z.output<
  typeof RiceCultivationOrganicAmendmentInputSchema
>;
