import { ExecutionContext } from '../executionContext';
import { BroilerClass } from '../types/Poultry/broilerclass.input';
import { BroilersComplete } from '../types/Poultry/broilers.input';
import { State } from '../types/types';
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

  // (Data_Input_BroilersC18, Nitrous_Oxide_MMS_BroilersD5)
  const totalBirdNumbers = getBroilerTotalBirdNumbers(
    broiler.birds,
    broilers.litterRecycled,
    broilers.litterRecycleFrequency,
  );

  // (Manure_Management_BroilersD84, Manure_Management_BroilersD86, Manure_Management_BroilersD87)
  const { dryMatterIntake, crudeProtein, nitrogenRetentionRate } =
    constants.POULTRY.DIET_PROPERTIES.meat_chicken_growers;

  // (Data_Input_BroilersC23, Nitrous_Oxide_MMS_BroilersD25)
  const dryMatterIntakeInput = broiler.dryMatterIntake ?? dryMatterIntake;

  // (Data_Input_BroilersC25, Nitrous_Oxide_MMS_BroilersD30)
  const crudeProteinInput = broiler.crudeProtein ?? crudeProtein;

  // (Data_Input_BroilersC27, Nitrous_Oxide_MMS_BroilersD35)
  const nitrogenRetentionInput =
    broiler.nitrogenRetentionRate ?? nitrogenRetentionRate;

  // (Nitrous_Oxide_MMS_BroilersD48)
  const nitrogenIntakeGrowers =
    totalBirdNumbers === 0
      ? 0
      : (dryMatterIntakeInput * crudeProteinInput) / 6.25;

  // (Data_Input_BroilersC19, Nitrous_Oxide_MMS_BroilersD10)
  const stayLength1DR50 = broiler.averageStayLength50;

  // (Nitrous_Oxide_MMS_BroilersD58)
  const daysTo50PDepletion =
    totalBirdNumbers === 0
      ? 0
      : nitrogenIntakeGrowers *
        (1 - nitrogenRetentionInput) *
        stayLength1DR50 *
        10 ** -6;

  // (Nitrous_Oxide_MMS_BroilersB11)
  const percent50 = 0.5;

  // (Nitrous_Oxide_MMS_BroilersD15)
  const birdNumbersAfter50P = totalBirdNumbers * percent50;

  // (Data_Input_BroilersC21)
  const stayLength2DR100 = broiler.averageStayLength100;

  // (Nitrous_Oxide_MMS_BroilersD20)
  const averageL2DepletionRate = stayLength2DR100 - stayLength1DR50;

  // (Nitrous_Oxide_MMS_BroilersD63)
  const daysTo100PDepletion =
    birdNumbersAfter50P === 0
      ? 0
      : nitrogenIntakeGrowers *
        (1 - nitrogenRetentionInput) *
        averageL2DepletionRate *
        10 ** -6;

  // (Agricultural_Soils_BroilersD17)
  const totalSeasonalFaecalNitrogenExcreted =
    totalBirdNumbers * daysTo50PDepletion +
    birdNumbersAfter50P * daysTo100PDepletion;

  // (Agricultural_Soils_BroilersF67)
  const fracWetMultiplier = rainfallAbove600 ? 1 : 0;

  // (Agricultural_Soils_BroilersF68)
  const fracLeach = constants.COMMON.LEACHING.FRACLEACH_BROILER;
  const fracLeachMMS = constants.COMMON.LEACHING.FRACLEACH;

  // (Agricultural_Soils_BroilersF69)
  const proportionAppliedToSoil = broilers.manureWasteAllocation;

  // (Agricultural_Soils_BroilersD73)
  const dungAndUrineN =
    totalSeasonalFaecalNitrogenExcreted *
    fracWetMultiplier *
    fracLeach *
    proportionAppliedToSoil;

  // (Nitrous_Oxide_MMS_BroilersD135, Agricultural_Soils_BroilersD11)
  const leachingEF = constants.COMMON.LEACHING.N2O_EF;

  // (Agricultural_Soils_BroilersD80)
  const growerNDungUrine =
    dungAndUrineN * leachingEF * constants.COMMON.GWP_FACTORSC15;

  // (Data_Input_BroilersE121, Nitrous_Oxide_MMS_BroilersE148, Nitrous_Oxide_MMS_BroilersF120)
  const fractionOfWasteHandledDrylotSolidStorage = fractionWasteThroughDrylot;

  // (Nitrous_Oxide_MMS_BroilersD126)
  const fracWETMMS = broilers.manureWasteAllocation;

  // (Nitrous_Oxide_MMS_BroilersF122)

  // (Nitrous_Oxide_MMS_BroilersD128)
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

  // (Nitrous_Oxide_MMS_BroilersD136)
  const leachingCg = 1.5714285714285714;

  // (Nitrous_Oxide_MMS_BroilersD138)
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

  // (Agricultural_Soils_BroilersC86)
  const totalNDungUrineN2O = totalNDungUrine * 10 ** 3;

  // (Agricultural_Soils_BroilersC88)
  const totalN2OLeaching = totalNDungUrineN2O * constants.COMMON.GWP_FACTORSC6;

  // (Nitrous_Oxide_MMS_BroilersC143)
  const totalLeaching =
    meatGrowerLeach.leaching +
    meatLayersLeach.leaching +
    meatOtherLeach.leaching;

  // (Nitrous_Oxide_MMS_BroilersC144)
  const totalLeachingGg = totalLeaching * constants.COMMON.GWP_FACTORSC6;

  // (Nitrous_Oxide_MMS_BroilersC145)
  const totalLeachingCO2 = totalLeachingGg * 10 ** 3;

  // (Data_SummaryC10)
  const leachingN2O = totalLeachingCO2 + totalN2OLeaching;

  return leachingN2O;
}
