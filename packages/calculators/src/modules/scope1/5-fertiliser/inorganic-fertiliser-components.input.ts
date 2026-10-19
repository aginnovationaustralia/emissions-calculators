import {
  InorganicFertiliserComponentOrigins,
  InorganicFertiliserComponentTypesNonRegional,
  InorganicFertiliserComponentTypesRegional,
} from '@/constants/enums';
import {
  enumInput,
  isPercentage,
  isProportion,
  numberInput,
} from '@/tools/inputs';
import {
  FERT_INORGANIC_5_1,
  LEACH_RUNOFF_5_5,
  PURCH_FERT_15_4,
} from '@/tools/modules';
import { massPerMass, realNumber } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const InorganicFertiliserKnownComponentWithOriginInputSchema = object({
  fractionOfFertiliser: numberInput(
    (val) => realNumber(val),
    {
      name: 'fractionOfFertiliser',
      method: '1',
      description: 'Fraction of inorganic fertiliser that is applied',
      modules: [FERT_INORGANIC_5_1, LEACH_RUNOFF_5_5, PURCH_FERT_15_4],
    },
    isPercentage,
  ),
  // Only read via 5.1's `.unit` predicate (never incorporated as a container, so
  // 5.1 doesn't count as a consumer here) - genuinely consumed as a selector
  // container by calculateScope3Fertiliser (15.4).
  componentType: enumInput(InorganicFertiliserComponentTypesRegional, {
    name: 'Fertiliser component type',
    description: 'Type of inorganic fertiliser component',
    modules: [PURCH_FERT_15_4, FERT_INORGANIC_5_1],
  }),
  componentOrigin: enumInput(InorganicFertiliserComponentOrigins, {
    name: 'Component origin region',
    description: 'Origin of inorganic fertiliser component',
    modules: [PURCH_FERT_15_4],
  }),
}).meta({ title: 'With origin region' });
export type InorganicFertiliserKnownComponentWithOriginInputTransformed =
  z.output<typeof InorganicFertiliserKnownComponentWithOriginInputSchema>;

export const InorganicFertiliserKnownComponentNoOriginInputSchema = object({
  fractionOfFertiliser: numberInput(
    (val) => realNumber(val),
    {
      name: 'fractionOfFertiliser',
      method: '1',
      description: 'Fraction of inorganic fertiliser that is applied',
      modules: [FERT_INORGANIC_5_1, LEACH_RUNOFF_5_5, PURCH_FERT_15_4],
    },
    isPercentage,
  ),
  componentType: enumInput(InorganicFertiliserComponentTypesNonRegional, {
    name: 'Fertiliser component type',
    description: 'Type of inorganic fertiliser component',
    modules: [PURCH_FERT_15_4],
  }),
}).meta({ title: 'Without origin region' });

const InorganicFertiliserKnownComponentInputSchema = z
  .xor([
    InorganicFertiliserKnownComponentWithOriginInputSchema,
    InorganicFertiliserKnownComponentNoOriginInputSchema,
  ])
  .meta({ title: 'Known component' });

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
  fractionOfFertiliser: numberInput(
    (val) => realNumber(val),
    {
      name: 'fractionOfFertiliser',
      method: '1',
      description: 'Fraction of inorganic fertiliser that is applied',
      modules: [FERT_INORGANIC_5_1, LEACH_RUNOFF_5_5, PURCH_FERT_15_4],
    },
    isProportion,
  ),
  emissionFactor: numberInput(
    (val) => massPerMass('CO2e', 'Inorganic Fertiliser', val),
    {
      name: 'emissionFactor',
      method: '1',
      scope: '3',
      description: 'Emission factor for inorganic fertiliser component',
      // Only calculateScope3FertiliserMethod1UnknownComponent (15.4) reads this.
      modules: [PURCH_FERT_15_4],
    },
    (s) => s.min(0),
  ),
}).meta({ title: 'Unknown component (custom emission factor)' });

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
