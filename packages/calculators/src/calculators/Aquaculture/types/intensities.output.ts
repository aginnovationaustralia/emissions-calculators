import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const AquacultureIntensitiesOutputSchema = z.object({
  fishHarvestedKg: outputValue('Fish or crustaceans harvested in kg'),
  emissionsIntensity: outputValue(
    'Aquaculture emissions intensity, in kg-CO2e/kg fish',
  ),
});

export type AquacultureIntensitiesOutput = z.infer<
  typeof AquacultureIntensitiesOutputSchema
>;
