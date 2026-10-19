import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const WildCatchFisheriesIntensitiesOutputSchema = z.object({
  fishHarvestedKg: outputValue('Fish or crustaceans harvested in kg'),
  emissionsIntensity: outputValue(
    'Fish emissions intensity, in kg-CO2e/kg fish',
  ),
});

export type WildCatchFisheriesIntensitiesOutput = z.infer<
  typeof WildCatchFisheriesIntensitiesOutputSchema
>;
