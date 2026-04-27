import { IBRA7Regions } from '@/constants/enums';
import { input } from '@/tools/inputs';
import {
  hectaresToSquareMetres,
  tonnesPerHectareToKgPerSquareMetres,
} from '@/tools/unit-conversion';
import { area, massPerArea } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const LandUseChangeActivityBaseInputSchema = object({
  activityArea: z
    .number()
    .min(0)
    .meta({ description: 'Area of the activity' })
    .transform((val) =>
      input('ActivityArea', area(hectaresToSquareMetres(val))),
    ),
});

const LandUseLandClearingBaseInputSchema =
  LandUseChangeActivityBaseInputSchema.extend({
    region: z.enum(IBRA7Regions).meta({
      description: 'IBRA7 region of the activity area',
    }),
    carbonMassInTreesCurrentYear: z
      .number()
      .min(0)
      .meta({
        description:
          'Carbon mass per hectare in trees in current year. Derived from FullCAM output.',
      })
      .transform((val) =>
        input(
          'Ctijy',
          massPerArea('Carbon', tonnesPerHectareToKgPerSquareMetres(val)),
        ),
      ),
    carbonMassInTreesPreviousYear: z
      .number()
      .min(0)
      .meta({
        description:
          'Carbon mass per hectare in trees in previous year. Derived from FullCAM output.',
      })
      .transform((val) =>
        input(
          'Ctijy-1',
          massPerArea('Carbon', tonnesPerHectareToKgPerSquareMetres(val)),
        ),
      ),
    carbonMassInDebrisCurrentYear: z
      .number()
      .min(0)
      .meta({
        description:
          'Carbon mass per hectare in debris in current year. Derived from FullCAM output.',
      })
      .transform((val) =>
        input(
          'Cdijy',
          massPerArea('Carbon', tonnesPerHectareToKgPerSquareMetres(val)),
        ),
      ),
    carbonMassInDebrisPreviousYear: z
      .number()
      .min(0)
      .meta({
        description:
          'Carbon mass per hectare in debris in previous year. Derived from FullCAM output.',
      })
      .transform((val) =>
        input(
          'Cdijy-1',
          massPerArea('Carbon', tonnesPerHectareToKgPerSquareMetres(val)),
        ),
      ),
    massCH4FromBiomassBurningPerHectare: z
      .number()
      .min(0)
      .meta({
        description:
          'Mass CH4 per hectare from biomass burning. Derived from FullCAM output.',
      })
      .transform((val) =>
        input(
          'Eg=ch4,i,j,y',
          massPerArea('CH4', tonnesPerHectareToKgPerSquareMetres(val)),
        ),
      ),
    massN2OFromBiomassBurningPerHectare: z
      .number()
      .min(0)
      .meta({
        description:
          'Mass N2O per hectare from biomass burning. Derived from FullCAM output.',
      })
      .transform((val) =>
        input(
          'Eg=n2o,i,j,y',
          massPerArea('N2O', tonnesPerHectareToKgPerSquareMetres(val)),
        ),
      ),

    areaBurnt: z
      .number()
      .min(0)
      .meta({
        description: 'Area burnt. Derived from FullCAM output.',
      })
      .transform((val) => input('ag,i,j,y', area(hectaresToSquareMetres(val)))),
  });

const ForestryActivityBaseInputSchema =
  LandUseChangeActivityBaseInputSchema.extend({
    carbonMassOfWoodProductsHarvestedPerHectare: z
      .number()
      .min(0)
      .meta({
        description:
          'Carbon mass of wood products harvested per hectare. Derived from FullCAM output.',
      })
      .transform((val) =>
        input(
          'Cp,i,j,y',
          massPerArea('Carbon', tonnesPerHectareToKgPerSquareMetres(val)),
        ),
      ),
  });

/*
1 = Land clearing (forest to cropland)
2 = Land clearing (forest to grassland)
3 = Land clearing (forest to settlements)
4 = Revegetation by planting
5 = Human-induced national regeneration
6 = Farm forestry
7 = Plantation forestry
*/

const LandClearingForestToCroplandInputSchema =
  LandUseLandClearingBaseInputSchema.extend({
    type: z.literal('landClearingForestToCropland'),
  }).transform((val) => ({
    ...val,
    number: 1 as const,
  }));

