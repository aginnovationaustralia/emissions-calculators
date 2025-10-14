import { z } from 'zod';
import { DeerClassSchema } from './deerclass.input';

export const DeerClassesSchema = z
  .object({
    bucks: DeerClassSchema.optional().meta({ description: 'Bucks' }),
    tradeBucks: DeerClassSchema.optional().meta({ description: 'Trade bucks' }),
    breedingDoes: DeerClassSchema.optional().meta({
      description: 'Breeding does',
    }),
    tradeDoes: DeerClassSchema.optional().meta({ description: 'Trade does' }),
    otherDoes: DeerClassSchema.optional().meta({ description: 'Other does' }),
    tradeOtherDoes: DeerClassSchema.optional().meta({
      description: 'Trade other does',
    }),
    fawn: DeerClassSchema.optional().meta({ description: 'Fawns' }),
    tradeFawn: DeerClassSchema.optional().meta({ description: 'Trade fawns' }),
  })
  .meta({ description: 'Deer classes of different types' });

export type DeerClasses = z.infer<typeof DeerClassesSchema>;
