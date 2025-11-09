import { z } from 'zod';
import { PorkClassSchema } from './porkclass.input';

export const PorkClassesSchema = z
  .object({
    sows: PorkClassSchema.optional().meta({ description: 'Sows' }),
    boars: PorkClassSchema.optional().meta({ description: 'Boars' }),
    gilts: PorkClassSchema.optional().meta({ description: 'Gilts' }),
    suckers: PorkClassSchema.optional().meta({ description: 'Suckers' }),
    weaners: PorkClassSchema.optional().meta({ description: 'Weaners' }),
    growers: PorkClassSchema.optional().meta({ description: 'Growers' }),
    slaughterPigs: PorkClassSchema.optional().meta({
      description: 'Slaughter Pigs',
    }),
  })
  .meta({ description: 'Pork classes of different types' });

export type PorkClasses = z.infer<typeof PorkClassesSchema>;
