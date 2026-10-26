import z from 'zod';
import {
  FeedlotManureInputSchema,
  FeedlotManureInputTransformed,
} from './4.1-feedlot-manure';
import {
  DairyManureInputSchema,
  DairyManureInputTransformed,
} from './4.3-dairy-manure';
import {
  PigsManureInputSchema,
  PigsManureInputTransformed,
} from './4.5-pigs-manure';
import {
  PoultryManureInputSchema,
  PoultryManureInputTransformed,
} from './4.6-poultry-manure';

export const livestockManureIsPigs = (
  input: LivestockManuresInputTransformed,
): input is PigsManureInputTransformed => {
  return input.type === 'pigs';
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

export const LivestockManuresInputSchema = z
  .discriminatedUnion('type', [
    PigsManureInputSchema,
    DairyManureInputSchema,
    FeedlotManureInputSchema,
    PoultryManureInputSchema,
  ])
  .meta({ id: 'LivestockManuresInput' });

export type LivestockManuresInput = z.input<typeof LivestockManuresInputSchema>;
export type LivestockManuresInputTransformed = z.output<
  typeof LivestockManuresInputSchema
>;