const LandClearingForestToGrasslandInputSchema =
  LandUseLandClearingBaseInputSchema.extend({
    type: z.literal('landClearingForestToGrassland'),
  }).transform((val) => ({
    ...val,
    number: 2 as const,
  }));

const LandClearingForestToSettlementsInputSchema =
  LandUseLandClearingBaseInputSchema.extend({
    type: z.literal('landClearingForestToSettlements'),
  }).transform((val) => ({
    ...val,
    number: 3 as const,
  }));

const RevegetationByPlantingInputSchema =
  LandUseChangeActivityBaseInputSchema.extend({
    type: z.literal('revegetationByPlanting'),
  }).transform((val) => ({
    ...val,
    number: 4 as const,
  }));

const HumanInducedNaturalRegenerationInputSchema =
  LandUseChangeActivityBaseInputSchema.extend({
    type: z.literal('humanInducedNaturalRegeneration'),
  }).transform((val) => ({
    ...val,
    number: 5 as const,
  }));

const FarmForestryInputSchema = ForestryActivityBaseInputSchema.extend({
  type: z.literal('farmForestry'),
}).transform((val) => ({
  ...val,
  number: 6 as const,
}));

const PlantationForestryInputSchema = ForestryActivityBaseInputSchema.extend({
  type: z.literal('plantationForestry'),
}).transform((val) => ({
  ...val,
  number: 7 as const,
}));

export const LandUseChangeActivityInputSchema = z.discriminatedUnion('type', [
  LandClearingForestToCroplandInputSchema,
  LandClearingForestToGrasslandInputSchema,
  LandClearingForestToSettlementsInputSchema,
  RevegetationByPlantingInputSchema,
  HumanInducedNaturalRegenerationInputSchema,
  FarmForestryInputSchema,
  PlantationForestryInputSchema,
]);

export type LandClearingForestToCroplandInputTransformed = z.output<
  typeof LandClearingForestToCroplandInputSchema
>;
export type LandClearingForestToGrasslandInputTransformed = z.output<
  typeof LandClearingForestToGrasslandInputSchema
>;
export type LandClearingForestToSettlementsInputTransformed = z.output<
  typeof LandClearingForestToSettlementsInputSchema
>;
export type RevegetationByPlantingInputTransformed = z.output<
  typeof RevegetationByPlantingInputSchema
>;
export type HumanInducedNationalRegenerationInputTransformed = z.output<
  typeof HumanInducedNaturalRegenerationInputSchema
>;
export type FarmForestryInputTransformed = z.output<
  typeof FarmForestryInputSchema
>;
export type PlantationForestryInputTransformed = z.output<
  typeof PlantationForestryInputSchema
>;

export const isLandClearingForestToCropland = (
  activity: LandUseChangeActivityInputTransformed,
): activity is LandClearingForestToCroplandInputTransformed => {
  return activity.type === 'landClearingForestToCropland';
};

export const isLandClearingToGrasslandOrSettlements = (
  activity: LandUseChangeActivityInputTransformed,
): activity is
  | LandClearingForestToGrasslandInputTransformed
  | LandClearingForestToSettlementsInputTransformed => {
  return (
    activity.type === 'landClearingForestToGrassland' ||
    activity.type === 'landClearingForestToSettlements'
  );
};

export const isLandClearingActivity = (
  activity: LandUseChangeActivityInputTransformed,
): activity is
  | LandClearingForestToCroplandInputTransformed
  | LandClearingForestToGrasslandInputTransformed
  | LandClearingForestToSettlementsInputTransformed => {
  return (
    isLandClearingForestToCropland(activity) ||
    isLandClearingToGrasslandOrSettlements(activity)
  );
};

export const isForestryActivity = (
  activity: LandUseChangeActivityInputTransformed,
): activity is
  | FarmForestryInputTransformed
  | PlantationForestryInputTransformed => {
  return (
    activity.type === 'farmForestry' || activity.type === 'plantationForestry'
  );
};

export type LandUseChangeActivityInput = z.input<
  typeof LandUseChangeActivityInputSchema
>;
export type LandUseChangeActivityInputTransformed = z.output<
  typeof LandUseChangeActivityInputSchema
>;
