import {
  RiceCultivationOrganicAmendmentType,
  RiceCultivationOrganicAmendmentTypes,
} from '@/constants/enums';
import { enumSchema } from '@/tools/enum-schemas';
import { input, numberInput } from '@/tools/inputs';
import { RICE_7_1 } from '@/tools/modules';
import { tonnesPerHectareToKgPerSquareMetres } from '@/tools/unit-conversion';
import { massPerArea } from '@/tools/units';
import { object } from '@/types/schemas';
import z from 'zod';

export const RiceCultivationOrganicAmendmentInputSchema = object({
  type: enumSchema(RiceCultivationOrganicAmendmentTypes)
    .transform((val) =>
      input(val as RiceCultivationOrganicAmendmentType, {
        name: 'organic amendment type',
        modules: [RICE_7_1],
      }),
    )
    .meta({
      description: 'The type of organic amendment applied.',
    }),
  rateOfApplication: numberInput(
    (val) =>
      massPerArea(
        'Organic Amendment',
        tonnesPerHectareToKgPerSquareMetres(val),
      ),
    {
      name: 'rate of application',
      method: '1',
      description:
        'The rate of application of this organic amendment. For straw, this should be measured in dry weight. Everything else should be given in terms of fresh weight.',
      modules: [RICE_7_1],
    },
    (s) => s.min(0),
  ),
});

export type RiceCultivationOrganicAmendmentInput = z.input<
  typeof RiceCultivationOrganicAmendmentInputSchema
>;
export type RiceCultivationOrganicAmendmentInputTransformed = z.output<
  typeof RiceCultivationOrganicAmendmentInputSchema
>;
