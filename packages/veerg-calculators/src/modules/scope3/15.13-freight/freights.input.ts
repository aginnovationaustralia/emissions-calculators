import { object } from '@/types/schemas';
import z from 'zod';
import { FreightInputSchema } from './freight.input';

export const FreightsInputSchema = object({
  freight: z.array(FreightInputSchema).meta({
    description:
      'Third-party freight services for inbound transportation of purchased goods and transportation of products to processing or storage facilities. ' +
      'Use method 1 (freight type, distance, and weight) when fuel use is not known, or method 2 (fuel) when fuel use is known.',
  }),
});
export type FreightsInput = z.input<typeof FreightsInputSchema>;
export type FreightsInputTransformed = z.output<typeof FreightsInputSchema>;
