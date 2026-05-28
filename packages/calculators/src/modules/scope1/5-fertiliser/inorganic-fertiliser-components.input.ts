import {
  InorganicFertiliserComponentOrigins,
  InorganicFertiliserComponentTypesNonRegional,
  InorganicFertiliserComponentTypesRegional,
} from '@/constants/enums';
import { input } from '@/tools/inputs';
import { massPerMass, realNumber } from '@/tools/units';
import { object, percentage } from '@/types/schemas';
import { z } from 'zod';

export const InorganicFertiliserKnownComponentWithOriginInputSchema = object({
  fractionOfFertiliser: percentage(
    'Fraction of inorganic fertiliser that is applied',
  ).transform((val) => input('fractionOfFertiliser', realNumber(val))),
  componentType: z.enum(InorganicFertiliserComponentTypesRegional).meta({
    description: 'Type of inorganic fertiliser component',
  }),
  componentOrigin: z.enum(InorganicFertiliserComponentOrigins).meta({
    description: 'Origin of inorganic fertiliser component',
  }),
});
export type InorganicFertiliserKnownComponentWithOriginInputTransformed =
  z.output<typeof InorganicFertiliserKnownComponentWithOriginInputSchema>;

export const InorganicFertiliserKnownComponentNoOriginInputSchema = object({
  fractionOfFertiliser: percentage(
    'Fraction of inorganic fertiliser that is applied',
  ).transform((val) => input('fractionOfFertiliser', realNumber(val))),
  componentType: z.enum(InorganicFertiliserComponentTypesNonRegional).meta({
    description: 'Type of inorganic fertiliser component',
  }),
});

const InorganicFertiliserKnownComponentInputSchema = z.xor([
  InorganicFertiliserKnownComponentWithOriginInputSchema,
  InorganicFertiliserKnownComponentNoOriginInputSchema,
]);

export const isInorganicFertiliserKnownComponentWithOrigin = (
  component: InorganicFertiliserKnownComponentInputTransformed,
): component is InorganicFertiliserKnownComponentWithOriginInputTransformed => {
  return 'componentOrigin' in component;
};

export const isInorganicFertiliserKnownComponent = (
  component: InorganicFertiliserComponentInputTransformed,
): component is InorganicFertiliserKnownComponentInputTransformed => {
  return 'componentType' in component;
};

export const InorganicFertiliserUnknownComponentInputSchema = object({
  fractionOfFertiliser: percentage(
    'Fraction of inorganic fertiliser that is applied',
  ).transform((val) => input('fractionOfFertiliser', realNumber(val))),
  emissionFactor: z
    .number()
    .min(0)
    .meta({
      description:
        'Emission factor for inorganic fertiliser component, in kg CO2e/kg',
    })
    .transform((val) =>
      input('emissionFactor', massPerMass('CO2e', 'Inorganic Fertiliser', val)),
    ),
});

export const InorganicFertiliserComponentInputSchema = z.xor([
  InorganicFertiliserKnownComponentInputSchema,
  InorganicFertiliserUnknownComponentInputSchema,
]);

export type InorganicFertiliserComponentInputTransformed = z.output<
  typeof InorganicFertiliserComponentInputSchema
>;
export type InorganicFertiliserUnknownComponentInputTransformed = z.output<
  typeof InorganicFertiliserUnknownComponentInputSchema
>;
export type InorganicFertiliserKnownComponentInputTransformed = z.output<
  typeof InorganicFertiliserKnownComponentInputSchema
>;
