import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { States } from '../types';
import { BroilersCompleteSchema } from './broilers.input';
import { LayersCompleteSchema } from './layers.input';
import { PoultryVegetationSchema } from './vegetation.input';

export const PoultryInputSchema = z
  .object({
    state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
    northOfTropicOfCapricorn: z
      .boolean()
      .meta({ description: DESCRIPTIONS.NORTHOFTROPIC }),
    rainfallAbove600: z
      .boolean()
      .meta({ description: DESCRIPTIONS.RAINFALLABOVE600 }),
    broilers: z.array(BroilersCompleteSchema),
    layers: z.array(LayersCompleteSchema),
    vegetation: z.array(PoultryVegetationSchema),
  })
  .meta({ description: 'Input data required for the `poultry` calculator' });

export type PoultryInput = z.infer<typeof PoultryInputSchema>;
