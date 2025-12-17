import { SEASONS } from '@/constants/constants';
import { DairyComplete } from '@/types/Dairy/dairy.input';
import { DairyClassesAPI, DairyProductionSystem, State } from '@/types/enums';
import { ExecutionContext } from '../executionContext';
import { ConstantsForDairyCalculator } from './constants';
import {
  getManureSumpDispersalFractionMilking,
  getManureSumpDispersalFractionOther,
} from './functions';

type InternalOutput = {
  mmsTotal: number;
  massOfAnimalWasteVolatisedPre: number;
  methaneProduction: number;
  massAnimalWastLostThroughRunoff: number;
  mmsDirectTotalN2O: number;
  mmsIndirectTotalN2O: number;
  leachingStorage: number;
  annualMethane: number;
  urineDungNitrogenTotal: number;
};

export function calculateScope1(
  complete: DairyComplete,
  system: DairyProductionSystem,
  state: State,
  rainfallAbove600: boolean,
  context: ExecutionContext<ConstantsForDairyCalculator>,
) {
  const manureAnaerobicFractionMilking =
    complete.manureManagementMilkingCows.anaerobicLagoon / 100;
  const manureAnaerobicFractionOtherDairy =
    complete.manureManagementOtherDairyCows.anaerobicLagoon / 100;

  const manurePastureFractionMilking =
    complete.manureManagementMilkingCows.pasture / 100;
  const manurePastureFractionOther =
    complete.manureManagementOtherDairyCows.pasture / 100;

  const manureSumpDispersalFractionMilking =
    getManureSumpDispersalFractionMilking(complete);

  const manureSumpDispersalFractionOther =
    getManureSumpDispersalFractionOther(complete);

  const manureDrainToPaddockFractionMilking =
    complete.manureManagementMilkingCows.drainToPaddocks / 100;
  const manureDrainToPaddockFractionOther =
    complete.manureManagementOtherDairyCows.drainToPaddocks / 100;

  const manureSolidStorageFractionMilking =
    complete.manureManagementMilkingCows.solidStorage / 100;
  const manureSolidStorageFractionOther =
    complete.manureManagementOtherDairyCows.solidStorage / 100;

  const { constants } = context;

  const total = SEASONS.reduce(
    (acc, season) => {
      const seasonTotal = DairyClassesAPI.reduce(
        (acc2, dairyClass) => {
          const isMilkingCow = dairyClass === 'milkingCows';

          const dairyClassSeason = complete.classes[dairyClass][season];

          const { head, liveweight, liveweightGain } = dairyClassSeason;

          // 1.1 for milking cows, 1.0 for other
          const milkMetabolicRateIncrease = isMilkingCow ? 1.1 : 1.0;

          const milkProduction = dairyClassSeason.milkProduction ?? 0;

          const dryMatterDigestibility =
            dairyClassSeason.dryMatterDigestibility ?? 0;

          const GROSSENERGY = 18.4;

          const additionalIntakeForMilkProductionFactor = isMilkingCow
            ? 1.03
            : 1.0;

          const additionalIntakeForMilkProduction =
            (milkProduction * additionalIntakeForMilkProductionFactor * 3.054) /
            0.6 /
            (0.00795 * dryMatterDigestibility - 0.0014) /
            GROSSENERGY;

          const feedIntake =
            (1.185 +
              0.00454 * liveweight -
              0.0000026 * liveweight ** 2 +
              0.315 * liveweightGain) **
              2 *
              milkMetabolicRateIncrease +
            additionalIntakeForMilkProduction;

          const crudeProtein = dairyClassSeason.crudeProtein ?? 0;

          const crudeProteinIntake = feedIntake * (crudeProtein / 100);

          const energyFromDMD = 0.1604 * dryMatterDigestibility - 1.037;

          const nitrogenExcretedInFaeces =
            (0.3 *
              (crudeProteinIntake * (1 - (dryMatterDigestibility + 10) / 100)) +
              0.105 * (energyFromDMD * feedIntake * 0.008) +
              0.0152 * feedIntake) /
            6.25;

          const totalSeasonalFaecalNitrogenExcreted =
            91.25 * head * nitrogenExcretedInFaeces * 10 ** -6;

          const MP_CONVERSION = 1.03;

          const LIVEWEIGHT_GAIN = 0;

          const intakeRelativeToMaintenance =
            (feedIntake /
              (1.185 +
                0.00454 * liveweight -
                0.0000026 * liveweight ** 2 +
                0.315 * LIVEWEIGHT_GAIN) **
                2) *
              milkMetabolicRateIncrease +
            additionalIntakeForMilkProduction;

          const referenceWeight =
            constants.DAIRY.CATTLE_STANDARD_REFERENCE_WEIGHTS[dairyClass];

          const relativeSize = liveweight / referenceWeight;

          const nitrogenRetained =
            (0.032 * (milkProduction * MP_CONVERSION)) / 6.38 +
            ((0.212 -
              0.008 * (intakeRelativeToMaintenance - 2) -
              (0.14 - 0.008 * (intakeRelativeToMaintenance - 2)) /
                (1 + Math.exp(-6 * (relativeSize - 0.4)))) *
              (liveweightGain * 0.92)) /
              6.25;

          const nitrogenExcretedUrine =
            crudeProteinIntake / 6.25 -
            nitrogenRetained -
            nitrogenExcretedInFaeces -
            (1.1 * 10 ** -4 * liveweight ** 0.75) / 6.25;

          const totalSeasonalUrinaryNitrogenExcreted =
            91.25 * head * nitrogenExcretedUrine * 10 ** -6;

          const seasonalNitrogenExcreted =
            totalSeasonalFaecalNitrogenExcreted +
            totalSeasonalUrinaryNitrogenExcreted;

          const mms8 =
            seasonalNitrogenExcreted *
            (isMilkingCow
              ? manureSolidStorageFractionMilking
              : manureSolidStorageFractionOther);

          const leachingForSolidStorageFracWET = 1;
          const leachingForSolidStorageFracLEACH = 0.02;

          const leachingSolidStorage =
            mms8 *
            leachingForSolidStorageFracWET *
            leachingForSolidStorageFracLEACH;

          const mmsAnaerobicLagoonFracGASM = 0.35;

          const mmsAnaerobicLagoon =
            seasonalNitrogenExcreted *
            (isMilkingCow
              ? manureAnaerobicFractionMilking
              : manureAnaerobicFractionOtherDairy) *
            (1 -
              constants.DAIRY.CATTLE_N2O_MMS.anaerobic_lagoon.EF -
              mmsAnaerobicLagoonFracGASM);

          const mmsSumpDispersalFracGASM = 0.07;

          const mmsSumpDispersal =
            seasonalNitrogenExcreted *
            (isMilkingCow
              ? manureSumpDispersalFractionMilking
              : manureSumpDispersalFractionOther) *
            (1 -
              constants.DAIRY.CATTLE_N2O_MMS.daily_spread.EF -
              mmsSumpDispersalFracGASM);

          const mmsDrainToPaddocks =
            seasonalNitrogenExcreted *
            (isMilkingCow
              ? manureDrainToPaddockFractionMilking
              : manureDrainToPaddockFractionOther) *
            (1 -
              constants.DAIRY.CATTLE_N2O_MMS.daily_spread.EF -
              constants.DAIRY.CATTLE_N2O_MMS.daily_spread.FracGASM);

          const mmsSolidStorage =
            seasonalNitrogenExcreted *
              (isMilkingCow
                ? manureSolidStorageFractionMilking
                : manureSolidStorageFractionOther) *
              (1 -
                constants.DAIRY.CATTLE_N2O_MMS.solid_storage.EF -
                constants.DAIRY.CATTLE_N2O_MMS.solid_storage.FracGASM) -
            leachingSolidStorage;

          const mmsTotal =
            // NOTE: pasture not included in spreadsheet, or here either
            mmsAnaerobicLagoon +
            mmsSumpDispersal +
            mmsDrainToPaddocks +
            mmsSolidStorage;

          const totalSeasonalFaecalNitrogenExcretedGg =
            totalSeasonalFaecalNitrogenExcreted *
            (isMilkingCow
              ? manurePastureFractionMilking
              : manurePastureFractionOther);

          const totalSeasonalUrinaryNitrogenExcretedGg =
            totalSeasonalUrinaryNitrogenExcreted *
            (isMilkingCow
              ? manurePastureFractionMilking
              : manurePastureFractionOther);

          const massOfAnimalWasteVolatisedPre =
            mmsTotal +
            totalSeasonalFaecalNitrogenExcretedGg +
            totalSeasonalUrinaryNitrogenExcretedGg;

          const dailyMethaneYield = 20.7 * (feedIntake / 1000);

          const annualMethaneProductionAnimal =
            head * dailyMethaneYield * 91.25 * 10 ** -6;

          const massAnimalWastLostThroughRunoff =
            massOfAnimalWasteVolatisedPre *
            constants.COMMON.LEACHING.FERT_N_FRACLEACH *
            constants.COMMON.LEACHING.FERT_N_FRACWET;

          // manure N2O

          const mms1Fraction =
            seasonalNitrogenExcreted *
            (isMilkingCow
              ? manurePastureFractionMilking
              : manurePastureFractionOther);
          const mms2Fraction =
            seasonalNitrogenExcreted *
            (isMilkingCow
              ? manureAnaerobicFractionMilking
              : manureAnaerobicFractionOtherDairy);
          const mms3Fraction =
            seasonalNitrogenExcreted *
            (isMilkingCow
              ? manureSumpDispersalFractionMilking
              : manureSumpDispersalFractionOther);
          const mms5Fraction =
            seasonalNitrogenExcreted *
            (isMilkingCow
              ? manureDrainToPaddockFractionMilking
              : manureDrainToPaddockFractionOther);
          const mms8Fraction =
            seasonalNitrogenExcreted *
            (isMilkingCow
              ? manureSolidStorageFractionMilking
              : manureSolidStorageFractionOther);

          const gwpFactorsC15 = constants.COMMON.GWP_FACTORSC15;
          const mms = constants.DAIRY.MANURE_MANAGEMENT;
          const mms1Total = mms1Fraction * mms.PASTURE_EF * gwpFactorsC15;
          const mms2Total = mms2Fraction * mms.ANAEROBIC_EF * gwpFactorsC15;
          const mms3Total = mms3Fraction * mms.SUMP_EF * gwpFactorsC15;
          const mms5Total = mms5Fraction * mms.DRAIN_EF * gwpFactorsC15;
          const mms8Total = mms8Fraction * mms.SOLID_EF * gwpFactorsC15;

          const mms1TotalIndirect = mms1Fraction * mms.PASTURE_FRACGASM;
          const mms2TotalIndirect = mms2Fraction * mms.ANAEROBIC_FRACGASM;
          const mms3TotalIndirect = mms3Fraction * mms.SUMP_FRACGASM;
          const mms5TotalIndirect = mms5Fraction * mms.DRAIN_FRACGASM;
          const mms8TotalIndirect = mms8Fraction * mms.SOLID_FRACGASM;

          const mmsDirectTotalN2O =
            mms1Total + mms2Total + mms3Total + mms5Total + mms8Total;

          const mmsIndirectTotalN2O =
            mms1TotalIndirect +
            mms2TotalIndirect +
            mms3TotalIndirect +
            mms5TotalIndirect +
            mms8TotalIndirect;

          const leachingStorage =
            mms8Fraction *
            constants.COMMON.LEACHING.STORAGE_FRACWET *
            constants.COMMON.LEACHING.STORAGE_FRACLEACH;

          const volatileSolids =
            (feedIntake * (1 - dryMatterDigestibility / 100) +
              0.04 * feedIntake) *
            (1 - constants.DAIRY.ASH_CONTENT);

          const methaneMMS1 =
            volatileSolids *
            (isMilkingCow
              ? manurePastureFractionMilking
              : manurePastureFractionOther) *
            constants.LIVESTOCK.METHANE_EMISSION_POTENTIAL *
            constants.DAIRY.METHANE_CONVERSION_FACTOR[state].Pasture *
            constants.LIVESTOCK.METHANE_DENSITY;
          const methaneMMS2 =
            volatileSolids *
            (isMilkingCow
              ? manureAnaerobicFractionMilking
              : manureAnaerobicFractionOtherDairy) *
            constants.LIVESTOCK.METHANE_EMISSION_POTENTIAL *
            constants.DAIRY.METHANE_CONVERSION_FACTOR[state][
              'Anaerobic lagoon'
            ] *
            constants.LIVESTOCK.METHANE_DENSITY;
          const methaneMMS3 =
            volatileSolids *
            (isMilkingCow
              ? manureSumpDispersalFractionMilking
              : manureSumpDispersalFractionOther) *
            constants.LIVESTOCK.METHANE_EMISSION_POTENTIAL *
            constants.DAIRY.METHANE_CONVERSION_FACTOR[state][
              'Sump and dispersal systems'
            ] *
            constants.LIVESTOCK.METHANE_DENSITY;
          const methaneMMS5 =
            volatileSolids *
            (isMilkingCow
              ? manureDrainToPaddockFractionMilking
              : manureDrainToPaddockFractionOther) *
            constants.LIVESTOCK.METHANE_EMISSION_POTENTIAL *
            constants.DAIRY.METHANE_CONVERSION_FACTOR[state][
              'Drains to paddock'
            ] *
            constants.LIVESTOCK.METHANE_DENSITY;
          const methaneMMS8 =
            volatileSolids *
            (isMilkingCow
              ? manureSolidStorageFractionMilking
              : manureSolidStorageFractionOther) *
            constants.LIVESTOCK.METHANE_EMISSION_POTENTIAL *
            constants.DAIRY.METHANE_CONVERSION_FACTOR[state]['Solid Storage'] *
            constants.LIVESTOCK.METHANE_DENSITY;

          const totalMethaneMMS =
            methaneMMS1 + methaneMMS2 + methaneMMS3 + methaneMMS5 + methaneMMS8;

          const mpw = constants.DAIRY.METHANE_MPW[dairyClass];

          const annualMethaneFromManure =
            dairyClass === 'dairyBullsLt1' || dairyClass === 'heifersLt1'
              ? (head * totalMethaneMMS * 7.25 + head * mpw * 84) * 10 ** -6
              : head * totalMethaneMMS * 91.25 * 10 ** -6;

          const urineDungFaecalNitrogen =
            totalSeasonalFaecalNitrogenExcreted *
            (isMilkingCow
              ? manurePastureFractionMilking
              : manurePastureFractionOther);
          const urineDungUrinaryNitrogen =
            totalSeasonalUrinaryNitrogenExcreted *
            (isMilkingCow
              ? manurePastureFractionMilking
              : manurePastureFractionOther);

          // NOTE: calculator only uses milking cows urine dung
          const urineDungNitrogenTotal = isMilkingCow
            ? (urineDungFaecalNitrogen + urineDungUrinaryNitrogen) *
              constants.LIVESTOCK.URINEDUNG_EF *
              constants.COMMON.GWP_FACTORSC15
            : 0;

          return {
            mmsTotal: acc2.mmsTotal + mmsTotal,
            massOfAnimalWasteVolatisedPre:
              acc2.massOfAnimalWasteVolatisedPre +
              massOfAnimalWasteVolatisedPre,
            methaneProduction:
              acc2.methaneProduction + annualMethaneProductionAnimal,
            massAnimalWastLostThroughRunoff:
              acc2.massAnimalWastLostThroughRunoff +
              massAnimalWastLostThroughRunoff,
            mmsDirectTotalN2O: acc2.mmsDirectTotalN2O + mmsDirectTotalN2O,
            mmsIndirectTotalN2O: acc2.mmsIndirectTotalN2O + mmsIndirectTotalN2O,
            leachingStorage: acc2.leachingStorage + leachingStorage,
            annualMethane: acc2.annualMethane + annualMethaneFromManure,
            urineDungNitrogenTotal:
              acc2.urineDungNitrogenTotal + urineDungNitrogenTotal,
          };
        },
        {
          annualMethane: 0,
          leachingStorage: 0,
          mmsDirectTotalN2O: 0,
          mmsIndirectTotalN2O: 0,
          mmsTotal: 0,
          massAnimalWastLostThroughRunoff: 0,
          massOfAnimalWasteVolatisedPre: 0,
          methaneProduction: 0,
          urineDungNitrogenTotal: 0,
        } as InternalOutput,
      );

      return {
        mmsTotal: acc.mmsTotal + seasonTotal.mmsTotal,
        massOfAnimalWasteVolatisedPre:
          acc.massOfAnimalWasteVolatisedPre +
          seasonTotal.massOfAnimalWasteVolatisedPre,
        methaneProduction:
          acc.methaneProduction + seasonTotal.methaneProduction,
        massAnimalWastLostThroughRunoff:
          acc.massAnimalWastLostThroughRunoff +
          seasonTotal.massAnimalWastLostThroughRunoff,
        mmsDirectTotalN2O:
          acc.mmsDirectTotalN2O + seasonTotal.mmsDirectTotalN2O,
        mmsIndirectTotalN2O:
          acc.mmsIndirectTotalN2O + seasonTotal.mmsIndirectTotalN2O,
        leachingStorage: acc.leachingStorage + seasonTotal.leachingStorage,
        annualMethane: acc.annualMethane + seasonTotal.annualMethane,
        urineDungNitrogenTotal:
          acc.urineDungNitrogenTotal + seasonTotal.urineDungNitrogenTotal,
      };
    },
    {
      annualMethane: 0,
      leachingStorage: 0,
      mmsDirectTotalN2O: 0,
      mmsIndirectTotalN2O: 0,
      mmsTotal: 0,
      massAnimalWastLostThroughRunoff: 0,
      massOfAnimalWasteVolatisedPre: 0,
      methaneProduction: 0,
      urineDungNitrogenTotal: 0,
    } as InternalOutput,
  );

  const massOfAnimalWasteVolatised =
    total.massOfAnimalWasteVolatisedPre * constants.LIVESTOCK.FRAC_GASM;

  const methaneGg = total.methaneProduction * constants.COMMON.GWP_FACTORSC5;
  const totalEntericMethane = methaneGg * 10 ** 3;

  const totalMMS = total.mmsTotal;

  const totalAnimalWasteN2O =
    totalMMS * constants.DAIRY.MMS_EF * constants.COMMON.GWP_FACTORSC15;
  const totalAnimalWasteGg =
    totalAnimalWasteN2O * constants.COMMON.GWP_FACTORSC6;
  const totalAnimalWaste = totalAnimalWasteGg * 10 ** 3;

  // fertiliser

  const FRACTION_OF_N_APPLIED_TO_PRODUCTIONSYSTEM = 1;

  const productionSystemConstants = rainfallAbove600
    ? constants.DAIRY.PRODUCTIONSYSTEM_EF.RAINFALL_GT_600
    : constants.DAIRY.PRODUCTIONSYSTEM_EF.RAINFALL_LT_600;

  const totalEmissionsFromFertiliser = SEASONS.reduce(
    (acc, season) => {
      const fertiliser = complete.seasonalFertiliser[season];

      const nitrogenFertiliserCropsNonIrrigated =
        fertiliser.cropsDryland * complete.areas.croppedDryland;

      const nitrogenFertiliserCropsIrrigated =
        fertiliser.cropsIrrigated * complete.areas.croppedIrrigated;

      const nitrogenFertiliserPastureNonIrrigated =
        fertiliser.pastureDryland * complete.areas.improvedPastureDryland;

      const nitrogenFertiliserPastureIrrigated =
        fertiliser.pastureIrrigated * complete.areas.improvedPastureIrrigated;

      const nCropsNonIrrigated =
        nitrogenFertiliserCropsNonIrrigated *
        FRACTION_OF_N_APPLIED_TO_PRODUCTIONSYSTEM *
        10 ** -6;

      const nCropsIrrigated =
        nitrogenFertiliserCropsIrrigated *
        FRACTION_OF_N_APPLIED_TO_PRODUCTIONSYSTEM *
        10 ** -6;

      const nPastureNonIrrigated =
        nitrogenFertiliserPastureNonIrrigated *
        FRACTION_OF_N_APPLIED_TO_PRODUCTIONSYSTEM *
        10 ** -6;

      const nPastureIrrigated =
        nitrogenFertiliserPastureIrrigated *
        FRACTION_OF_N_APPLIED_TO_PRODUCTIONSYSTEM *
        10 ** -6;

      const leachingCropsNonIrrigated =
        nCropsNonIrrigated *
        constants.COMMON.LEACHING.FERT_N_FRACWET *
        constants.COMMON.LEACHING.FERT_N_FRACLEACH;

      const leachingCropsIrrigated =
        nCropsIrrigated *
        constants.COMMON.LEACHING.FERT_N_FRACWET *
        constants.COMMON.LEACHING.FERT_N_FRACLEACH;

      const leachingPastureNonIrrigated =
        nPastureNonIrrigated *
        constants.COMMON.LEACHING.FERT_N_FRACWET *
        constants.COMMON.LEACHING.FERT_N_FRACLEACH;

      const leachingPastureIrrigated =
        nPastureIrrigated *
        constants.COMMON.LEACHING.FERT_N_FRACWET *
        constants.COMMON.LEACHING.FERT_N_FRACLEACH;

      const totalLeaching =
        leachingCropsNonIrrigated +
        leachingCropsIrrigated +
        leachingPastureNonIrrigated +
        leachingPastureIrrigated;

      // N2O synthetic fertiliser

      const cropsNonIrrigatedN2O =
        nCropsNonIrrigated *
        productionSystemConstants['Non-irrigated Crop'] *
        constants.COMMON.GWP_FACTORSC15;
      const cropsIrrigatedN2O =
        nCropsIrrigated *
        productionSystemConstants['Irrigated Crop'] *
        constants.COMMON.GWP_FACTORSC15;
      const pastureNonIrrigatedN2O =
        nPastureNonIrrigated *
        productionSystemConstants['Non-irrigated Pasture'] *
        constants.COMMON.GWP_FACTORSC15;
      const pastureIrrigatedN2O =
        nPastureIrrigated *
        productionSystemConstants['Irrigated Pasture'] *
        constants.COMMON.GWP_FACTORSC15;

      const totalSyntheticFertiliserN2O =
        cropsNonIrrigatedN2O +
        cropsIrrigatedN2O +
        pastureNonIrrigatedN2O +
        pastureIrrigatedN2O;

      const atmosphericCropsNonIrrigated =
        nitrogenFertiliserCropsNonIrrigated *
        10 ** -6 *
        constants.COMMON.FRAC_GASF;
      const atmosphericCropsIrrigated =
        nitrogenFertiliserCropsIrrigated *
        10 ** -6 *
        constants.COMMON.FRAC_GASF;
      const atmosphericPastureNonIrrigated =
        nitrogenFertiliserPastureNonIrrigated *
        10 ** -6 *
        constants.COMMON.FRAC_GASF;
      const atmosphericPastureIrrigated =
        nitrogenFertiliserPastureIrrigated *
        10 ** -6 *
        constants.COMMON.FRAC_GASF;

      const totalAtmospheric =
        atmosphericCropsNonIrrigated +
        atmosphericCropsIrrigated +
        atmosphericPastureNonIrrigated +
        atmosphericPastureIrrigated;

      return {
        leaching: acc.leaching + totalLeaching,
        fertiliser: acc.fertiliser + totalSyntheticFertiliserN2O,
        atmospheric: acc.atmospheric + totalAtmospheric,
      };
    },
    { leaching: 0, fertiliser: 0, atmospheric: 0 },
  );

  const atmosphericDepositionN2OFertiliser =
    (massOfAnimalWasteVolatised + totalEmissionsFromFertiliser.atmospheric) *
    constants.DAIRY.MASS_N_VOLATISED_EF *
    constants.COMMON.GWP_FACTORSC15;
  const atmosphericDepositionN2OFertiliserGg =
    atmosphericDepositionN2OFertiliser * constants.COMMON.GWP_FACTORSC6;
  const atmosphericDepositionN2O = atmosphericDepositionN2OFertiliserGg * 1000;

  const totalN2OLeaching =
    (totalEmissionsFromFertiliser.leaching +
      total.massAnimalWastLostThroughRunoff) *
    constants.COMMON.LEACHING.N2O_EF *
    constants.COMMON.GWP_FACTORSC15;
  const totalN2OLeachingGg = totalN2OLeaching * constants.COMMON.GWP_FACTORSC6;
  const totalN2OLeachingTonnes = totalN2OLeachingGg * 10 ** 3;

  const totalMMSN2ODirectGg =
    total.mmsDirectTotalN2O * constants.COMMON.GWP_FACTORSC6;
  const totalMMSN2ODirect = totalMMSN2ODirectGg * 10 ** 3;

  const totalMMSN2OIndirect = total.mmsIndirectTotalN2O;

  const productionSystemEF = productionSystemConstants[system];

  const totalMMSN2OIndirectGg =
    totalMMSN2OIndirect *
    productionSystemEF *
    constants.COMMON.GWP_FACTORSC15 *
    constants.COMMON.GWP_FACTORSC6;

  const totalMMSN2OIndirectTonnes = totalMMSN2OIndirectGg * 10 ** 3;

  const totalLeachingSolidStorageGg =
    total.leachingStorage *
    constants.COMMON.LEACHING.STORAGE_EF *
    constants.COMMON.GWP_FACTORSC15 *
    constants.COMMON.GWP_FACTORSC6;

  const totalLeachingSolidStorage = totalLeachingSolidStorageGg * 10 ** 3;

  const totalManureIndirectN2O =
    totalMMSN2OIndirectTonnes + totalLeachingSolidStorage;

  const totalManureN2O = totalMMSN2ODirect + totalManureIndirectN2O;

  const totalMethaneGg = total.annualMethane * constants.COMMON.GWP_FACTORSC5;
  const totalMethaneTonnes = totalMethaneGg * 10 ** 3;

  const totalUrineDungGg =
    total.urineDungNitrogenTotal * constants.COMMON.GWP_FACTORSC6;
  const urineDungTonnes = totalUrineDungGg * 10 ** 3;

  const totalN2OFromFertiliserGg =
    totalEmissionsFromFertiliser.fertiliser * constants.COMMON.GWP_FACTORSC6;
  const totalN2OFromFertiliser = totalN2OFromFertiliserGg * 10 ** 3;

  return {
    totalAnimalWaste,
    atmosphericDepositionN2O,
    totalEntericMethane,
    leachingN2O: totalN2OLeachingTonnes,
    totalManureN2O,
    totalMethaneTonnes,
    urineDungTonnes,
    totalN2OFromFertiliser,
  };
}
