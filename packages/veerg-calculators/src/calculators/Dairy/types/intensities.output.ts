import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const DairyIntensitiesOutputSchema = z.object({
  liveweightProducedKilograms: outputValue('Liveweight produced in kg'),
  liveweightIntensityExcludingLULUCF: outputValue(
    'Dairy liveweight emissions intensity excluding LULUCF, in kg-CO2e/kg liveweight',
  ),
  liveweightIntensityIncludingLULUCF: outputValue(
    'Dairy liveweight emissions intensity including LULUCF, in kg-CO2e/kg liveweight',
  ),
  milkProducedKilograms: outputValue('Milk produced in kg'),
  fatAndProteinCorrectedMilkProducedKilograms: outputValue(
    'Fat and protein corrected milk (FPCM) produced in kg',
  ),
  milkIntensityExcludingLULUCF: outputValue(
    'Dairy milk emissions intensity excluding LULUCF, in kg-CO2e/kg fat and protein corrected milk (FPCM)',
  ),
  milkIntensityIncludingLULUCF: outputValue(
    'Dairy milk emissions intensity including LULUCF, in kg-CO2e/kg fat and protein corrected milk (FPCM)',
  ),
});

export type DairyIntensitiesOutput = z.infer<
  typeof DairyIntensitiesOutputSchema
>;
