import { z } from 'zod';

export const SheepBeefEmissionsIntensitiesSchema = z.object({
  beefIncludingSequestration: z.number().meta({
    description:
      'Beef including carbon sequestration, in kg-CO2e/kg liveweight',
  }),
  beefExcludingSequestration: z.number().meta({
    description:
      'Beef excluding carbon sequestration, in kg-CO2e/kg liveweight',
  }),
  liveweightBeefProducedKg: z
    .number()
    .meta({ description: 'Liveweight produced in kg' }),
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
  woolProducedKg: z
    .number()
    .meta({ description: 'Greasy wool produced in kg' }),
  sheepMeatProducedKg: z
    .number()
    .meta({ description: 'Sheep meat produced in kg liveweight' }),
});

export type SheepBeefEmissionsIntensities = z.infer<
  typeof SheepBeefEmissionsIntensitiesSchema
>;
