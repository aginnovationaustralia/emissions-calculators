import { object } from '@/types/schemas';
import { z } from 'zod';
import { SwineHerdInputSchema } from './swine-herd.input';
import {
  MeanAnnualTemperatures,
  PureStates,
  ClimateZoneTypes,
  GrazingProductionSystemsWithRainfall,
} from '@/constants/enums';

export const SwineInputSchema = object({
  temperatureZone: z.literal(MeanAnnualTemperatures).optional().meta({
    description: 'Average annual temperature, if known',
  }),
  state: z.literal(PureStates).meta({
    description: 'State that contains the land the herd occupies',
  }),
  // REVISIT: The description in section 4.6 says: Select the value based on the production system which most accurately describes the land surrounding the housing area. "productionSystem" might not be the most appropriate name for this input.
  productionSystem: z.enum(GrazingProductionSystemsWithRainfall).meta({
    description:
      'The production system which most accurately describes the land surrounding the housing area.',
  }),
  isInLeachingZone: z.boolean().meta({
    description:
      'Is the herd located in a leaching zone? (see Chapter 1 section 1.8.2)',
  }),
  herds: z.array(SwineHerdInputSchema),
});

// const SwineInputSchema = BaseSwineInputSchema.extend({});

export type SwineInput = z.input<typeof SwineInputSchema>;
export type SwineInputTransformed = z.output<typeof SwineInputSchema>;
