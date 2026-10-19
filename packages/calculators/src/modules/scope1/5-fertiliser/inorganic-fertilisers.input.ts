import { numberInput } from '@/tools/inputs';
import { FERT_INORGANIC_5_1 } from '@/tools/modules';
import { hectaresToSquareMetres } from '@/tools/unit-conversion';
import { area } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';
import {
  InorganicFertiliserInputSchema,
  InorganicFertiliserInputTransformed,
} from './inorganic-fertiliser.input';
import { InorganicFertiliserInputScope3Method1Schema } from './inorganic-fertiliser-method1.input';
import {
  InorganicFertiliserInputScope3Method2KnownFertiliserSchema,
  InorganicFertiliserInputScope3Method2OtherFertiliserSchema,
} from './inorganic-fertiliser-method2.input';

export const InorganicFertilisersScope1Method1InputSchema = object({
  applications: z.array(InorganicFertiliserInputSchema).meta({
    description: 'Inorganic fertiliser applications',
  }),
  calculationMethodScope1: z.literal('1').meta({
    description: 'Method of calculating fertiliser emissions',
  }),
});

// InorganicFertiliserInputSchema is a union, so it has no shape to extend. Instead each
// object branch of the union extends this base, and the union is rebuilt.
const InorganicFertiliserWithAreaBaseSchema = object({
  areaAppliedHectares: numberInput(
    (val) => area(hectaresToSquareMetres(val)),
    {
      name: 'areaAppliedHectares',
      description:
        'Area that this application of inorganic fertiliser was applied to',
      method: '2',
      modules: [FERT_INORGANIC_5_1],
    },
    (s) => s.gt(0),
  ),
});

const InorganicFertiliserInputSchemaWithArea = z.discriminatedUnion(
  'calculationMethodScope3',
  [
    InorganicFertiliserWithAreaBaseSchema.safeExtend(
      InorganicFertiliserInputScope3Method1Schema.shape,
    ).meta({ title: 'Scope 3 method 1' }),
    z
      .discriminatedUnion('fertiliserType', [
        InorganicFertiliserWithAreaBaseSchema.safeExtend(
          InorganicFertiliserInputScope3Method2KnownFertiliserSchema.shape,
        ).meta({ title: 'Scope 3 method 2 (known fertiliser type)' }),
        InorganicFertiliserWithAreaBaseSchema.safeExtend(
          InorganicFertiliserInputScope3Method2OtherFertiliserSchema.shape,
        ).meta({ title: 'Scope 3 method 2 (other fertiliser type)' }),
      ])
      .meta({ title: 'Scope 3 method 2' }),
  ],
);

export type InorganicFertiliserInputWithArea = z.input<
  typeof InorganicFertiliserInputSchemaWithArea
>;
export type InorganicFertiliserInputWithAreaTransformed = z.output<
  typeof InorganicFertiliserInputSchemaWithArea
>;

export const InorganicFertilisersScope1Method2InputSchema = object({
  applications: z.array(InorganicFertiliserInputSchemaWithArea).meta({
    description: 'Inorganic fertiliser applications',
  }),
  calculationMethodScope1: z.literal('2').meta({
    description: 'Method of calculating fertiliser emissions',
  }),
});

export type InorganicFertilisersScope1Method1Input = z.input<
  typeof InorganicFertilisersScope1Method1InputSchema
>;

export type InorganicFertilisersScope1Method1InputTransformed = z.output<
  typeof InorganicFertilisersScope1Method1InputSchema
>;

export type InorganicFertilisersScope1Method2Input = z.input<
  typeof InorganicFertilisersScope1Method2InputSchema
>;

export type InorganicFertilisersScope1Method2InputTransformed = z.output<
  typeof InorganicFertilisersScope1Method2InputSchema
>;

export const isInorganicFertiliserInputWithArea = (
  input:
    | InorganicFertiliserInputTransformed
    | InorganicFertiliserInputWithAreaTransformed,
): input is InorganicFertiliserInputWithAreaTransformed => {
  return 'areaAppliedHectares' in input;
};
