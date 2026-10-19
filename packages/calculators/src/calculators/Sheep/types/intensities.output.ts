import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const SheepIntensitiesOutputSchema = z.object({
  liveweightProducedKg: outputValue('Liveweight produced in kg'),
  liveweightIntensityExcludingLULUCF: outputValue(
    'Sheep liveweight emissions intensity excluding LULUCF, in kg-CO2e/kg liveweight',
  ),
  liveweightIntensityIncludingLULUCF: outputValue(
    'Sheep liveweight emissions intensity including LULUCF, in kg-CO2e/kg liveweight',
  ),
  woolProducedKg: outputValue('Clean wool produced in kg'),
  woolIntensityExcludingLULUCF: outputValue(
    'Sheep wool emissions intensity excluding LULUCF, in kg-CO2e/kg clean wool',
  ),
  woolIntensityIncludingLULUCF: outputValue(
    'Sheep wool emissions intensity including LULUCF, in kg-CO2e/kg clean wool',
  ),
});

export type SheepIntensitiesOutput = z.infer<
  typeof SheepIntensitiesOutputSchema
>;
