import { dairyEntericAndManureModules } from '@/modules/scope1/shared/dairy/modules';
import { isPercentage, numberInput, numberInputOptional } from '@/tools/inputs';
import {
  ENTERIC_DAIRY_3_3,
  INTENSITIES,
  LivestockLocation,
  livestockOrFertiliserModules,
  MANURE_DAIRY_4_3,
} from '@/tools/modules';
import {
  massPerHeadPerDay,
  realNumber,
  volumePerHeadPerDay,
} from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const dairyMilkVolumeInputSchema = (location: LivestockLocation) =>
  object({
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
  object({
    kgSolidsPerHeadPerDay: numberInput(
      (val) => massPerHeadPerDay('Milk Solids', val),
      {
        name: 'MSj',
        method: '1',
        description: 'Mass of milk solids produced for this class',
        modules: dairyEntericAndManureModules(location),
      },
      (s) => s.gt(0),
    ),
    fatContent: numberInputOptional(
      (val) => realNumber(val),
      {
        name: 'FCj',
        method: '2',
        description: 'Fat content in fat and protein corrected milk',
        modules: dairyEntericAndManureModules(location),
      },
      isPercentage,
    ),
    proteinContent: numberInputOptional(
      (val) => realNumber(val),
      {
        name: 'PCj',
        method: '2',
        description: 'Protein content in fat and protein corrected milk',
        modules: dairyEntericAndManureModules(location),
      },
      isPercentage,
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
