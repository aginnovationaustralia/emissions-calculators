import { z } from 'zod';
import {
  DairyManureInputSchema,
  DairyManureInputTransformed,
} from './dairy-manure.input';
import {
  FeedlotManureInputSchema,
  FeedlotManureInputTransformed,
} from './feedlot-manure.input';
import {
  PoultryManureInputSchema,
  PoultryManureInputTransformed,
} from './4.6-poultry-manure';
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

export const livestockManureIsDairy = (
  input: LivestockManuresInputTransformed,
): input is DairyManureInputTransformed => {
  return input.type === 'dairy';
};

export const livestockManureIsPoultry = (
  input: LivestockManuresInputTransformed,
): input is PoultryManureInputTransformed => {
  return input.type === 'poultry';
};

export type SwineManureInput = z.input<typeof SwineManureInputSchema>;
export type SwineManureInputTransformed = z.output<
  typeof SwineManureInputSchema
>;

export const LivestockManuresInputSchema = z.discriminatedUnion('type', [
  SwineManureInputSchema,
  DairyManureInputSchema,
  FeedlotManureInputSchema,
  PoultryManureInputSchema,
]);

export type LivestockManuresInput = z.input<typeof LivestockManuresInputSchema>;
export type LivestockManuresInputTransformed = z.output<
  typeof LivestockManuresInputSchema
>;
