import { ElectricityRegions } from '@/constants/enums';
import {
  enumInput,
  isPercentage,
  numberInput,
  numberInputOptional,
} from '@/tools/inputs';
import { megawattHoursToKilowattHours } from '@/tools/unit-conversion';
import { electricity, percentage } from '@/tools/units';
import { DESCRIPTIONS } from '@/types/descriptions.schema';
import { object } from '@/types/schemas';

import { ELECTRICITY_14_1, ELECTRICITY_15_11 } from '@/tools/modules';
import { z } from 'zod';

export const MarketBasedElectricityInputsSchema = object({
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
  region: enumInput(ElectricityRegions, {
    name: 'State, territory or national electricity',
    description:
      'The state, territory or electricity grid the electricity is purchased in',
    modules: [ELECTRICITY_14_1, ELECTRICITY_15_11],
  }),
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
  jurisdictionalRenewablePowerPercentage: numberInputOptional(
    (val) => percentage(val),
    {
      name: 'JRPP',
      method: '1',
      description:
        'Jurisdictional Renewable Power Percentage (JRPP) for the reporting year, from 0 to 100. Only applies to electricity purchased in the ACT, and is ignored for other regions. If not supplied, the built-in value for 2026 (76.13%) is used.',
      modules: [ELECTRICITY_14_1, ELECTRICITY_15_11],
    },
    isPercentage,
  ),
}).meta({ title: 'Market based' });

export type MarketBasedElectricityInputs = z.input<
  typeof MarketBasedElectricityInputsSchema
>;
export type MarketBasedElectricityInputsTransformed = z.output<
  typeof MarketBasedElectricityInputsSchema
>;
