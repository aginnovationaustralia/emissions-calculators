import { z } from 'zod';
import { BuffaloClassSchema } from './buffaloclass.input';

export const BuffaloClassesSchema = z
  .object({
    bulls: BuffaloClassSchema.optional().meta({ description: 'Bulls' }),
    tradeBulls: BuffaloClassSchema.optional().meta({
      description: 'Trade bulls',
    }),
    cows: BuffaloClassSchema.optional().meta({ description: 'Cows' }),
    tradeCows: BuffaloClassSchema.optional().meta({
      description: 'Trade cows',
    }),
    steers: BuffaloClassSchema.optional().meta({ description: 'Steers' }),
    tradeSteers: BuffaloClassSchema.optional().meta({
      description: 'Trade steers',
    }),
    calfs: BuffaloClassSchema.optional().meta({ description: 'Calfs' }),
    tradeCalfs: BuffaloClassSchema.optional().meta({
      description: 'Trade calfs',
    }),
  })
  .meta({ description: 'Buffalo classes of different types' });

export type BuffaloClasses = z.infer<typeof BuffaloClassesSchema>;
