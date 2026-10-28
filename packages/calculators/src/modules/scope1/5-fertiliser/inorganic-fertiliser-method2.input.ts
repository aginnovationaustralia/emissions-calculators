import { InorganicFertiliserTypes } from '@/constants/enums';
import {
  enumInput,
  isProportion,
  literalInput,
  numberInput,
  numberInputOptional,
} from '@/tools/inputs';
import {
  ATMOS_DEPOSIT_5_4,
  FERT_INORGANIC_5_1,
  LEACH_RUNOFF_5_5,
  PURCH_FERT_15_4,
} from '@/tools/modules';
import { mass, massPerMass } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const otherFertilisers = 'Other Fertilisers' as const;

const InorganicFertiliserInputScope3Method2BaseSchema = object({
  massAppliedKg: numberInput(
    (val) => mass('Inorganic Fertiliser', val),
    {
      name: 'massAppliedKg',
      method: '2',
      description: 'Mass of inorganic fertiliser applied',
      modules: [
        FERT_INORGANIC_5_1,
        ATMOS_DEPOSIT_5_4,
        LEACH_RUNOFF_5_5,
        PURCH_FERT_15_4,
      ],
    },
    (s) => s.min(0),
  ),

  customScope3EmissionFactor: numberInput(
    (val) => massPerMass('CO2e', 'Inorganic Fertiliser', val),
    {
      name: 'customScope3EmissionFactor',
      method: '2',
      scope: '3',
      description: 'Custom scope 3 emission factor for this fertiliser',
      modules: [PURCH_FERT_15_4],
    },
    (s) => s.min(0),
  ),
  calculationMethodScope3: z.literal('2').meta({
    description:
      'Choosing method 2 for calculating scope 3 emissions for this fertiliser',
  }),
});

export const InorganicFertiliserInputScope3Method2KnownFertiliserSchema =
  InorganicFertiliserInputScope3Method2BaseSchema.safeExtend({
    fertiliserType: enumInput(InorganicFertiliserTypes, {
      name: 'Inorganic fertiliser type',
      description: 'Type of inorganic fertiliser applied',
      modules: [
        FERT_INORGANIC_5_1,
        ATMOS_DEPOSIT_5_4,
        LEACH_RUNOFF_5_5,
        PURCH_FERT_15_4,
      ],
    }),
    customNitrogenFraction: numberInputOptional(
      (val) => massPerMass('N', 'Inorganic Fertiliser', val),
      {
        name: 'customNitrogenFraction',
        method: '2',
        description: 'Custom nitrogen fraction for the fertiliser',
        modules: [FERT_INORGANIC_5_1, LEACH_RUNOFF_5_5],
      },
      isProportion,
    ),
  }).meta({ title: 'Scope 3 method 2 (known fertiliser type)' });

export const InorganicFertiliserInputScope3Method2OtherFertiliserSchema =
  InorganicFertiliserInputScope3Method2BaseSchema.safeExtend({
    fertiliserType: literalInput(otherFertilisers, {
      name: 'Inorganic fertiliser type',
      description: 'Type of inorganic fertiliser applied',
      modules: [
        FERT_INORGANIC_5_1,
        ATMOS_DEPOSIT_5_4,
        LEACH_RUNOFF_5_5,
        PURCH_FERT_15_4,
      ],
    }),
    customNitrogenFraction: numberInput(
      (val) => massPerMass('N', 'Inorganic Fertiliser', val),
      {
        name: 'customNitrogenFraction',
        method: '2',
        description: 'Custom nitrogen fraction for the fertiliser',
        modules: [FERT_INORGANIC_5_1, LEACH_RUNOFF_5_5],
      },
      isProportion,
    ),
    customUreaFraction: numberInput(
      (val) => massPerMass('Urea', 'Inorganic Fertiliser', val),
      {
        name: 'customUreaFraction',
        method: '2',
        description: 'Custom urea fraction for the fertiliser',
        modules: [FERT_INORGANIC_5_1],
      },
      isProportion,
    ),
  }).meta({ title: 'Scope 3 method 2 (other fertiliser type)' });

export const InorganicFertiliserInputScope3Method2Schema = z
  .discriminatedUnion('fertiliserType', [
    InorganicFertiliserInputScope3Method2KnownFertiliserSchema,
    InorganicFertiliserInputScope3Method2OtherFertiliserSchema,
  ])
  .meta({ title: 'Scope 3 method 2' });

export type InorganicFertiliserInputScope3Method2Transformed = z.output<
  typeof InorganicFertiliserInputScope3Method2Schema
>;

export type InorganicFertiliserInputScope3Method2OtherTransformed = z.output<
  typeof InorganicFertiliserInputScope3Method2OtherFertiliserSchema
>;
