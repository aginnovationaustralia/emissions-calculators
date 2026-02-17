import { InorganicFertiliserTypes } from '@/calculators/Grains/constants/enums';
import { input } from '@/tools/inputs';
import { mass, massPerMass } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';
import { InorganicFertiliserComponentInputSchema } from './inorganic-fertiliser-components.input';

export const InorganicFertiliserInputScope3Method1Schema = object({
  massAppliedKg: z
    .number()
    .min(0)
    .meta({
      description: 'Mass of inorganic fertiliser applied, in kg',
    })
    .transform((val) =>
      input('massAppliedKg', mass('Inorganic Fertiliser', val)),
    ),
  fertiliserType: z.enum(InorganicFertiliserTypes).meta({
    description: 'Type of inorganic fertiliser applied',
  }),
  components: z.array(InorganicFertiliserComponentInputSchema).optional().meta({
    description: 'Components of inorganic fertiliser applied',
  }),
  calculationMethodScope3: z.literal('1').meta({
    description:
      'Choosing method 2 for calculating scope 3 emissions for this fertiliser',
  }),
});

export const InorganicFertiliserInputScope3Method2Schema = object({
  massAppliedKg: z
    .number()
    .min(0)
    .meta({
      description: 'Mass of inorganic fertiliser applied, in kg',
    })
    .transform((val) =>
      input('massAppliedKg', mass('Inorganic Fertiliser', val)),
    ),
  fertiliserType: z.enum(InorganicFertiliserTypes).meta({
    description: 'Type of inorganic fertiliser applied',
  }),
  customScope3EmissionFactor: z
    .number()
    .min(0)
    .meta({
      description:
        'Custom scope 3 emission factor for this fertiliser, in kg CO2e/kg',
    })
    .transform((val) =>
      input(
        'customScope3EmissionFactor',
        massPerMass('CO2e', 'Inorganic Fertiliser', val),
      ),
    ),
  calculationMethodScope3: z.literal('2').meta({
    description:
      'Choosing method 2 for calculating scope 3 emissions for this fertiliser',
  }),
});

export const isInorganicFertiliserInputScope3Method2 = (
  input: InorganicFertiliserInputTransformed,
): input is InorganicFertiliserInputScope3Method2Transformed => {
  return input.calculationMethodScope3 === '2';
};

export const InorganicFertiliserInputSchema = z.xor([
  InorganicFertiliserInputScope3Method1Schema,
  InorganicFertiliserInputScope3Method2Schema,
]);

export type InorganicFertiliserInput = z.input<
  typeof InorganicFertiliserInputSchema
>;
export type InorganicFertiliserInputTransformed = z.output<
  typeof InorganicFertiliserInputSchema
>;

export type InorganicFertiliserInputScope3Method2Transformed = z.output<
  typeof InorganicFertiliserInputScope3Method2Schema
>;

export type InorganicFertiliserInputScope3Method1Transformed = z.output<
  typeof InorganicFertiliserInputScope3Method1Schema
>;
