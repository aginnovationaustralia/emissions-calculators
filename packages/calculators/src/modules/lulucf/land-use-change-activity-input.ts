import {
  CropOnlyProductionSystems,
  IBRA7Regions,
  PastureOnlyProductionSystems,
} from '@/constants/enums';
import { enumInput, numberInput, literalInput } from '@/tools/inputs';
import {
  hectaresToSquareMetres,
  tonnesPerHectareToKgPerSquareMetres,
} from '@/tools/unit-conversion';
import { area, massPerArea } from '@/tools/units';
import { object } from '@/types/schemas';

import { hasIsInLeachingZoneInputSchema } from '@/calculators/types/has-is-in-leaching.input';
import {
  LAND_USE_16_2,
  N_LEACHING_16_4,
  N_SOIL_LOSS_16_3,
} from '@/tools/modules';
import { z } from 'zod';

export const LandUseChangeActivityBaseInputSchema = object({
  activityAreaHectares: numberInput(
    (val) => area(hectaresToSquareMetres(val)),
    {
      name: 'ActivityArea',
      description: 'Area of the activity',
      modules: [LAND_USE_16_2, N_SOIL_LOSS_16_3, N_LEACHING_16_4],
    },
    (s) => s.min(0.2), // chapter 16.1.2.5 "An activity area must be a minimum of 0.2 hectares"
  ),
  carbonMassInTreesCurrentYear: numberInput(
    (val) => massPerArea('Carbon', tonnesPerHectareToKgPerSquareMetres(val)),
    {
      name: 'Ctijy',
      description:
        'Carbon mass in trees in current year. Derived from FullCAM output.',
      method: '2',
      modules: [LAND_USE_16_2],
    },
    (s) => s.min(0),
  ),
  carbonMassInTreesPreviousYear: numberInput(
    (val) => massPerArea('Carbon', tonnesPerHectareToKgPerSquareMetres(val)),
    {
      name: 'Ctijy-1',
      description:
        'Carbon mass in trees in previous year. Derived from FullCAM output.',
      method: '2',
      modules: [LAND_USE_16_2],
    },
    (s) => s.min(0),
  ),
  carbonMassInDebrisCurrentYear: numberInput(
    (val) => massPerArea('Carbon', tonnesPerHectareToKgPerSquareMetres(val)),
    {
      name: 'Cdijy',
      description:
        'Carbon mass in debris in current year. Derived from FullCAM output.',
      method: '2',
      modules: [LAND_USE_16_2],
    },
    (s) => s.min(0),
  ),
  carbonMassInDebrisPreviousYear: numberInput(
    (val) => massPerArea('Carbon', tonnesPerHectareToKgPerSquareMetres(val)),
    {
      name: 'Cdijy-1',
      description:
        'Carbon mass in debris in previous year. Derived from FullCAM output.',
      method: '2',
      modules: [LAND_USE_16_2],
    },
    (s) => s.min(0),
  ),
});

const LandUseLandClearingBaseInputSchema =
  LandUseChangeActivityBaseInputSchema.extend({
    ...hasIsInLeachingZoneInputSchema(N_LEACHING_16_4).shape,
    region: enumInput(IBRA7Regions, {
      name: 'IBRA7 activity region',
      description: 'IBRA7 region of the activity area',
      modules: [LAND_USE_16_2, N_SOIL_LOSS_16_3, N_LEACHING_16_4],
    }),

    massCH4FromBiomassBurningPerHectare: numberInput(
      (val) => massPerArea('CH4', tonnesPerHectareToKgPerSquareMetres(val)),
      {
        name: 'Eg=ch4,i,j,y',
        description:
          'Mass CH4 from biomass burning. Derived from FullCAM output.',
        method: '2',
        modules: [LAND_USE_16_2],
      },
      (s) => s.min(0),
    ),
    massN2OFromBiomassBurningPerHectare: numberInput(
      (val) => massPerArea('N2O', tonnesPerHectareToKgPerSquareMetres(val)),
      {
        name: 'Eg=n2o,i,j,y',
        description:
          'Mass N2O from biomass burning. Derived from FullCAM output.',
        method: '2',
        modules: [LAND_USE_16_2],
      },
      (s) => s.min(0),
    ),

    areaBurnt: numberInput(
      (val) => area(hectaresToSquareMetres(val)),
      {
        name: 'ag,i,j,y',
        description: 'Area burnt. Derived from FullCAM output.',
        modules: [LAND_USE_16_2],
      },
      (s) => s.min(0),
    ),
  });

