import { BroilerClass } from '@/types/Poultry/broilerclass.input';
import { BroilersComplete } from '@/types/Poultry/broilers.input';
import { State } from '@/types/enums';
import { ExecutionContext } from '../executionContext';
import { ConstantsForPoultryCalculator } from './constants';
import {
  getBroilersTotalDungUrine,
  getBroilerTotalBirdNumbers,
} from './functions';

function broilerLeaching(
  broilers: BroilersComplete,
  broiler: BroilerClass,
  state: State,
  rainfallAbove600: boolean,
  fractionWasteThroughDrylot: number,
  context: ExecutionContext<ConstantsForPoultryCalculator>,
) {
  const { constants } = context;

  const totalBirdNumbers = getBroilerTotalBirdNumbers(
    broiler.birds,
    broilers.litterRecycled,
    broilers.litterRecycleFrequency,
  );

  const { dryMatterIntake, crudeProtein, nitrogenRetentionRate } =
    constants.POULTRY.DIET_PROPERTIES.meat_chicken_growers;

  const dryMatterIntakeInput = broiler.dryMatterIntake ?? dryMatterIntake;

  const crudeProteinInput = broiler.crudeProtein ?? crudeProtein;

  const nitrogenRetentionInput =
    broiler.nitrogenRetentionRate ?? nitrogenRetentionRate;

  const nitrogenIntakeGrowers =
    totalBirdNumbers === 0
      ? 0
      : (dryMatterIntakeInput * crudeProteinInput) / 6.25;

  const stayLength1DR50 = broiler.averageStayLength50;

  const daysTo50PDepletion =
    totalBirdNumbers === 0
      ? 0
      : nitrogenIntakeGrowers *
        (1 - nitrogenRetentionInput) *
        stayLength1DR50 *
        10 ** -6;

  const percent50 = 0.5;

  const birdNumbersAfter50P = totalBirdNumbers * percent50;

  const stayLength2DR100 = broiler.averageStayLength100;

  const averageL2DepletionRate = stayLength2DR100 - stayLength1DR50;

  const daysTo100PDepletion =
    birdNumbersAfter50P === 0
      ? 0
      : nitrogenIntakeGrowers *
        (1 - nitrogenRetentionInput) *
        averageL2DepletionRate *
        10 ** -6;

  const totalSeasonalFaecalNitrogenExcreted =
    totalBirdNumbers * daysTo50PDepletion +
    birdNumbersAfter50P * daysTo100PDepletion;

  const fracWetMultiplier = rainfallAbove600 ? 1 : 0;

  const fracLeach = constants.COMMON.LEACHING.FRACLEACH_BROILER;
  const fracLeachMMS = constants.COMMON.LEACHING.FRACLEACH;

  const proportionAppliedToSoil = broilers.manureWasteAllocation;

  const dungAndUrineN =
    totalSeasonalFaecalNitrogenExcreted *
    fracWetMultiplier *
    fracLeach *
    proportionAppliedToSoil;

  const leachingEF = constants.COMMON.LEACHING.N2O_EF;

  const growerNDungUrine =
    dungAndUrineN * leachingEF * constants.COMMON.GWP_FACTORSC15;

  const fractionOfWasteHandledDrylotSolidStorage = fractionWasteThroughDrylot;

  const fracWETMMS = broilers.manureWasteAllocation;

  const massOfNLostThroughLeachingGrower =
    totalBirdNumbers *
      daysTo50PDepletion *
      fractionOfWasteHandledDrylotSolidStorage *
      fracWETMMS *
      fracLeachMMS +
    birdNumbersAfter50P *
      daysTo100PDepletion *
      fractionOfWasteHandledDrylotSolidStorage *
      fracWETMMS *
      fracLeachMMS;

  const leachingCg = 1.5714285714285714;

  const leachingEmissions =
    massOfNLostThroughLeachingGrower * leachingEF * leachingCg;

  return { dungUrineN: growerNDungUrine, leachingEmissions };
}

export function calculateScope1BroilersLeaching(
  broilers: BroilersComplete,
  state: State,
  rainfallAbove600: boolean,
  context: ExecutionContext<ConstantsForPoultryCalculator>,
) {
  const meatGrowerLeach = broilers.groups.reduce(
    (acc, group) => {
      const leachingN2O = broilerLeaching(
        broilers,
        group.meatChickenGrowers,
        state,
        rainfallAbove600,
        broilers.wasteHandledDrylotOrStorage,
        context,
      );
      return {
        dungUrine: acc.dungUrine + leachingN2O.dungUrineN,
        leaching: acc.leaching + leachingN2O.leachingEmissions,
      };
    },
    { dungUrine: 0, leaching: 0 },
  );

  const meatLayersLeach = broilers.groups.reduce(
    (acc, group) => {
      const leachingN2O = broilerLeaching(
        broilers,
        group.meatChickenLayers,
        state,
        rainfallAbove600,
        broilers.wasteHandledDrylotOrStorage,
        context,
      );
      return {
        dungUrine: acc.dungUrine + leachingN2O.dungUrineN,
        leaching: acc.leaching + leachingN2O.leachingEmissions,
      };
    },
    { dungUrine: 0, leaching: 0 },
  );

  const meatOtherLeach = broilers.groups.reduce(
    (acc, group) => {
      const leachingN2O = broilerLeaching(
        broilers,
        group.meatOther,
        state,
        rainfallAbove600,
        broilers.wasteHandledDrylotOrStorage,
        context,
      );
      return {
        dungUrine: acc.dungUrine + leachingN2O.dungUrineN,
        leaching: acc.leaching + leachingN2O.leachingEmissions,
      };
    },
    { dungUrine: 0, leaching: 0 },
  );

  const { constants } = context;

  const totalNDungUrine = getBroilersTotalDungUrine(
    meatGrowerLeach.dungUrine,
    meatLayersLeach.dungUrine,
    meatOtherLeach.dungUrine,
  );

  const totalNDungUrineN2O = totalNDungUrine * 10 ** 3;

  const totalN2OLeaching = totalNDungUrineN2O * constants.COMMON.GWP_FACTORSC6;

  const totalLeaching =
    meatGrowerLeach.leaching +
    meatLayersLeach.leaching +
    meatOtherLeach.leaching;

  const totalLeachingGg = totalLeaching * constants.COMMON.GWP_FACTORSC6;

  const totalLeachingCO2 = totalLeachingGg * 10 ** 3;

  const leachingN2O = totalLeachingCO2 + totalN2OLeaching;

  return leachingN2O;
}
