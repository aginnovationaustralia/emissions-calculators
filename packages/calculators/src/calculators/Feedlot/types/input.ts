import { ElectricityInputsSchema } from '@/modules/scope2/14-electricity/electricity.input';
import { singleEnterpriseInput } from '@/types/schemas';
import { z } from 'zod';
import { FeedlotGroupInputSchema } from './feedlot-group.input';

export const FeedlotInputSchema = singleEnterpriseInput('Feedlot', {
  // region: z
  //   .enum(StateOrRegions)
  //   .meta({ description: 'The state or region the enterprise is located in' }),
  // climateZone: z
  //   .enum(ClimateZones)
  //   .meta({ description: 'The climate zone the enterprise is located in' }),
  // rainfallAbove600: z
  //   .boolean()
  //   .meta({ description: 'Is the rainfall above 600mm' }),
  // grazingSystem: z.enum(GrazingProductionSystems).meta({
  //   description: 'The grazing production system the enterprise is using',
  // }),
  groups: z.array(FeedlotGroupInputSchema),
  electricity: ElectricityInputsSchema,
});

export type FeedlotInput = z.input<typeof FeedlotInputSchema>;
export type FeedlotInputTransformed = z.output<typeof FeedlotInputSchema>;
