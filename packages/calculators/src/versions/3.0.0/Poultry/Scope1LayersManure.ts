import { ExecutionContext } from '../executionContext';
import { LayerClass } from '../types/Poultry/layerclass.input';
import { LayersComplete } from '../types/Poultry/layers.input';
import { PoultryClass, Seasons, State } from '../types/types';
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
      // (Data_Input_LayersD9)
      const flockNumber = layer[season];

      // (Manure_Management_LayersD5, Nitrous_Oxide_MMS_LayersD5)
      const livestockNumber =
        flockNumber * (1 - percentLitterRecycled) ** recyclesPerYear;

      // (Manure_Management_LayersC57, Manure_Management_LayersC58, Manure_Management_LayersC61)
      // (Nitrous_Oxide_MMS_LayersC104 = DMI, 106 = CP, Nitrous_Oxide_MMS_LayersC107 = NRI)
      const {
        dryMatterIntake,
        dryMatterDigestibility,
        manureAsh,
        crudeProtein,
        nitrogenRetentionRate,
      } = constants.POULTRY.DIET_PROPERTIES[type];

      // (Manure_Management_LayersD20)
      const volatileSolidProductionLayers =
        dryMatterIntake * (1 - dryMatterDigestibility) * (1 - manureAsh);

      // (Manure_Management_LayersC70)
      const iMCF = constants.POULTRY.MEATLAYER_EF_IMCF.layer_chickens[state];

      // TODO: Needs extraction to a constant
      // (Manure_Management_LayersD24)
      const EP_LAYERS = 0.39;

      // (Manure_Management_LayersB34)
      const MMS = constants.POULTRY.WASTE_MMS[state];

      // (Manure_Management_LayersD26)
      const densityOfMethane = constants.LIVESTOCK.METHANE_DENSITY;

      // (Manure_Management_LayersD32)
      const mmsLayers =
        volatileSolidProductionLayers *
        iMCF *
        EP_LAYERS *
        MMS *
        densityOfMethane;

      // (Manure_Management_LayersD43)
      const methaneProduction = 91.25 * livestockNumber * mmsLayers * 10 ** -6;

      // (Nitrous_Oxide_MMS_LayersD16)
      const NI_FACTOR = (dryMatterIntake * crudeProtein) / 6.25;

      // (Nitrous_Oxide_MMS_LayersD21)
      const NE_FACTOR =
        NI_FACTOR * (1 - nitrogenRetentionRate) * 91.25 * 10 ** -6;

      // (Nitrous_Oxide_MMS_LayersI130)
      const { iNOF } = constants.POULTRY.MEATLAYER_EF.layer_chickens;

      // (Nitrous_Oxide_MMS_LayersD31)
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

  // (Manure_Management_LayersC48)
  const methaneProductionTotal =
    methaneProductionLayers.CH4 + methaneProductionMeatChicken.CH4;

  // (Manure_Management_LayersC49)
  const methaneProductionGg =
    methaneProductionTotal * constants.COMMON.GWP_FACTORSC5;

  // (Data_SummaryD7, Manure_Management_LayersC50)
  const methaneTonnesCH4 = methaneProductionGg * 1000;

  // (Nitrous_Oxide_MMS_LayersC37)
  const totalN2O =
    methaneProductionLayers.N2O + methaneProductionMeatChicken.N2O;

  // (Nitrous_Oxide_MMS_LayersC38)
  const totalN2OGg = totalN2O * constants.COMMON.GWP_FACTORSC6;

  // (Data_SummaryD8, Nitrous_Oxide_MMS_LayersC39)
  const methaneTonnesN2O = totalN2OGg * 1000;

  return { N2O: methaneTonnesN2O, CH4: methaneTonnesCH4 };
}
