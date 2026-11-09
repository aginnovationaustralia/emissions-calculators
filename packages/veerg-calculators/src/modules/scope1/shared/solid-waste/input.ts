import { SolidWasteScope1InputSchema } from '@/modules/scope1/10-solid-waste/solid-waste-scope1.input';
import { SolidWasteScope3InputSchema } from '@/modules/scope3/15.12-waste/solid-waste-scope3.input';
import { object } from '@/types/schemas';
import z from 'zod';

export const SolidWasteInputSchema = object({
  treatedOnsite: SolidWasteScope1InputSchema.optional().meta({
    description:
      'Solid waste that was disposed of or treated within the activity boundary.',
  }),
  treatedOffsite: SolidWasteScope3InputSchema.optional().meta({
    description:
      'Solid waste that was disposed of or treated outside of the activity boundary.',
  }),
});

export const HasSolidWasteInputSchema = object({
  waste: SolidWasteInputSchema.optional(),
});
export type HasSolidWasteInput = z.input<typeof HasSolidWasteInputSchema>;
export type HasSolidWasteInputTransformed = z.output<
  typeof HasSolidWasteInputSchema
>;
