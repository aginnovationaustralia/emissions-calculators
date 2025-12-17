import { LayerClass } from '@/types/Poultry/layerclass.input';
import { LayersComplete } from '@/types/Poultry/layers.input';
import { PoultryClass, Seasons, State } from '@/types/enums';
import { ExecutionContext } from '../executionContext';
import { ConstantsForPoultryCalculator } from './constants';

function layerManure(
  state: State,
  layer: LayerClass,
  percentLitterRecycled: number,
  recyclesPerYear: number,
  type: PoultryClass,
  context: ExecutionContext<ConstantsForPoultryCalculator>,
) {
  const { constants } = context;

  return Seasons.reduce(
    (acc, season) => {
      const flockNumber = layer[season];

      const livestockNumber =
        flockNumber * (1 - percentLitterRecycled) ** recyclesPerYear;

      const {
        dryMatterIntake,
        dryMatterDigestibility,
        manureAsh,
        crudeProtein,
        nitrogenRetentionRate,
      } = constants.POULTRY.DIET_PROPERTIES[type];

      const volatileSolidProductionLayers =
        dryMatterIntake * (1 - dryMatterDigestibility) * (1 - manureAsh);

      const iMCF = constants.POULTRY.MEATLAYER_EF_IMCF.layer_chickens[state];

      // TODO: Needs extraction to a constant
      const EP_LAYERS = 0.39;

      const MMS = constants.POULTRY.WASTE_MMS[state];

      const densityOfMethane = constants.LIVESTOCK.METHANE_DENSITY;

      const mmsLayers =
        volatileSolidProductionLayers *
        iMCF *
        EP_LAYERS *
        MMS *
        densityOfMethane;

      const methaneProduction = 91.25 * livestockNumber * mmsLayers * 10 ** -6;

      const NI_FACTOR = (dryMatterIntake * crudeProtein) / 6.25;

      const NE_FACTOR =
        NI_FACTOR * (1 - nitrogenRetentionRate) * 91.25 * 10 ** -6;

      const { iNOF } = constants.POULTRY.MEATLAYER_EF.layer_chickens;

      const totalN2OLayers =
        livestockNumber * NE_FACTOR * iNOF * constants.COMMON.GWP_FACTORSC15;

      return {
        CH4: acc.CH4 + methaneProduction,
        N2O: acc.N2O + totalN2OLayers,
      };
    },
    { CH4: 0, N2O: 0 },
  );
}

export function calculateScope1LayersManure(
  state: State,
  layers: LayersComplete,
  context: ExecutionContext<ConstantsForPoultryCalculator>,
) {
  const methaneProductionLayers = layerManure(
    state,
    layers.layers,
    layers.litterRecycled,
    layers.litterRecycleFrequency,
    'layers',
    context,
  );

  const methaneProductionMeatChicken = layerManure(
    state,
    layers.meatChickenLayers,
    layers.litterRecycled,
    layers.litterRecycleFrequency,
    'meat_chicken_layers',
    context,
  );

  const { constants } = context;

  const methaneProductionTotal =
    methaneProductionLayers.CH4 + methaneProductionMeatChicken.CH4;

  const methaneProductionGg =
    methaneProductionTotal * constants.COMMON.GWP_FACTORSC5;

  const methaneTonnesCH4 = methaneProductionGg * 1000;

  const totalN2O =
    methaneProductionLayers.N2O + methaneProductionMeatChicken.N2O;

  const totalN2OGg = totalN2O * constants.COMMON.GWP_FACTORSC6;

  const methaneTonnesN2O = totalN2OGg * 1000;

  return { N2O: methaneTonnesN2O, CH4: methaneTonnesCH4 };
}
