import { ElectricityRegionsExcludingACT } from '@/constants/enums';
import {
  enumInput,
  isPercentage,
  literalInput,
  numberInput,
  numberInputOptional,
  TypedInputOptions,
} from '@/tools/inputs';
import { megawattHoursToKilowattHours } from '@/tools/unit-conversion';
import { electricity, percentage } from '@/tools/units';
import { DESCRIPTIONS } from '@/types/descriptions.schema';
import { object } from '@/types/schemas';

import { ELECTRICITY_14_1, ELECTRICITY_15_11 } from '@/tools/modules';
import { z } from 'zod';

const regionOptions = {
  name: 'State, territory or national electricity',
  description:
    'The state, territory or electricity grid the electricity is purchased in',
  modules: [ELECTRICITY_14_1, ELECTRICITY_15_11],
} satisfies TypedInputOptions;

/** Inputs shared by every region under the market-based method */
const marketBasedElectricityShape = {
  method: z.literal('market'),
  electricityPurchasedKilowattHours: numberInput(
    (val) => electricity(val),
    {
      name: 'Qelec',
      method: '1',
      description: DESCRIPTIONS.ELECTRICITY_USE,
      modules: [ELECTRICITY_14_1, ELECTRICITY_15_11],
    },
    (s) => s.min(0),
  ),
  recsSurrenderedMegawattHours: numberInput(
    (val) => electricity(megawattHoursToKilowattHours(val)),
    {
      name: 'RECsurrendered',
      method: '1',
      description: DESCRIPTIONS.RECS_SURRENDERED,
      modules: [ELECTRICITY_14_1, ELECTRICITY_15_11],
    },
    (s) => s.min(0),
  ),
  recsOnsiteMegawattHours: numberInput(
    (val) => electricity(megawattHoursToKilowattHours(val)),
    {
      name: 'REConsite',
      method: '1',
      description: DESCRIPTIONS.RECS_ONSITE,
      modules: [ELECTRICITY_14_1, ELECTRICITY_15_11],
    },
    (s) => s.min(0),
  ),
  renewablePowerPercentage: numberInputOptional(
    (val) => percentage(val),
    {
      name: 'RPP',
      method: '1',
      description:
        'Renewable Power Percentage (RPP) under the Large-scale Renewable Energy Target for the reporting year, from 0 to 100, as published annually by the Clean Energy Regulator. If not supplied, the built-in value for 2026 (16.67%) is used.',
      modules: [ELECTRICITY_14_1, ELECTRICITY_15_11],
    },
    isPercentage,
  ),
};

export const MarketBasedACTElectricityInputsSchema = object({
  ...marketBasedElectricityShape,
  region: literalInput('ACT', regionOptions),
  jurisdictionalRenewablePowerPercentage: numberInputOptional(
    (val) => percentage(val),
    {
      name: 'JRPP',
      method: '1',
      description:
        'Jurisdictional Renewable Power Percentage (JRPP) for the reporting year, from 0 to 100. If not supplied, the built-in value for 2026 (76.13%) is used.',
      modules: [ELECTRICITY_14_1, ELECTRICITY_15_11],
    },
    isPercentage,
  ),
}).meta({ title: 'Market based (ACT)' });

export const MarketBasedNonACTElectricityInputsSchema = object({
  ...marketBasedElectricityShape,
  region: enumInput(ElectricityRegionsExcludingACT, regionOptions),
}).meta({ title: 'Market based (outside the ACT)' });

export const MarketBasedElectricityInputsSchema = z
  .discriminatedUnion('region', [
    MarketBasedACTElectricityInputsSchema,
    MarketBasedNonACTElectricityInputsSchema,
  ])
  .meta({ title: 'Market based' });

export type MarketBasedACTElectricityInputs = z.input<
  typeof MarketBasedACTElectricityInputsSchema
>;
export type MarketBasedACTElectricityInputsTransformed = z.output<
  typeof MarketBasedACTElectricityInputsSchema
>;
export type MarketBasedNonACTElectricityInputs = z.input<
  typeof MarketBasedNonACTElectricityInputsSchema
>;
export type MarketBasedNonACTElectricityInputsTransformed = z.output<
  typeof MarketBasedNonACTElectricityInputsSchema
>;
export type MarketBasedElectricityInputs = z.input<
  typeof MarketBasedElectricityInputsSchema
>;
export type MarketBasedElectricityInputsTransformed = z.output<
  typeof MarketBasedElectricityInputsSchema
>;

/**
 * The supplied JRPP override, if any. Only ACT inputs can carry one; for every other region
 * this is undefined. The calculation still multiplies JRPP by a region-derived factor so the
 * branch remains visible in the calculation graph.
 */
export const suppliedJurisdictionalRenewablePowerPercentage = (
  input: MarketBasedElectricityInputsTransformed,
) =>
  'jurisdictionalRenewablePowerPercentage' in input
    ? input.jurisdictionalRenewablePowerPercentage
    : undefined;
