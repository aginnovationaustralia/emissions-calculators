import { outputValue } from '@/tools/zod';
import { z } from 'zod';

type DairyAllocationMethod = 'mass' | 'energy';

const DairyAllocatedIntensitiesOutputSchema = (
  allocation: DairyAllocationMethod,
) =>
  z.object({
    liveweightIntensityExcludingLULUCF: outputValue(
      `Dairy liveweight emissions intensity using ${allocation} based allocation excluding LULUCF, in kg-CO2e/kg liveweight`,
    ),
    liveweightIntensityIncludingLULUCF: outputValue(
      `Dairy liveweight emissions intensity using ${allocation} based allocation including LULUCF, in kg-CO2e/kg liveweight`,
    ),

    milkIntensityExcludingLULUCF: outputValue(
      `Dairy milk emissions intensity using ${allocation} based allocation excluding LULUCF, in kg-CO2e/kg fat and protein corrected milk (FPCM)`,
    ),
    milkIntensityIncludingLULUCF: outputValue(
      `Dairy milk emissions intensity using ${allocation} based allocation including LULUCF, in kg-CO2e/kg fat and protein corrected milk (FPCM)`,
    ),
  });

export type DairyAllocatedIntensitiesOutput = z.infer<
  ReturnType<typeof DairyAllocatedIntensitiesOutputSchema>
>;

export const DairyIntensitiesOutputSchema = z.object({
  liveweightProducedKilograms: outputValue('Liveweight produced in kg'),
  milkProducedKilograms: outputValue('Milk produced in kg'),
  fatAndProteinCorrectedMilkProducedKilograms: outputValue(
    'Fat and protein corrected milk (FPCM) produced in kg',
  ),

  energyIntensities: DairyAllocatedIntensitiesOutputSchema('energy').meta({
    description:
      'Separate milk and liveweight intensities, with allocations based on energy. This follows the International Dairy Federation method, and is the primary allocation used for dairy intensities.',
  }),

  massIntensities: DairyAllocatedIntensitiesOutputSchema('mass').meta({
    description:
      'Separate milk and liveweight intensities, with allocations based on mass. A kg of fat and protein corrected milk and a kg of liveweight are treated as the same amount of product.',
  }),
});

export type DairyIntensitiesOutput = z.infer<
  typeof DairyIntensitiesOutputSchema
>;
