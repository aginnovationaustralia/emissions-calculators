import {
  isProportion,
  numberInput,
  numberInputOptional,
  nv,
} from '@/tools/inputs';
import { INTENSITIES } from '@/tools/modules';
import { mass, realNumber } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const PostProductionIntensitiesSchema = object({
  unitsProduced: numberInput((v) => realNumber(v), {
    name: 'Units produced',
    description: 'The total number of units produced in the year.',
    modules: [INTENSITIES],
  }),
  productionEmissionsKgCO2e: numberInput((v) => mass('CO2e', v), {
    name: 'Production emissions (kg CO2e)',
    description: 'The emissions from production of all units in the year.',
    modules: [INTENSITIES],
  }),
  postProductionAllocation: numberInputOptional(
    (v) => realNumber(v),
    {
      name: 'Post-production allocation',
      description: `What share of the total post-production emissions calculated should be included in the post-production intensity?
      In other words, what share of the fuel, packaging etc. listed in these inputs were related to processing these units?`,
      modules: [INTENSITIES],
    },
    isProportion,
  ).prefault(nv(1)),
});

export type PostProductionIntensitiesInput = z.input<
  typeof PostProductionIntensitiesSchema
>;
export type PostProductionIntensitiesInputTransformed = z.output<
  typeof PostProductionIntensitiesSchema
>;
