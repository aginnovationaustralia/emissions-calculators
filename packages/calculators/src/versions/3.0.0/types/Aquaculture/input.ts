import { z } from 'zod';
import { AquacultureEnterpriseInputSchema } from './aquaculture.input';

export const AquacultureInputSchema = z
  .object({
    enterprises: z.array(AquacultureEnterpriseInputSchema),
  })
  .meta({
    description: 'Input data required for the `aquaculture` calculator',
  });

export type AquacultureInput = z.infer<typeof AquacultureInputSchema>;
