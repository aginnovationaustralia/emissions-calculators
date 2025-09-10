import { ExecutionContext } from '../executionContext';
import { BroilerGroup } from '../types/Poultry/group.input';
import { PoultryClass, State } from '../types/types';
import { getBroilerTotalBirdNumbers } from './functions';

function calculateMethaneProduction(
  type: Exclude<PoultryClass, 'layers'>,
  birdNumbers: number,
  averageLengthOfStay50: number,
  averageLengthOfStay100: number,
  state: State,
  context: ExecutionContext,
  dryMatter?: number,
  dryMatterDigest?: number,
  manureAsh?: number,
  crudeProtein?: number,
  nitrogenRetention?: number,
  percentLitterRecycled?: number,
  recyclesPerYear?: number,
) {
  const { constants } = context;
  // (Manure_Management_BroilersD84)
  // 84 = dry matter intake, 85 = DMD, 86 = crude protein
  // 87 = nitrogen retention rate, 88 = manure ash
  const {
    dryMatterIntake,
    crudeProtein: crudeProteinConstant,
    nitrogenRetentionRate,
    manureAsh: manureAshConstant,
    dryMatterDigestibility,
  } = constants.POULTRY_DIET_PROPERTIES[type];

  // (Manure_Management_BroilersD25, Data_Input_BroilersC23)
  const dryMatterInput = dryMatter ?? dryMatterIntake;

  const percentLitterRecycledInput = percentLitterRecycled ?? 0;
  const recyclesPerYearInput = recyclesPerYear ?? 0;

  // (Manure_Management_BroilersD5)
  const totalBirdNumbers = getBroilerTotalBirdNumbers(
    birdNumbers,
    percentLitterRecycledInput,
    recyclesPerYearInput,
  );

  // (Manure_Management_BroilersD10)
  const lengthOf50PStay = averageLengthOfStay50;

  // (Manure_Management_BroilersD30)
  const dryMatterDigestibilityInput = dryMatterDigest ?? dryMatterDigestibility;

  // (Manure_Management_BroilersD35)
  const manureAshInput = manureAsh ?? manureAshConstant;

  const crudeProteinInput = crudeProtein ?? crudeProteinConstant;
  const nitrogenRetentionRateInput = nitrogenRetention ?? nitrogenRetentionRate;

  // (Manure_Management_BroilersD51)
  const volatileSolidProduction =
    totalBirdNumbers === 0
      ? 0
      : dryMatterInput *
        (1 - dryMatterDigestibilityInput) *
        (1 - manureAshInput);

  // (Manure_Management_BroilersD58)
  const meatChickensEP = 0.36;

  // integrated methane conversion factor (Manure_Management_BroilersD59)
  const ICMF = constants.POULTRY_MEATLAYER_EF_IMCF.meat_chickens[state];

  // (Manure_Management_BroilersD60)
  const densityOfMethane = constants.METHANE_DENSITY;

  // (Manure_Management_BroilersD61)
  const methaneProductionFromManure =
    volatileSolidProduction * meatChickensEP * ICMF * densityOfMethane;

  // (Manure_Management_BroilersB11)
  const percent50 = 0.5;

  // (Manure_Management_BroilersD15)
  const birdNumbersAfter50P = totalBirdNumbers * percent50;

  // (Data_Input_BroilersC19)
  const averageLengthOfStay50DepletionRate = averageLengthOfStay50;
  // (Data_Input_BroilersC21)
  const averageLengthOfStay100DepletionRate = averageLengthOfStay100;

  // (Manure_Management_BroilersD20)
  const averageLengthOfStay100R =
    averageLengthOfStay100DepletionRate - averageLengthOfStay50DepletionRate;

  // (Manure_Management_BroilersD72)
  const methaneProduction =
    (totalBirdNumbers === 0
      ? 0
      : lengthOf50PStay *
        totalBirdNumbers *
        methaneProductionFromManure *
        10 ** -6) +
    (birdNumbersAfter50P === 0
      ? 0
      : averageLengthOfStay100R *
        birdNumbersAfter50P *
        methaneProductionFromManure) *
      10 ** -6;

  // N2O

  // (Nitrous_Oxide_MMS_BroilersD48)
  const nitrogenIntake =
    totalBirdNumbers === 0 ? 0 : (dryMatterInput * crudeProteinInput) / 6.25;

  // Gg/head/day (Nitrous_Oxide_MMS_BroilersD58)
  const daysTo50PDepletion =
    totalBirdNumbers === 0
      ? 0
      : nitrogenIntake *
        (1 - nitrogenRetentionRateInput) *
        lengthOf50PStay *
        10 ** -6;

  // (Nitrous_Oxide_MMS_BroilersI178)
  const { iNOF } = constants.POULTRY_MEATLAYER_EF.meat_chickens;

  // (Nitrous_Oxide_MMS_BroilersD63)
  const daysTo100PDepletion =
    birdNumbersAfter50P === 0
      ? 0
      : nitrogenIntake *
        (1 - nitrogenRetentionRateInput) *
        averageLengthOfStay100R *
        10 ** -6;
  // (Nitrous_Oxide_MMS_BroilersD76)
  const totalN2OEmissions =
    totalBirdNumbers * daysTo50PDepletion * iNOF * constants.GWP_FACTORSC15 +
    birdNumbersAfter50P * daysTo100PDepletion * iNOF * constants.GWP_FACTORSC15;

  return { CH4: methaneProduction, N2O: totalN2OEmissions };
}

