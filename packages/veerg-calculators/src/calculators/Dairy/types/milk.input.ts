import { dairyEntericAndManureModules } from '@/modules/scope1/shared/dairy/modules';
import {
  isPercentage,
  NonEmptyArray,
  numberInput,
  numberInputOptional,
} from '@/tools/inputs';
import {
  ENTERIC_DAIRY_3_3,
  INTENSITIES,
  LivestockLocation,
  livestockOrFertiliserModules,
  MANURE_DAIRY_4_3,
  ModuleNames,
} from '@/tools/modules';
import {
  massPerHeadPerDay,
  realNumber,
  volumePerHeadPerDay,
} from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

/**
 * Method 2 fat *FCj* and protein *PCj* content of the milk. Both milk inputs take them:
 * they give the fat and protein corrected milk for the intensities, and for milk solids
 * also the conversion to litres (3.3.1.1 (5)).
 */
const method2MilkContentInputs = (modules: NonEmptyArray<ModuleNames>) =>
  object({
    method2PercentFatContent: numberInputOptional(
      (val) => realNumber(val),
      {
        name: 'FCj',
        method: '2',
        description: 'Fat content in fat and protein corrected milk',
        modules,
      },
      isPercentage,
    ),
    method2PercentProteinContent: numberInputOptional(
      (val) => realNumber(val),
      {
        name: 'PCj',
        method: '2',
        description: 'Protein content in fat and protein corrected milk',
        modules,
      },
      isPercentage,
    ),
  });

export const dairyMilkVolumeInputSchema = (location: LivestockLocation) =>
  method2MilkContentInputs(
    livestockOrFertiliserModules(location, [INTENSITIES]),
  ).safeExtend({
    litresPerHeadPerDay: numberInput(
      (val) => volumePerHeadPerDay('Milk', val),
      {
        name: 'MPj',
        method: '1',
        description: 'Volume of milk produced for this class',
        modules: livestockOrFertiliserModules(location, [
          ENTERIC_DAIRY_3_3,
          INTENSITIES,
          MANURE_DAIRY_4_3,
        ]),
      },
      (s) => s.gt(0),
    ),
  });

export const dairyMilkSolidsInputSchema = (location: LivestockLocation) =>
  method2MilkContentInputs(
    livestockOrFertiliserModules(location, [
      ENTERIC_DAIRY_3_3,
      INTENSITIES,
      MANURE_DAIRY_4_3,
    ]),
  ).safeExtend({
    solidsKilogramsPerHeadPerDay: numberInput(
      (val) => massPerHeadPerDay('Milk Solids', val),
      {
        name: 'MSj',
        method: '1',
        description: 'Mass of milk solids produced for this class',
        modules: dairyEntericAndManureModules(location),
      },
      (s) => s.gt(0),
    ),
  });

export type DairyMilkVolumeInputTransformed = z.output<
  ReturnType<typeof dairyMilkVolumeInputSchema>
>;
export type DairyMilkSolidsInputTransformed = z.output<
  ReturnType<typeof dairyMilkSolidsInputSchema>
>;

export const dairyMilkProductionInputSchema = (location: LivestockLocation) =>
  z.union([
    dairyMilkVolumeInputSchema(location),
    dairyMilkSolidsInputSchema(location),
  ]);

export type DairyMilkProductionInput = z.input<
  ReturnType<typeof dairyMilkProductionInputSchema>
>;
export type DairyMilkProductionInputTransformed = z.output<
  ReturnType<typeof dairyMilkProductionInputSchema>
>;

export const isMilkVolumeBased = (
  input: DairyMilkProductionInputTransformed,
): input is DairyMilkVolumeInputTransformed => {
  return 'litresPerHeadPerDay' in input;
};
