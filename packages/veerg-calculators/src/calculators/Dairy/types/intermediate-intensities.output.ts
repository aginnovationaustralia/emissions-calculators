import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const DairyIntermediateIntensitiesOutputSchema = z.object({
  liveweightProducedKilograms: outputValue('Liveweight produced in kg'),
  liveweightIntensity: outputValue(
    'Dairy liveweight emissions intensity for this activity, in kg-CO2e/kg liveweight',
  ),
  milkProducedKilograms: outputValue('Milk produced in kg'),
  fatAndProteinCorrectedMilkProducedKilograms: outputValue(
    'Fat and protein corrected milk (FPCM) produced in kg',
  ),
  milkIntensity: outputValue(
    'Dairy milk emissions intensity for this activity, in kg-CO2e/kg fat and protein corrected milk (FPCM)',
  ),
});

export type DairyIntermediateIntensitiesOutput = z.infer<
  typeof DairyIntermediateIntensitiesOutputSchema
>;
