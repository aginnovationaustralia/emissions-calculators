import { numberInput } from '@/tools/inputs';
import { PERENNIAL_16_6 } from '@/tools/modules';
import { hectaresToSquareMetres } from '@/tools/unit-conversion';
import { area, years } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const PerennialCropPlantingInputSchema = object({
  areaPlanted: numberInput(
    (val) => area(hectaresToSquareMetres(val)),
    {
      name: 'Ac,t',
      description: 'Area planted t years ago',
      modules: [PERENNIAL_16_6],
    },
    (s) => s.min(0),
  ),
  yearsSincePlanting: numberInput(
    (val) => years(val),
    {
      name: 't',
      description: 'Time since planting',
      modules: [PERENNIAL_16_6],
    },
    (s) => s.min(0),
  ),
});

export type PerennialCropPlantingInput = z.input<
  typeof PerennialCropPlantingInputSchema
>;
export type PerennialCropPlantingInputTransformed = z.output<
  typeof PerennialCropPlantingInputSchema
>;
