import { LivestockInputSchema } from '@/calculators/types/livestock.input';
import { PureStatesWithoutNT } from '@/constants/enums';
import { singleEnterpriseInput } from '@/types/schemas';
import { z } from 'zod';
import { SheepFlockInputSchema } from './sheep-flock.input';

export const SheepInputSchema = singleEnterpriseInput(
  'Sheep',
  LivestockInputSchema.extend({
    state: z
      .enum(PureStatesWithoutNT)
      .meta({ description: 'The state the enterprise is located in' }),
    flocks: z.array(SheepFlockInputSchema),
  }),
).shape;

export type SheepInput = z.input<typeof SheepInputSchema>;
export type SheepInputTransformed = z.output<typeof SheepInputSchema>;
