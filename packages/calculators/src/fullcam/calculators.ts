import { GrainsInputSchema } from '@/calculators';
import { LULUCFInputSchema } from '@/modules';
import { object } from '@/types/schemas';
import { z } from 'zod';
import { LULUCFWithFullCAMInputSchema } from './input';

export const FullCAMOutputsSchema = object({
  fullcamMode: z.literal('outputs'),
  areas: z.array(LULUCFInputSchema),
});

export const FullCAMInputsSchema = object({
  fullcamMode: z.literal('inputs'),
  areas: LULUCFWithFullCAMInputSchema,
});

export type FullCAMOutputs = z.input<typeof FullCAMOutputsSchema>;
export type FullCAMInputs = z.input<typeof FullCAMInputsSchema>;

export const GrainsInputWithFullCAMSchema = GrainsInputSchema.extend({
  landUse: z
    .discriminatedUnion('fullcamMode', [
      FullCAMOutputsSchema,
      FullCAMInputsSchema,
    ])
    .optional(),
});

export type GrainsInputWithFullCAM = z.input<
  typeof GrainsInputWithFullCAMSchema
>;

export const isLandUseFullCAMInputs = (
  input: FullCAMInputs | FullCAMOutputs,
): input is FullCAMInputs => {
  return input.fullcamMode === 'inputs';
};

export const isLandUseFullCAMOutputs = (
  input: FullCAMInputs | FullCAMOutputs,
): input is FullCAMOutputs => {
  return input.fullcamMode === 'outputs';
};
