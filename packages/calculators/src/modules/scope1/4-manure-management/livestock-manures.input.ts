import { z } from 'zod';
import {
  FeedlotManureInputSchema,
  FeedlotManureInputTransformed,
} from './feedlot-manure.input';
import { SwineManureInputSchema } from './swine-manure.input';

export const livestockManureIsSwine = (
  input: LivestockManuresInputTransformed,
): input is SwineManureInputTransformed => {
  return input.type === 'swine';
};

export const livestockManureIsFeedlot = (
  input: LivestockManuresInputTransformed,
): input is FeedlotManureInputTransformed => {
  return input.type === 'feedlot';
};

export type SwineManureInput = z.input<typeof SwineManureInputSchema>;
export type SwineManureInputTransformed = z.output<
  typeof SwineManureInputSchema
>;

export const LivestockManuresInputSchema = z.union([
  SwineManureInputSchema,
  FeedlotManureInputSchema,
]); // TODO: Need to support other types of local organic fertiliser (beef etc)

export type LivestockManuresInput = z.input<typeof LivestockManuresInputSchema>;
export type LivestockManuresInputTransformed = z.output<
  typeof LivestockManuresInputSchema
>;
