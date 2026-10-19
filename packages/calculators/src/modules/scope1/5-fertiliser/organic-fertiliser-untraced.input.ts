import { OrganicFertiliserTypes } from '@/constants/enums';
import {
  enumInput,
  isProportion,
  numberInput,
  numberInputOptional,
} from '@/tools/inputs';
import { FERT_ORGANIC_5_2 } from '@/tools/modules';
import { mass, massPerMass } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const OrganicFertiliserUntracedInputSchema = object({
  origin: z.literal('Untraced'),
  massAppliedKg: numberInput(
    (val) => mass('Organic Fertiliser', val),
    {
      name: 'massAppliedKg',
      method: '1',
      description: 'Mass of organic fertiliser applied',
      modules: [FERT_ORGANIC_5_2],
    },
    (s) => s.min(0),
  ),
  organicFertiliserType: enumInput(OrganicFertiliserTypes, {
    name: 'Organic fertiliser type',
    description: 'Type of organic fertiliser',
    modules: [FERT_ORGANIC_5_2],
  }),
  customNitrogenFraction: numberInputOptional(
    (val) => massPerMass('N', 'Organic Fertiliser', val),
    {
      name: 'customNitrogenFraction',
      method: '1', // NOTE: This is definitely method 1, even though it feels like a method 2 input
      description: 'Custom nitrogen fraction for the organic fertiliser',
      modules: [FERT_ORGANIC_5_2],
    },
    isProportion,
  ),
}).meta({ title: 'Untraced manure' });

export type OrganicFertiliserUntracedInput = z.input<
  typeof OrganicFertiliserUntracedInputSchema
>;
export type OrganicFertiliserUntracedInputTransformed = z.output<
  typeof OrganicFertiliserUntracedInputSchema
>;
