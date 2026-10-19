import { ElectricityRegions } from '@/constants/enums';
import { enumInput, numberInput } from '@/tools/inputs';
import { megawattHoursToKilowattHours } from '@/tools/unit-conversion';
import { electricity } from '@/tools/units';
import { DESCRIPTIONS } from '@/types/descriptions.schema';
import { object } from '@/types/schemas';

import { ELECTRICITY_14_1, ELECTRICITY_15_11 } from '@/tools/modules';
import { z } from 'zod';

export const MarketBasedElectricityInputsSchema = object({
  method: z.literal('market'),
  electricityPurchasedKWh: numberInput(
    (val) => electricity(val),
    {
      name: 'Qelec',
      method: '1',
      description: DESCRIPTIONS.ELECTRICITY_USE,
      modules: [ELECTRICITY_14_1, ELECTRICITY_15_11],
    },
    (s) => s.min(0),
  ),
  recsSurrendered: numberInput(
    (val) => electricity(megawattHoursToKilowattHours(val)),
    {
      name: 'RECsurrendered',
      method: '1',
      description: DESCRIPTIONS.RECS_SURRENDERED,
      modules: [ELECTRICITY_14_1, ELECTRICITY_15_11],
    },
    (s) => s.min(0),
  ),
  recsOnsite: numberInput(
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
}).meta({ title: 'Market based' });

export type MarketBasedElectricityInputs = z.input<
  typeof MarketBasedElectricityInputsSchema
>;
export type MarketBasedElectricityInputsTransformed = z.output<
  typeof MarketBasedElectricityInputsSchema
>;
