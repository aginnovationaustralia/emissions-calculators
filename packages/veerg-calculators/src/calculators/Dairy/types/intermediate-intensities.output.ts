import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const DairyIntermediateIntensitiesOutputSchema = z.object({
  liveweightProducedKilograms: outputValue('Liveweight produced in kg'),
  liveweightIntensityEnergyAllocation: outputValue(
    'Dairy liveweight emissions intensity for this activity, using energy based allocation, in kg-CO2e/kg liveweight',
  ),
  liveweightIntensityMassAllocation: outputValue(
    'Dairy liveweight emissions intensity for this activity, using mass based allocation, in kg-CO2e/kg liveweight',
  ),
  milkProducedKilograms: outputValue('Milk produced in kg'),
  milkIntensityEnergyAllocation: outputValue(
    'Dairy milk emissions intensity for this activity, using energy based allocation, in kg-CO2e/kg milk (fat and protein corrected)',
  ),
  milkIntensityMassAllocation: outputValue(
    'Dairy milk emissions intensity for this activity, using mass based allocation, in kg-CO2e/kg milk (fat and protein corrected)',
  ),
});

export type DairyIntermediateIntensitiesOutput = z.infer<
  typeof DairyIntermediateIntensitiesOutputSchema
>;
