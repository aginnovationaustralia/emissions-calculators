import { PureStatesWithoutNT } from '@/constants/enums';
import { ElectricityInputsSchema } from '@/modules/scope2/14-electricity/electricity.input';
import { singleEnterpriseInput } from '@/types/schemas';
import { z } from 'zod';
import { SheepFlockInputSchema } from './sheep-flock.input';

export const SheepInputSchema = singleEnterpriseInput('Sheep', {
  state: z
    .enum(PureStatesWithoutNT)
    .meta({ description: 'The state the enterprise is located in' }),
  flocks: z.array(SheepFlockInputSchema),
  electricity: ElectricityInputsSchema,
});

export type SheepInput = z.input<typeof SheepInputSchema>;
export type SheepInputTransformed = z.output<typeof SheepInputSchema>;
