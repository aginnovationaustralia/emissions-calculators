import { z } from 'zod';

export const SheepEmissionsIntensitiesSchema = z.object({
  woolProducedKg: z
    .number()
    .meta({ description: 'Greasy wool produced in kg' }),
  sheepMeatProducedKg: z
    .number()
    .meta({ description: 'Sheep meat produced in kg liveweight' }),
  woolIncludingSequestration: z.number().meta({
    description:
      'Wool production including carbon sequestration, in kg-CO2e/kg greasy',
  }),
  woolExcludingSequestration: z.number().meta({
    description:
      'Wool production excluding carbon sequestration, in kg-CO2e/kg greasy',
  }),
  sheepMeatBreedingIncludingSequestration: z.number().meta({
    description:
      'Sheep meat (breeding herd) including carbon sequestration, in kg-CO2e/kg liveweight',
  }),
  sheepMeatBreedingExcludingSequestration: z.number().meta({
    description:
      'Sheep meat (breeding herd) excluding carbon sequestration, in kg-CO2e/kg liveweight',
  }),
});

export type SheepEmissionsIntensities = z.infer<
  typeof SheepEmissionsIntensitiesSchema
>;
