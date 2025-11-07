import { ExecutionContext } from '../executionContext';
import { LayerClass } from '../types/Poultry/layerclass.input';
import { LayersComplete } from '../types/Poultry/layers.input';
import { Seasons } from '../types/types';
import { ConstantsForPoultryCalculator } from './constants';
import {
  getLayerProductionSystemEF,
  layersTotalIndirectNO2,
} from './functions';

// SHEET: Nitrous Oxide_MMS - Layers
// Nitrous oxide emissions from Free range MMS - Layers

// // Data Inputs
// // // Livestock numbers (N)
// // Direct nitrous oxide emissions
// // // Nitrogen intake (NI): NI = I x CP /6.25
// // // ----- I = dry matter intake (kg/day)
// // // ----- CP = dietary crude protein
// // // ----- 6.25 = factor for converting crude protein into nitrogen
// // // Nitrogen excretion (NE): NE = NI * (1 - NR) x 91.25  x 10^-6
// // // ----- NI = Nitrogen intake
// // // ----- NR = nitrogen retention as proportion of intake
// // Indirect nitrous oxide emissions
// // // Mass of poultry waste volatilised  (Matmos): (Matmos) = (N x NE x iFracGASM)
// // // ----- N = Livestock numbers
// // // ----- NE = mass of nitrogen excreted (Gg/head/season)
// // // ----- iFracGASM = integrated fraction of N volatilised fro the meat and layer industries
// // // Annual atmospheric deposition (E): E = MNatmos x EF x C
// // // ----- MNatmos = Mass of poultry waste volatilised
// // // ----- EF: Emissions factor for layer chickens
// // // ----- Cg:

// SHEET: Agricultural Soils - Layers

function nitrogen(
  layer: LayerClass,
  percentLitterRecycled: number,
  recycleFrequency: number,
  type: 'layers' | 'meat_chicken_layers',
  context: ExecutionContext<ConstantsForPoultryCalculator>,
) {
  const { constants } = context;

  return Seasons.reduce(
    (acc, season) => {
      //
      //
      // START Livestock numbers (N)
      const flockNumber = layer[season];
      // Livestock number uses values from data inputs
      // Flock number
      // Percent of litter recycled
      // Frequency of litter recycling
      const livestockNumber =
        flockNumber * (1 - percentLitterRecycled) ** recycleFrequency;
      // END Livestock numbers (N)
      //
      //

      //
      //
      // START Nitrogen intake (NI)
      // NI = I x CP /6.25
      // I = dry matter intake (kg/day): is a constant value
      // CP = dietary crude protein: constant value
      const { dryMatterIntake, crudeProtein } =
        constants.POULTRY.DIET_PROPERTIES[type];

      const nitrogenIntake = (dryMatterIntake * crudeProtein) / 6.25;
      // END Nitrogen intake (NI)
      //
      //

      //
      //
      // START Nitrogen excretion (NE)
      // NE = NI * (1 - NR) x 91.25  x 10^-6
      // NI = Nitrogen intake
      // NR = nitrogen retention as proportion of intake: is a constant value
      const { nitrogenRetentionRate } = constants.POULTRY.DIET_PROPERTIES[type];

      const nitrogenExcretion =
        nitrogenIntake * (1 - nitrogenRetentionRate) * 91.25 * 10 ** -6;
      // END Nitrogen excretion (NE)
      //
      //

      //
      //
      // START PART 1 Mass of poultry waste volatilised  (Matmos)
      // (Matmos) = (N x NE x iFracGASM)
      // N = Livestock numbers
      // NE = mass of nitrogen excreted (Gg/head/season)
      // iFracGASM = integrated fraction of N volatilised fro the meat and layer industries
      const { iFracGASM } = constants.POULTRY.MEATLAYER_EF.layer_chickens; // 0.315956 Jul 16 2024

      const massWasteVolatised =
        livestockNumber * nitrogenExcretion * iFracGASM;
      // END PART 1 Mass of poultry waste volatilised  (Matmos)
      //
      //

      //
      // START Total seasonal faecal (NE) nitrogen excreted
      // NE = Livestock Numbers * Nitrogen excretion
      const faecalNitrogenExcreted = livestockNumber * nitrogenExcretion;
      // END Total seasonal faecal (NE) nitrogen excreted
      //

      return {
        nitrogenExcreted: acc.nitrogenExcreted + faecalNitrogenExcreted,
        massWasteVolatised: acc.massWasteVolatised + massWasteVolatised,
      };
    },
    { nitrogenExcreted: 0, massWasteVolatised: 0 },
  );
}

export function calculateScope1LayersAtmospheric(
  layers: LayersComplete,
  context: ExecutionContext<ConstantsForPoultryCalculator>,
) {
  const nitrogenLayers = nitrogen(
    layers.layers,
    layers.litterRecycled,
    layers.litterRecycleFrequency,
    'layers',
    context,
  );

  const nitrogenMeatChicken = nitrogen(
    layers.meatChickenLayers,
    layers.litterRecycled,
    layers.litterRecycleFrequency,
    'meat_chicken_layers',
    context,
  );

  const { constants } = context;

  //
  //
  // START PART 2 Mass of poultry waste volatilised  (Matmos)
  const massWasteVolatisedLayerAndMeat =
    nitrogenLayers.massWasteVolatised + nitrogenMeatChicken.massWasteVolatised;
  // END PART 2 Mass of poultry waste volatilised  (Matmos)
  //
  //

  //
  //
  // START Indirect nitrous oxide emissions Annual atmospheric deposition (E)
  // E = MNatmos x EF x C
  // MNatmos = Mass of poultry waste volatilised
  // EF: Emissions factor for layer chickens
  // Cg:
  const totalIndirectNO2 = layersTotalIndirectNO2(
    massWasteVolatisedLayerAndMeat,
    context,
  );

  const totalIndirectNO2Gg = totalIndirectNO2 * constants.COMMON.GWP_FACTORSC6;
  const totalIndirectNO2Tonnes = totalIndirectNO2Gg * 10 ** 3;
  // END Indirect nitrous oxide emissions Annual atmospheric deposition (E)
  //
  //
  // END Indirect nitrous oxide emissions
  //

  //
  //
  // START Mass of N volatilised from animal waste deposited on or applied to soils (M)
  // M = (MNSoil + UNSoil + FNSoil) x FracGASM
  const massNVolatisedAnnual =
    (nitrogenLayers.nitrogenExcreted + nitrogenMeatChicken.nitrogenExcreted) *
    constants.LIVESTOCK.FRAC_GASM;
  // END
  //
  //

  //
  // START N dung and urine - Nitrous oxide production
  const productionSystemEF = getLayerProductionSystemEF(context);

  const totalAtmosphericN2O =
    massNVolatisedAnnual * productionSystemEF * constants.COMMON.GWP_FACTORSC15;
  // END N dung and urine - Nitrous oxide production
  //

  //
  // START Total N2O Emissions from Atmospheric Deposition
  const totalAtmosphericN2OGg =
    totalAtmosphericN2O * constants.COMMON.GWP_FACTORSC6;
  const totalAtmosphericN2OTonnes = totalAtmosphericN2OGg * 10 ** 3;
  // END Total N2O Emissions from Atmospheric Deposition
  //

  //
  //
  const scope1LayerAtmosphericDeposition =
    totalAtmosphericN2OTonnes + totalIndirectNO2Tonnes;

  return scope1LayerAtmosphericDeposition;
}
