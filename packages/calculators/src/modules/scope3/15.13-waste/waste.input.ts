import { object } from '@/types/schemas';
import { z } from 'zod';
import { OffsiteManureInputSchema } from './offsite-manure.input';
import { SolidWasteInputSchema } from './solid-waste.input';

export const WasteInputSchema = object({
  waste: object({
    offsiteManure: z.array(OffsiteManureInputSchema),
    solidWaste: SolidWasteInputSchema,
  }),
});

export type WasteInput = z.input<typeof WasteInputSchema>;
export type WasteInputTransformed = z.output<typeof WasteInputSchema>;
