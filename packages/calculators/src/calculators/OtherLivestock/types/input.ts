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
    method2MeanAnnualTemperature: z.enum(MeanAnnualTemperatures).optional(),
    climateZone: z.enum(ClimateZones),
    productionSystem: z.enum(GrazingProductionSystemsWithRainfall),
    isInLeachingZone: z.boolean(),
  },
);

export type OtherLivestockInput = z.input<typeof OtherLivestockInputSchema>;
export type OtherLivestockInputTransformed = z.output<
  typeof OtherLivestockInputSchema
>;
