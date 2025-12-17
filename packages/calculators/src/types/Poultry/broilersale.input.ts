import { z } from 'zod';
import { object } from '../schemas';
import { PoultrySaleSchema } from './sale.input';

export const BroilerSaleSchema = object({
    meatChickenGrowersSales: PoultrySaleSchema,
    meatChickenLayers: PoultrySaleSchema,
    meatOther: PoultrySaleSchema,
  })
  .meta({ description: 'Poultry broiler sales' });

export type BroilerSale = z.infer<typeof BroilerSaleSchema>;
