import { object } from '@/types/schemas';
import { z } from 'zod';
import {
  isSeasonInputWithLambing,
  SheepClassSeasonInputSchema,
  SheepClassWithLambingSeasonInputSchema,
} from './sheep-class-season.input';

export const SheepClassInputSchema = object({
  spring: SheepClassSeasonInputSchema,
  summer: SheepClassSeasonInputSchema,
  autumn: SheepClassSeasonInputSchema,
  winter: SheepClassSeasonInputSchema,
});

export const SheepClassWithLambingInputSchema = object({
  spring: SheepClassWithLambingSeasonInputSchema,
  summer: SheepClassWithLambingSeasonInputSchema,
  autumn: SheepClassWithLambingSeasonInputSchema,
  winter: SheepClassWithLambingSeasonInputSchema,
});

export const isSheepClassWithLambing = (
  cls: SheepClassInputTransformed | SheepClassMaidenBreedingInputTransformed,
): cls is SheepClassMaidenBreedingInputTransformed => {
  return 'spring' in cls && isSeasonInputWithLambing(cls.spring);
};

export type SheepClassInput = z.input<typeof SheepClassInputSchema>;
export type SheepClassInputTransformed = z.output<typeof SheepClassInputSchema>;

export type SheepClassWithLambingInput = z.input<
  typeof SheepClassWithLambingInputSchema
>;
export type SheepClassMaidenBreedingInputTransformed = z.output<
  typeof SheepClassWithLambingInputSchema
>;
