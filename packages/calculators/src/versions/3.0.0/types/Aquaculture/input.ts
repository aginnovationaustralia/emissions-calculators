import { z } from 'zod';
import { calculatorInput } from '../schemas';
import { AquacultureEnterpriseInputSchema } from './aquaculture.input';

export const AquacultureInputSchema = calculatorInput('Aquaculture', {
  enterprises: z.array(AquacultureEnterpriseInputSchema),
});

export type AquacultureInput = z.infer<typeof AquacultureInputSchema>;
