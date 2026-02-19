import {
  InorganicFertiliserComponentOrigins,
  InorganicFertiliserComponentTypes,
} from '@/calculators/Grains/constants/enums';
import { input } from '@/tools/inputs';
import { massPerMass, realNumber } from '@/tools/units';
import { object, percentage } from '@/types/schemas';
import { z } from 'zod';

export const InorganicFertiliserKnownComponentInputSchema = object({
  fractionOfFertiliser: percentage(
    'Fraction of inorganic fertiliser that is applied',
  ).transform((val) => input('fractionOfFertiliser', realNumber(val))),
  componentType: z.enum(InorganicFertiliserComponentTypes).meta({
    description: 'Type of inorganic fertiliser component',
  }),
  componentOrigin: z.enum(InorganicFertiliserComponentOrigins).meta({
    description: 'Origin of inorganic fertiliser component',
  }),
});

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
