import {
  ClimateZones,
  GrazingProductionSystemsWithRainfall,
} from '@/constants/enums';
import { LULUCFParentInputSchema } from '@/modules/lulucf/input';
import { ElectricityInputsSchema } from '@/modules/scope2/14-electricity/electricity.input';
import { z } from 'zod';

export const LivestockInputSchema = LULUCFParentInputSchema.extend({
  climateZone: z
    .enum(ClimateZones)
    .meta({ description: 'The climate zone the enterprise is located in' }),
  electricity: ElectricityInputsSchema,
  productionSystem: z.enum(GrazingProductionSystemsWithRainfall).meta({
    description:
      'What is the production system used for the primary grazing area of the herd?',
  }),
});

export type LivestockInput = z.input<typeof LivestockInputSchema>;
export type LivestockInputTransformed = z.output<typeof LivestockInputSchema>;