const carbonMassOfWoodProductsFromFullCAMSchema = z
  .object({
    carbonMassPerHectareFromFullCAM: numberInput(
      (val) => massPerArea('Carbon', tonnesPerHectareToKgPerSquareMetres(val)),
      {
        name: 'Cp,i,j,y',
        description:
          'Carbon mass of wood products harvested. Derived from a FullCAM simulation, using default simulation parameters.',
        modules: [LAND_USE_16_2],
      },
      (s) => s.min(0),
    ),
    calculationMethod: z.literal('1'),
  })
  .meta({ title: 'From FullCAM simulation' });

const carbonMassOfWoodProductsFromRecordsSchema = z
  .object({
    carbonMassPerHectareFromRecords: numberInput(
      (val) => massPerArea('Carbon', tonnesPerHectareToKgPerSquareMetres(val)),
      {
        name: 'Cp,i,j,y',
        description:
          'Carbon mass of wood products harvested. Derived from FullCAM output, where FullCAM simulation parameters are populated from detailed records or site specific research.',
        method: '2',
        modules: [LAND_USE_16_2],
      },
      (s) => s.min(0),
    ),
    calculationMethod: z.literal('2'),
  })
  .meta({ title: 'From farm records' });

export type CarbonMassOfWoodProductsFromFullCAMInput = z.input<
  typeof carbonMassOfWoodProductsFromFullCAMSchema
>;
export type CarbonMassOfWoodProductsFromRecordsInput = z.input<
  typeof carbonMassOfWoodProductsFromRecordsSchema
>;

type CarbonMassOfWoodProductsFromFullCAMInputTransformed = z.output<
  typeof carbonMassOfWoodProductsFromFullCAMSchema
>;
type CarbonMassOfWoodProductsFromRecordsInputTransformed = z.output<
  typeof carbonMassOfWoodProductsFromRecordsSchema
>;

const ForestryActivityBaseInputSchema =
  LandUseChangeActivityBaseInputSchema.safeExtend({
    carbonMassOfWoodProducts: z.discriminatedUnion('calculationMethod', [
      carbonMassOfWoodProductsFromFullCAMSchema,
      carbonMassOfWoodProductsFromRecordsSchema,
    ]),
  });

export const isCarbonMassOfWoodProductsFromFullCAM = (
  input:
    | CarbonMassOfWoodProductsFromFullCAMInputTransformed
    | CarbonMassOfWoodProductsFromRecordsInputTransformed,
): input is CarbonMassOfWoodProductsFromFullCAMInputTransformed => {
  return input.calculationMethod === '1';
};

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
    cropProductionSystem: enumInput(CropOnlyProductionSystems, {
      name: 'Crop production',
      description: 'Crop production',
      modules: [N_SOIL_LOSS_16_3],
    }),
  })
    .transform((val) => ({
      ...val,
      number: 1 as const,
    }))
    .meta({ title: 'Land clearing (forest to cropland)' });

const LandClearingForestToGrasslandInputSchema =
  LandUseLandClearingBaseInputSchema.extend({
    type: z.literal('landClearingForestToGrassland'),
    pastureProductionSystem: enumInput(PastureOnlyProductionSystems, {
      name: 'Pasture production',
      description: 'Pasture production',
      modules: [N_SOIL_LOSS_16_3],
    }),
  })
    .transform((val) => ({
      ...val,
      number: 2 as const,
    }))
    .meta({ title: 'Land clearing (forest to grassland)' });