export function calculateScope1BroilersManure(
  groups: BroilerGroup[],
  state: State,
  context: ExecutionContext,
  litterRecycled: number,
  litterRecycleFrequency: number,
) {
  // (Manure_Management_BroilersC77)
  const totalMethane = groups.reduce(
    (acc, group) => {
      const meatChickenGrowers = calculateMethaneProduction(
        'meat_chicken_growers',
        group.meatChickenGrowers.birds,
        group.meatChickenGrowers.averageStayLength50,
        group.meatChickenGrowers.averageStayLength100,
        state,
        context,
        group.meatChickenGrowers.dryMatterIntake,
        group.meatChickenGrowers.dryMatterDigestibility,
        group.meatChickenGrowers.manureAsh,
        group.meatChickenGrowers.crudeProtein,
        group.meatChickenGrowers.nitrogenRetentionRate,
        litterRecycled,
        litterRecycleFrequency,
      );

      const meatChickenBreeders = calculateMethaneProduction(
        'meat_chicken_layers',
        group.meatChickenLayers.birds,
        group.meatChickenLayers.averageStayLength50,
        group.meatChickenLayers.averageStayLength100,
        state,
        context,
        group.meatChickenLayers.dryMatterIntake,
        group.meatChickenLayers.dryMatterDigestibility,
        group.meatChickenLayers.manureAsh,
        group.meatChickenLayers.crudeProtein,
        group.meatChickenLayers.nitrogenRetentionRate,
        litterRecycled,
        litterRecycleFrequency,
      );

      const meatOther = calculateMethaneProduction(
        'meat_other',
        group.meatOther.birds,
        group.meatOther.averageStayLength50,
        group.meatOther.averageStayLength100,
        state,
        context,
        group.meatOther.dryMatterIntake,
        group.meatOther.dryMatterDigestibility,
        group.meatOther.manureAsh,
        group.meatOther.crudeProtein,
        group.meatOther.nitrogenRetentionRate,
        litterRecycled,
        litterRecycleFrequency,
      );

      return {
        methaneN2O:
          acc.methaneN2O +
          meatChickenGrowers.N2O +
          meatChickenBreeders.N2O +
          meatOther.N2O,
        methaneCH4:
          acc.methaneCH4 +
          meatChickenGrowers.CH4 +
          meatChickenBreeders.CH4 +
          meatOther.CH4,
      };
    },
    { methaneN2O: 0, methaneCH4: 0 },
  );

  const { constants } = context;

  // (Manure_Management_BroilersC78)
  const totalMethaneGg = totalMethane.methaneCH4 * constants.GWP_FACTORSC5;
  // (Data_SummaryC7, Manure_Management_BroilersC79)
  const totalMethaneTonnes = totalMethaneGg * 10 ** 3;

  // (Nitrous_Oxide_MMS_BroilersC83)
  const totalMethaneN2OGg = totalMethane.methaneN2O * constants.GWP_FACTORSC6;

  // (Data_SummaryC8, Nitrous_Oxide_MMS_BroilersC84)
  const totalMethaneN2OTonnes = totalMethaneN2OGg * 10 ** 3;

  return { N2O: totalMethaneN2OTonnes, CH4: totalMethaneTonnes };
}
