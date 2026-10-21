import { numberInput } from '@/tools/inputs';
import { BURNING_16_5 } from '@/tools/modules';
import { tonnesToKg } from '@/tools/unit-conversion';
import { mass } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const BurningInputSchema = object({
  emissionsFromBurningLowRainfallZone: numberInput(
    (val) => mass('CO2e', tonnesToKg(val)),
    {
      name: 'ELRZ,i,y',
      description:
        'Emissions from biomass burning in the Low Rainfall Zone. Derived from a SavCAM abatement report',
      method: '2',
      modules: [BURNING_16_5],
    },
  ),
  emissionsFromBurningHighRainfallZone: numberInput(
    (val) => mass('CO2e', tonnesToKg(val)),
    {
      name: 'EHRZ,i,y',
      description:
        'Emissions from biomass burning in the High Rainfall Zone. Derived from a SavCAM abatement report',
      method: '2',
      modules: [BURNING_16_5],
    },
  ),
  carbonStockChangeLowRainfallZone: numberInput(
    (val) => mass('CO2e', tonnesToKg(val)),
    {
      name: 'CLRZ,i,y',
      description:
        'Change in carbon stock in the Low Rainfall Zone for the activity area. Derived from a SavCAM abatement report',
      method: '2',
      modules: [BURNING_16_5],
    },
  ),
  carbonStockChangeHighRainfallZone: numberInput(
    (val) => mass('CO2e', tonnesToKg(val)),
    {
      name: 'CHRZ,i,y',
      description:
        'Change in carbon stock in the High Rainfall Zone for the activity area. Derived from a SavCAM abatement report',
      method: '2',
      modules: [BURNING_16_5],
    },
  ),
}).meta({ id: 'BurningInput' });

export type BurningInput = z.input<typeof BurningInputSchema>;
export type BurningInputTransformed = z.output<typeof BurningInputSchema>;
