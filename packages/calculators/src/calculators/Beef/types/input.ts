import { ClimateZones, StateOrRegions } from '@/constants/enums';
import { ElectricityInputsSchema } from '@/modules/scope2/14-electricity/electricity.input';
import { singleEnterpriseInput } from '@/types/schemas';
import { z } from 'zod';
import { BeefHerdInputSchema } from './beef-herd.input';

export const BeefInputSchema = singleEnterpriseInput('Beef', {
  region: z
    .enum(StateOrRegions)
    .meta({ description: 'The state or region the enterprise is located in' }),
  climateZone: z
    .enum(ClimateZones)
    .meta({ description: 'The climate zone the enterprise is located in' }),
  herds: z.array(BeefHerdInputSchema),
  electricity: ElectricityInputsSchema,
});

export type BeefInput = z.input<typeof BeefInputSchema>;
export type BeefInputTransformed = z.output<typeof BeefInputSchema>;
