import { object } from '@/types/schemas';
import { z } from 'zod';
import { BeefClassesInputSchema } from './beef-classes.input';

export const BeefHerdInputSchema = object({
  classes: BeefClassesInputSchema,
  unfencedNaturalWater: z.boolean().meta({
    description:
      'Whether animals have access to unfenced natural water. If animals are on bore or reticulated water systems where water is provided in troughs (i.e. no unfenced natural water sources) then set to false',
  }),
});

export type BeefHerdInput = z.input<typeof BeefHerdInputSchema>;
export type BeefHerdInputTransformed = z.output<typeof BeefHerdInputSchema>;
