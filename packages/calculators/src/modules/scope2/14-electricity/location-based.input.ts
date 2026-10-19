import { ElectricityRegions } from '@/constants/enums';
import { enumInput, numberInput } from '@/tools/inputs';
import { ELECTRICITY_14_1, ELECTRICITY_15_11 } from '@/tools/modules';
import { electricity } from '@/tools/units';
import { DESCRIPTIONS } from '@/types/descriptions.schema';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const LocationBasedElectricityInputsSchema = object({
  method: z.literal('location'),
  electricityPurchasedKWh: numberInput(
    (val) => electricity(val),
    {
      name: 'electricityPurchased',
      method: '1',
      description: DESCRIPTIONS.ELECTRICITY_USE,
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
}).meta({ title: 'Location based' });

export type LocationBasedElectricityInputs = z.input<
  typeof LocationBasedElectricityInputsSchema
>;
export type LocationBasedElectricityInputsTransformed = z.output<
  typeof LocationBasedElectricityInputsSchema
>;
