import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const SheepIntensitiesOutputSchema = z.object({
  liveweightProducedKilograms: outputValue('Liveweight produced in kg'),
  liveweightIntensityExcludingLULUCF: outputValue(
    'Sheep liveweight emissions intensity excluding LULUCF, in kg-CO2e/kg liveweight',
  ),
  liveweightIntensityIncludingLULUCF: outputValue(
    'Sheep liveweight emissions intensity including LULUCF, in kg-CO2e/kg liveweight',
  ),
  woolProducedKilograms: outputValue('Greasy wool produced in kg'),
  woolIntensityExcludingLULUCF: outputValue(
    'Sheep wool emissions intensity excluding LULUCF, in kg-CO2e/kg greasy wool',
  ),
  woolIntensityIncludingLULUCF: outputValue(
    'Sheep wool emissions intensity including LULUCF, in kg-CO2e/kg greasy wool',
  ),
});

export type SheepIntensitiesOutput = z.infer<
  typeof SheepIntensitiesOutputSchema
>;
