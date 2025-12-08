import { BroilerGroup } from '@/types/Poultry/group.input';
import { PoultryClass, State } from '@/types/enums';
import { ExecutionContext } from '../executionContext';
import { ConstantsForPoultryCalculator } from './constants';
import { getBroilerTotalBirdNumbers } from './functions';

function calculateMethaneProduction(
  type: Exclude<PoultryClass, 'layers'>,
  birdNumbers: number,
  averageLengthOfStay50: number,
  averageLengthOfStay100: number,
  state: State,
  context: ExecutionContext<ConstantsForPoultryCalculator>,
  dryMatter?: number,
  dryMatterDigest?: number,
  manureAsh?: number,
  crudeProtein?: number,
  nitrogenRetention?: number,
  percentLitterRecycled?: number,
  recyclesPerYear?: number,
) {
  const { constants } = context;
  const {
    dryMatterIntake,
    crudeProtein: crudeProteinConstant,
    nitrogenRetentionRate,
    manureAsh: manureAshConstant,
    dryMatterDigestibility,
  } = constants.POULTRY.DIET_PROPERTIES[type];

  const dryMatterInput = dryMatter ?? dryMatterIntake;

  const percentLitterRecycledInput = percentLitterRecycled ?? 0;
  const recyclesPerYearInput = recyclesPerYear ?? 0;

  const totalBirdNumbers = getBroilerTotalBirdNumbers(
    birdNumbers,
    percentLitterRecycledInput,
    recyclesPerYearInput,
  );

  const lengthOf50PStay = averageLengthOfStay50;

  const dryMatterDigestibilityInput = dryMatterDigest ?? dryMatterDigestibility;

  const manureAshInput = manureAsh ?? manureAshConstant;

  const crudeProteinInput = crudeProtein ?? crudeProteinConstant;
  const nitrogenRetentionRateInput = nitrogenRetention ?? nitrogenRetentionRate;

  const volatileSolidProduction =
    totalBirdNumbers === 0
      ? 0
      : dryMatterInput *
        (1 - dryMatterDigestibilityInput) *
        (1 - manureAshInput);

  const meatChickensEP = 0.36;

  // integrated methane conversion factor
  const ICMF = constants.POULTRY.MEATLAYER_EF_IMCF.meat_chickens[state];

  const densityOfMethane = constants.LIVESTOCK.METHANE_DENSITY;

  const methaneProductionFromManure =
    volatileSolidProduction * meatChickensEP * ICMF * densityOfMethane;

  const percent50 = 0.5;

  const birdNumbersAfter50P = totalBirdNumbers * percent50;

  const averageLengthOfStay50DepletionRate = averageLengthOfStay50;
  const averageLengthOfStay100DepletionRate = averageLengthOfStay100;

  const averageLengthOfStay100R =
    averageLengthOfStay100DepletionRate - averageLengthOfStay50DepletionRate;

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

  const nitrogenIntake =
    totalBirdNumbers === 0 ? 0 : (dryMatterInput * crudeProteinInput) / 6.25;

  const daysTo50PDepletion =
    totalBirdNumbers === 0
      ? 0
      : nitrogenIntake *
        (1 - nitrogenRetentionRateInput) *
        lengthOf50PStay *
        10 ** -6;

  const { iNOF } = constants.POULTRY.MEATLAYER_EF.meat_chickens;

  const daysTo100PDepletion =
    birdNumbersAfter50P === 0
      ? 0
      : nitrogenIntake *
        (1 - nitrogenRetentionRateInput) *
        averageLengthOfStay100R *
        10 ** -6;
  const totalN2OEmissions =
    totalBirdNumbers *
      daysTo50PDepletion *
      iNOF *
      constants.COMMON.GWP_FACTORSC15 +
    birdNumbersAfter50P *
      daysTo100PDepletion *
      iNOF *
      constants.COMMON.GWP_FACTORSC15;

  return { CH4: methaneProduction, N2O: totalN2OEmissions };
}

export function calculateScope1BroilersManure(
  groups: BroilerGroup[],
  state: State,
  context: ExecutionContext<ConstantsForPoultryCalculator>,
  litterRecycled: number,
  litterRecycleFrequency: number,
) {
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

  const totalMethaneGg =
    totalMethane.methaneCH4 * constants.COMMON.GWP_FACTORSC5;
  const totalMethaneTonnes = totalMethaneGg * 10 ** 3;

  const totalMethaneN2OGg =
    totalMethane.methaneN2O * constants.COMMON.GWP_FACTORSC6;

  const totalMethaneN2OTonnes = totalMethaneN2OGg * 10 ** 3;

  return { N2O: totalMethaneN2OTonnes, CH4: totalMethaneTonnes };
}
