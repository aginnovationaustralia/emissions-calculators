import { numberInput } from '@/tools/inputs';
import { SUPP_CO2_12_1 } from '@/tools/modules';
import { mass } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const HasSupplementaryCO2InputSchema = object({
  supplementaryCO2Kg: numberInput(
    (val) => mass('CO2', val),
    {
      name: 'Q',
      method: '1',
      scope: '1',
      description:
        'Quantity of supplementary carbon dioxide used within operations.',
      modules: [SUPP_CO2_12_1],
    },
    (s) => s.min(0),
  ),
});

export type HasSupplementaryCO2Input = z.input<
  typeof HasSupplementaryCO2InputSchema
>;
export type HasSupplementaryCO2InputTransformed = z.output<
  typeof HasSupplementaryCO2InputSchema
>;
