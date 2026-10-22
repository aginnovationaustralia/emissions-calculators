import { isProportion, numberInput } from '@/tools/inputs';
import { ALLOCATION } from '@/tools/modules';
import { realNumber } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const ActivityInputSchema = object({
  id: z.string().optional().meta({
    description: `Unique identifier for this activity`,
  }),
  electricityAllocation: numberInput(
    (val) => realNumber(val),
    {
      name: 'electricityAllocation',
      description:
        'Share of electricity emissions to allocate to this activity. Refer to Chapter 10 (Estimating the GHG intensity of products) of the Common Requirements Framework for guidance on allocation methods.',
      modules: [ALLOCATION],
    },
    isProportion,
  ),
});

export type ActivityInput = z.input<typeof ActivityInputSchema>;
export type ActivityInputTransformed = z.output<typeof ActivityInputSchema>;
