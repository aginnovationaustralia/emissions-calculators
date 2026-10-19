import { hasFuelInputSchema } from '@/modules/scope1/8-fuel-use';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const ServicesInputSchema = object({
  services: hasFuelInputSchema('services'),
});

export type ServicesInput = z.input<typeof ServicesInputSchema>;
export type ServicesInputTransformed = z.output<typeof ServicesInputSchema>;
