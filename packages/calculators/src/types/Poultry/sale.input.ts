import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { object } from '../schemas';

export const PoultrySaleSchema = object({
  head: z.number().min(0).meta({ description: DESCRIPTIONS.HEADSOLD }),
  saleWeight: z.number().min(0).meta({ description: DESCRIPTIONS.SALEWEIGHT }),
});

export type PoultrySale = z.infer<typeof PoultrySaleSchema>;
