import { object } from '@/types/schemas';
import z from 'zod';
import { FreightInputSchema } from './freight.input';

export const FreightsInputSchema = object({
  freight: z.array(FreightInputSchema).meta({
    description:
      'Third-party freight services for inbound transportation of purchased goods and transportation of products to processing or storage facilities, where fuel use is NOT known. ' +
      'If fuel use for these services IS known, calculate emissions from the fuel usage instead for a method 2 calculation.',
  }),
});
export type FreightsInput = z.input<typeof FreightsInputSchema>;
export type FreightsInputTransformed = z.output<typeof FreightsInputSchema>;
