import { RefrigerantTypes, RefrigerationTypes } from '@/constants/enums';
import { enumInput, numberInput } from '@/tools/inputs';
import { REFRIGERANT_9_1 } from '@/tools/modules';
import { mass } from '@/tools/units';
import { DESCRIPTIONS } from '@/types/descriptions.schema';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const RefrigerantInputSchema = object({
  refrigerant: enumInput(RefrigerantTypes, {
    name: 'Refrigerant gas type',
    description: DESCRIPTIONS.REFRIGERANT,
    modules: [REFRIGERANT_9_1],
  }),
  chargeSize: numberInput(
    (c) => mass('Refrigerant', c),
    {
      name: 'chargeSize',
      method: '1',
      description: 'Amount of refrigerant contained in the appliance',
      modules: [REFRIGERANT_9_1],
    },
    (s) => s.min(0),
  ),
  refrigerationType: enumInput(RefrigerationTypes, {
    name: 'Refrigeration equipment type',
    description: 'Type of refrigeration appliance',
    modules: [REFRIGERANT_9_1],
  }),
});

export type RefrigerantInput = z.input<typeof RefrigerantInputSchema>;
export type RefrigerantInputTransformed = z.output<
  typeof RefrigerantInputSchema
>;
