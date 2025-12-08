import { LayerClass } from '@/types/Poultry/layerclass.input';
import { LayersComplete } from '@/types/Poultry/layers.input';
import { Seasons, State } from '@/types/enums';
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

  return Seasons.reduce((acc, season) => {
    const flockNumbers = layer[season];

    const allocationOfManureWaste = allocationOfManure;

    const livestockNumbersLayersSpring =
      flockNumbers * (1 - percentRecycled) ** recycleFrequency;

    const { dryMatterIntake, crudeProtein, nitrogenRetentionRate } =
      constants.POULTRY.DIET_PROPERTIES[type];

    const nitrogenIntakeFactor = (dryMatterIntake * crudeProtein) / 6.25;

    const nitrogenExcretion =
      nitrogenIntakeFactor * (1 - nitrogenRetentionRate) * 91.25 * 10 ** -6;

    const fracWET = allocationOfManureWaste;

    const fracLeachMS = constants.COMMON.LEACHING.FRACLEACH;

    // Mass of N lost through leaching and runoff
    const massNLostThroughLeachingLayersSeason = getLayersLeachingMassNLost(
      livestockNumbersLayersSpring,
      nitrogenExcretion,
      fractionWasteThroughDrylot,
      fracWET,
      fracLeachMS,
    );

    const leachingEF = constants.COMMON.LEACHING.N2O_EF;
    const leachingCG = 1.5714285714285714;

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

  const leachingTotal = leachingTotalLayers + leachingTotalMeatChicken;

  const leachingTotalGg =
    leachingTotal * context.constants.COMMON.GWP_FACTORSC6;

  const leachingTonnesN2O = leachingTotalGg * 10 ** 3;

  return leachingTonnesN2O;
}
