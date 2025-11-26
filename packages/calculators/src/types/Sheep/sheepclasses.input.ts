import { z } from 'zod';
import { SheepClassSchema } from './sheepclass.input';

export const SheepClassesSchema = z.object({
  rams: SheepClassSchema.optional(),
  tradeRams: SheepClassSchema.optional(),
  wethers: SheepClassSchema.optional(),
  tradeWethers: SheepClassSchema.optional(),
  maidenBreedingEwes: SheepClassSchema.optional(),
  tradeMaidenBreedingEwes: SheepClassSchema.optional(),
  breedingEwes: SheepClassSchema,
  tradeBreedingEwes: SheepClassSchema.optional(),
  otherEwes: SheepClassSchema.optional(),
  tradeOtherEwes: SheepClassSchema.optional(),
  eweLambs: SheepClassSchema,
  tradeEweLambs: SheepClassSchema.optional(),
  wetherLambs: SheepClassSchema,
  tradeWetherLambs: SheepClassSchema.optional(),
});

export type SheepClasses = z.infer<typeof SheepClassesSchema>;
