import { ClimateZoneOrZoneTypes } from '@/constants/enums';
import { climateZoneOrZoneTypeToClimateZoneType } from '@/constants/translations';
import { enumInput } from '@/tools/inputs';
import {
  ClimateZoneModules,
  FERT_ORGANIC_5_2,
  RESIDUE_CROPS_6_1,
  RESIDUE_PASTURE_6_2,
} from '@/tools/modules';
import { object } from '@/types/schemas';
import { z } from 'zod';

/**
 * `'crops'` is the activity-level climate zone read by organic fertiliser (5.2) and crop
 * and pasture residue (6.1, 6.2). Livestock pass their chapter 4 manure module.
 */
export const hasClimateZoneInputSchema = (
  module: ClimateZoneModules | 'crops',
) =>
  object({
    climateZone: enumInput(ClimateZoneOrZoneTypes, {
      name: 'Activity climate zone',
      description: `The climate zone the activity is located in (like "Tropical dry") or the basic zone type ("dry" or "wet"). See Chapter 1 section 1.8.2 for more details.`,
      modules:
        module === 'crops'
          ? [FERT_ORGANIC_5_2, RESIDUE_CROPS_6_1, RESIDUE_PASTURE_6_2]
          : [module],
    }).transform((val) => climateZoneOrZoneTypeToClimateZoneType(val)),
  });
export type HasClimateZoneInput = z.input<
  ReturnType<typeof hasClimateZoneInputSchema>
>;
export type HasClimateZoneInputTransformed = z.output<
  ReturnType<typeof hasClimateZoneInputSchema>
>;

export const HasClimateZoneInputSchemaForCrops =
  hasClimateZoneInputSchema('crops');
