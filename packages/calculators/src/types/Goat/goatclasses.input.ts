import { z } from 'zod';
import { GoatClassSchema } from './goatclass.input';

export const GoatClassesSchema = z
  .object({
    bucksBilly: GoatClassSchema.optional().meta({
      description: 'Bucks / Billy',
    }),
    tradeBucks: GoatClassSchema.optional().meta({
      description: 'Trade Bucks / Billy',
    }),
    wethers: GoatClassSchema.optional().meta({ description: 'wethers' }),
    tradeWethers: GoatClassSchema.optional().meta({
      description: 'trade wethers',
    }),
    maidenBreedingDoesNannies: GoatClassSchema.optional().meta({
      description: 'maiden breeding does/nannies',
    }),
    tradeMaidenBreedingDoesNannies: GoatClassSchema.optional().meta({
      description: 'trade maiden breeding does/nannies',
    }),
    breedingDoesNannies: GoatClassSchema.optional().meta({
      description: 'breeding does/nannies',
    }),
    tradeBreedingDoesNannies: GoatClassSchema.optional().meta({
      description: 'trade breeding does/nannies',
    }),
    otherDoesCulledFemales: GoatClassSchema.optional().meta({
      description: 'other does/culled females',
    }),
    tradeOtherDoesCulledFemales: GoatClassSchema.optional().meta({
      description: 'trade other does/culled females',
    }),
    kids: GoatClassSchema.optional().meta({ description: 'kids' }),
    tradeKids: GoatClassSchema.optional().meta({ description: 'trade kids' }),
  })
  .meta({ description: 'Goat classes of different types' });

export type GoatClasses = z.infer<typeof GoatClassesSchema>;
