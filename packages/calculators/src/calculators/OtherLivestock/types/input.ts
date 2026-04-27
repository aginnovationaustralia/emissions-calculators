import { PureStates } from '@/constants/enums';
import { singleEnterpriseInput } from '@/types/schemas';
import { z } from 'zod';
import { OtherLivestockHerdInputSchema } from './herd.input';

export const OtherLivestockInputSchema = singleEnterpriseInput(
  'OtherLivestock',
  {
    herds: z.array(OtherLivestockHerdInputSchema),
    state: z.enum(PureStates),
  },
);

export type OtherLivestockInput = z.input<typeof OtherLivestockInputSchema>;
export type OtherLivestockInputTransformed = z.output<
  typeof OtherLivestockInputSchema
>;
