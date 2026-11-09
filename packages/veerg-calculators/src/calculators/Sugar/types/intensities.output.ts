import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const SugarIntensitiesOutputSchema = z.object({
  sugarCaneHarvestedKilograms: outputValue('Sugarcane harvested in kg'),
  sugarCaneExcludingLULUCF: outputValue(
    'Sugar emissions intensity excluding LULUCF, in kg-CO2e/kg sugarcane',
  ),
  sugarCaneIncludingLULUCF: outputValue(
    'Sugar emissions intensity including LULUCF, in kg-CO2e/kg sugarcane',
  ),
});

export type SugarIntensitiesOutput = z.infer<
  typeof SugarIntensitiesOutputSchema
>;
