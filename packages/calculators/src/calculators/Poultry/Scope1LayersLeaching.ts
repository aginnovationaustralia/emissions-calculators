import { LayerClass } from '@/types/Poultry/layerclass.input';
import { LayersComplete } from '@/types/Poultry/layers.input';
import { Seasons, State } from '@/types/types';
import { ExecutionContext } from '../executionContext';
import { ConstantsForPoultryCalculator } from './constants';
import { getLayersLeachingMassNLost } from './functions';

export function layerLeaching(
  state: State,
  layer: LayerClass,
  percentRecycled: number,
  recycleFrequency: number,
  allocationOfManure: number,
  fractionWasteThroughDrylot: number,
  type: 'layers' | 'meat_chicken_layers',
  context: ExecutionContext<ConstantsForPoultryCalculator>,
) {
  const { constants } = context;

  // (Nitrous_Oxide_MMS_LayersC94)
  return Seasons.reduce((acc, season) => {
    // (Data_Input_LayersD9)
    const flockNumbers = layer[season];

    // (Data_Input_LayersC61, Nitrous_Oxide_MMS_LayersC99)
    const allocationOfManureWaste = allocationOfManure;

    // (Nitrous_Oxide_MMS_LayersD5)
    const livestockNumbersLayersSpring =
      flockNumbers * (1 - percentRecycled) ** recycleFrequency;

    // (Nitrous_Oxide_MMS_LayersC104, Nitrous_Oxide_MMS_LayersC106, Nitrous_Oxide_MMS_LayersC107)
    const { dryMatterIntake, crudeProtein, nitrogenRetentionRate } =
      constants.POULTRY.DIET_PROPERTIES[type];

    // (Nitrous_Oxide_MMS_LayersD16)
    const nitrogenIntakeFactor = (dryMatterIntake * crudeProtein) / 6.25;

    // (Nitrous_Oxide_MMS_LayersD21)
    const nitrogenExcretion =
      nitrogenIntakeFactor * (1 - nitrogenRetentionRate) * 91.25 * 10 ** -6;

    // (Nitrous_Oxide_MMS_LayersD77)
    const fracWET = allocationOfManureWaste;

    // (Nitrous_Oxide_MMS_LayersF73)
    const fracLeachMS = constants.COMMON.LEACHING.FRACLEACH;

    // Mass of N lost through leaching and runoff
    const massNLostThroughLeachingLayersSeason = getLayersLeachingMassNLost(
      livestockNumbersLayersSpring,
      nitrogenExcretion,
      fractionWasteThroughDrylot,
      fracWET,
      fracLeachMS,
    );

    // (Nitrous_Oxide_MMS_LayersD86)
    const leachingEF = constants.COMMON.LEACHING.N2O_EF;
    // (Nitrous_Oxide_MMS_LayersD87)
    const leachingCG = 1.5714285714285714;

    // (Nitrous_Oxide_MMS_LayersD89)
    const leachingEmissionsLayersSpring =
      massNLostThroughLeachingLayersSeason * leachingEF * leachingCG;

    return acc + leachingEmissionsLayersSpring;
  }, 0);
}

export function calculateScope1LayersLeachingN2O(
  state: State,
  layers: LayersComplete,
  context: ExecutionContext<ConstantsForPoultryCalculator>,
) {
  const leachingTotalLayers = layerLeaching(
    state,
    layers.layers,
    layers.litterRecycled,
    layers.litterRecycleFrequency,
    layers.manureWasteAllocation,
    layers.wasteHandledDrylotOrStorage,
    'layers',
    context,
  );

  const leachingTotalMeatChicken = layerLeaching(
    state,
    layers.meatChickenLayers,
    layers.litterRecycled,
    layers.litterRecycleFrequency,
    layers.manureWasteAllocation,
    layers.wasteHandledDrylotOrStorage,
    'meat_chicken_layers',
    context,
  );

  // (Nitrous_Oxide_MMS_LayersC94)
  const leachingTotal = leachingTotalLayers + leachingTotalMeatChicken;

  // (Nitrous_Oxide_MMS_LayersC95)
  const leachingTotalGg =
    leachingTotal * context.constants.COMMON.GWP_FACTORSC6;

  // (Data_SummaryD10, Nitrous_Oxide_MMS_LayersC96)
  const leachingTonnesN2O = leachingTotalGg * 10 ** 3;

  return leachingTonnesN2O;
}
