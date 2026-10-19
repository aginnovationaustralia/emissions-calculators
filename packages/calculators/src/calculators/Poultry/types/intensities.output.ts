import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const PoultryIntensitiesOutputSchema = z.object({
  liveweightProducedKg: outputValue('Liveweight produced in kg'),
  liveweightIntensityExcludingLULUCF: outputValue(
    'Poultry liveweight emissions intensity excluding LULUCF, in kg-CO2e/kg liveweight',
  ),
  liveweightIntensityIncludingLULUCF: outputValue(
    'Poultry liveweight emissions intensity including LULUCF, in kg-CO2e/kg liveweight',
  ),
  eggsProducedKg: outputValue('Eggs produced in kg'),
  eggsIntensityExcludingLULUCF: outputValue(
    'Poultry egg emissions intensity excluding LULUCF, in kg-CO2e/kg eggs',
  ),
  eggsIntensityIncludingLULUCF: outputValue(
    'Poultry egg emissions intensity including LULUCF, in kg-CO2e/kg eggs',
  ),
});

export type PoultryIntensitiesOutput = z.infer<
  typeof PoultryIntensitiesOutputSchema
>;
