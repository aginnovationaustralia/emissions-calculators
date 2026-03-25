import { InorganicFertiliserTypes } from '@/constants/enums';
import { input } from '@/tools/inputs';
import { mass, massPerMass } from '@/tools/units';
import { object, proportion } from '@/types/schemas';
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
  /*
   */
  components: z
    .array(InorganicFertiliserComponentInputSchema)
    .optional()
    .meta({
      description: `Components of the inorganic fertiliser applied.
    NOTE: 5.1.2.1 FNinorganic,f data source allows you to supply a custom nitrogen fraction for the fertiliser. This is currently
   implemented via the components field. This means you must supply all components if you want this scenario. If you only supply
   a custom nitrogen fraction, scope 3 emissions will be under calculated. Do not supply a partial list of components.`,
    }),
  calculationMethodScope3: z.literal('1').meta({
    description:
      'Choosing method 2 for calculating scope 3 emissions for this fertiliser',
  }),
});

export const isInorganicFertiliserInputScope3Method1 = (
  input: InorganicFertiliserInputTransformed,
): input is InorganicFertiliserInputScope3Method1Transformed => {
  return input.calculationMethodScope3 === '1';
};

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
  customNitrogenFraction: proportion(
    'Custom nitrogen fraction for the fertiliser',
  )
    .optional() // TODO: Need a linter rule or something to ensure the transform function handles optional / undefined cases
    .transform((val) =>
      val
        ? input(
            'customNitrogenFraction',
            massPerMass('N', 'Inorganic Fertiliser', val),
          )
        : undefined,
    ),
  customScope3EmissionFactor: z
    .number()
    .min(0)
    .optional()
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

export const InorganicFertiliserInputSchema = z.discriminatedUnion(
  'calculationMethodScope3',
  [
    InorganicFertiliserInputScope3Method1Schema,
    InorganicFertiliserInputScope3Method2Schema,
  ],
);

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