const LandClearingForestToSettlementsInputSchema =
  LandUseLandClearingBaseInputSchema.extend({
    type: z.literal('landClearingForestToSettlements'),
    pastureProductionSystem: literalInput('Non-irrigated pasture', {
      name: 'Pasture production',
      description: 'Pasture production',
      modules: [N_SOIL_LOSS_16_3],
    }),
  })
    .transform((val) => ({
      ...val,
      number: 3 as const,
    }))
    .meta({ title: 'Land clearing (forest to settlements)' });

const RevegetationByPlantingInputSchema =
  LandUseChangeActivityBaseInputSchema.extend({
    type: z.literal('revegetationByPlanting'),
  })
    .transform((val) => ({
      ...val,
      number: 4 as const,
    }))
    .meta({ title: 'Revegetation by planting' });

const HumanInducedNaturalRegenerationInputSchema =
  LandUseChangeActivityBaseInputSchema.extend({
    type: z.literal('humanInducedNaturalRegeneration'),
  })
    .transform((val) => ({
      ...val,
      number: 5 as const,
    }))
    .meta({ title: 'Human-induced natural regeneration' });

const FarmForestryInputSchema = ForestryActivityBaseInputSchema.extend({
  type: z.literal('farmForestry'),
})
  .transform((val) => ({
    ...val,
    number: 6 as const,
  }))
  .meta({ title: 'Farm forestry' });

const PlantationForestryInputSchema = ForestryActivityBaseInputSchema.extend({
  type: z.literal('plantationForestry'),
})
  .transform((val) => ({
    ...val,
    number: 7 as const,
  }))
  .meta({ title: 'Plantation forestry' });

export const LandUseChangeActivityInputSchema = z.discriminatedUnion('type', [
  LandClearingForestToCroplandInputSchema,
  LandClearingForestToGrasslandInputSchema,
  LandClearingForestToSettlementsInputSchema,
  RevegetationByPlantingInputSchema,
  HumanInducedNaturalRegenerationInputSchema,
  FarmForestryInputSchema,
  PlantationForestryInputSchema,
]);

export type LandClearingForestToCroplandInput = z.input<
  typeof LandClearingForestToCroplandInputSchema
>;
export type LandClearingForestToCroplandInputTransformed = z.output<
  typeof LandClearingForestToCroplandInputSchema
>;
export type LandClearingForestToGrasslandInput = z.input<
  typeof LandClearingForestToGrasslandInputSchema
>;
export type LandClearingForestToGrasslandInputTransformed = z.output<
  typeof LandClearingForestToGrasslandInputSchema
>;
export type LandClearingForestToSettlementsInput = z.input<
  typeof LandClearingForestToSettlementsInputSchema
>;
export type LandClearingForestToSettlementsInputTransformed = z.output<
  typeof LandClearingForestToSettlementsInputSchema
>;
export type RevegetationByPlantingInput = z.input<
  typeof RevegetationByPlantingInputSchema
>;
export type RevegetationByPlantingInputTransformed = z.output<
  typeof RevegetationByPlantingInputSchema
>;
export type HumanInducedNationalRegenerationInput = z.input<
  typeof HumanInducedNaturalRegenerationInputSchema
>;
export type HumanInducedNationalRegenerationInputTransformed = z.output<
  typeof HumanInducedNaturalRegenerationInputSchema
>;
export type FarmForestryInput = z.input<typeof FarmForestryInputSchema>;
export type FarmForestryInputTransformed = z.output<
  typeof FarmForestryInputSchema
>;
export type PlantationForestryInput = z.input<
  typeof PlantationForestryInputSchema
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
  FarmForestryInputTransformed | PlantationForestryInputTransformed => {
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
