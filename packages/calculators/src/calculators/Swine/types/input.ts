import { object } from '@/types/schemas';
import { z } from 'zod';
import { SwineHerdInputSchema } from './swine-herd.input';
import {
  MeanAnnualTemperatures,
  PureStates,
  GrazingProductionSystemsWithRainfall,
} from '@/constants/enums';

export const BaseSwineInputSchema = object({
  herds: z.array(SwineHerdInputSchema),
});

export type BaseSwineInput = z.input<typeof BaseSwineInputSchema>;
export type BaseSwineInputTransformed = z.output<typeof BaseSwineInputSchema>;

export const SwineInputSchema = BaseSwineInputSchema.extend({
  isInLeachingZone: z.boolean().meta({
    description:
      'Is the herd located in a leaching zone? (see Chapter 1 section 1.8.2)',
  }),
  temperatureZone: z.literal(MeanAnnualTemperatures).optional().meta({
    description: 'Average annual temperature, if known',
  }),
  state: z.literal(PureStates).meta({
    description: 'State that contains the land the herd occupies',
  }),
  productionSystem: z.enum(GrazingProductionSystemsWithRainfall).meta({
    description:
      'The production system which most accurately describes the land surrounding the housing area.',
  }),
});

export type SwineInput = z.input<typeof SwineInputSchema>;
export type SwineInputTransformed = z.output<typeof SwineInputSchema>;
