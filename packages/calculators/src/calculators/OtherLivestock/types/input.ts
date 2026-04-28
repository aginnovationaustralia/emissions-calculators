import {
  ClimateZones,
  GrazingProductionSystemsWithRainfall,
  MeanAnnualTemperatures,
  PureStates,
} from '@/constants/enums';
import { singleEnterpriseInput } from '@/types/schemas';
import { z } from 'zod';
import { OtherLivestockHerdInputSchema } from './herd.input';

export const OtherLivestockInputSchema = singleEnterpriseInput(
  'OtherLivestock',
  {
    herds: z.array(OtherLivestockHerdInputSchema),
    state: z.enum(PureStates),
    method2MeanAnnualTemperature: z
      .enum(MeanAnnualTemperatures)
      .optional()
      .meta({
        description: `What is the mean annual temperature of the herd's location?`,
      }),
    climateZone: z.enum(ClimateZones).meta({
      description:
        'What is the climate zone of the herd? (see Chapter 1 section 1.8.2)',
    }),
    productionSystem: z.enum(GrazingProductionSystemsWithRainfall).meta({
      description:
        'What is the production system used for the primary grazing area of the herd?',
    }),
    isInLeachingZone: z.boolean().meta({
      description:
        'Is the herd located in a leaching zone? (see Chapter 1 section 1.8.2)',
    }),
  },
);

export type OtherLivestockInput = z.input<typeof OtherLivestockInputSchema>;
export type OtherLivestockInputTransformed = z.output<
  typeof OtherLivestockInputSchema
>;
