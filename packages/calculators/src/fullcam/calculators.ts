import { GrainsInputSchema } from '@/calculators';
import { BeefInputSchema } from '@/calculators/Beef/types/input';
import { LULUCFInputSchema } from '@/modules';
import { object } from '@/types/schemas';
import { z } from 'zod';
import { LULUCFWithFullCAMInputSchema } from './input';

// NOTE: These types are built to be used on a public API. The 'upgrade' mode can be used to detect when to pass inputs to FullCAM for processing.
// The 'ready' mode means the values are sourced from FullCAM outputs, and it is ready to be run through the calculator.
export const FullCAMOutputsSchema = object({
  fullcamMode: z.literal('ready'),
  areas: z.array(LULUCFInputSchema),
});

export const FullCAMInputsSchema = object({
  fullcamMode: z.literal('upgrade'),
  areas: LULUCFWithFullCAMInputSchema,
});

export type FullCAMOutputs = z.input<typeof FullCAMOutputsSchema>;
export type FullCAMInputs = z.input<typeof FullCAMInputsSchema>;
export type FullCAMInputsTransformed = z.output<typeof FullCAMInputsSchema>;

export const GrainsInputWithFullCAMSchema = GrainsInputSchema.extend({
  landUse: z
    .discriminatedUnion('fullcamMode', [
      FullCAMOutputsSchema,
      FullCAMInputsSchema,
    ])
    .optional(),
});

export const BeefInputWithFullCAMSchema = BeefInputSchema.extend({
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

export type BeefInputWithFullCAM = z.input<typeof BeefInputWithFullCAMSchema>;

export const isLandUseInputReady = (
  input: FullCAMInputs | FullCAMOutputs,
): input is FullCAMInputs => {
  return input.fullcamMode === 'ready';
};

export const isLandUseNeedsFullCAMUpgrade = (
  input: FullCAMInputs | FullCAMOutputs,
): input is FullCAMOutputs => {
  return input.fullcamMode === 'upgrade';
};
