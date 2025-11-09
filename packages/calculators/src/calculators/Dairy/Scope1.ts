import { DAIRY_CLASSES, SEASONS } from '@/constants/constants';
import { DairyComplete } from '@/types/Dairy/dairy.input';
import {
  DairyClass,
  DairyClassAPI,
  DairyProductionSystem,
  State,
} from '@/types/types';
import { ExecutionContext } from '../executionContext';
import { ConstantsForDairyCalculator } from './constants';
import {
  getManureSumpDispersalFractionMilking,
  getManureSumpDispersalFractionOther,
} from './functions';

const DAIRYCLASSES_TO_CAMELCASE: {
  [key in DairyClass]: DairyClassAPI;
} = {
  milking_cows: 'milkingCows',
  heifers_lt_1: 'heifersLt1',
  heifers_gt_1: 'heifersGt1',
  dairyBulls_lt_1: 'dairyBullsLt1',
  dairyBulls_gt_1: 'dairyBullsGt1',
};

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
  // (Agricultural_SoilsD77, Data_InputD94)
  const manureAnaerobicFractionMilking =
    complete.manureManagementMilkingCows.anaerobicLagoon / 100;
  // (Agricultural_SoilsD78)
  const manureAnaerobicFractionOtherDairy =
    complete.manureManagementOtherDairyCows.anaerobicLagoon / 100;

  // (Agricultural_SoilsC78)
  const manurePastureFractionMilking =
    complete.manureManagementMilkingCows.pasture / 100;
  const manurePastureFractionOther =
    complete.manureManagementOtherDairyCows.pasture / 100;

  // (Agricultural_SoilsE77, Data_InputE94)
  const manureSumpDispersalFractionMilking =
    getManureSumpDispersalFractionMilking(complete);

  const manureSumpDispersalFractionOther =
    getManureSumpDispersalFractionOther(complete);

  // (Agricultural_SoilsF77, Data_InputF94)
  const manureDrainToPaddockFractionMilking =
    complete.manureManagementMilkingCows.drainToPaddocks / 100;
  const manureDrainToPaddockFractionOther =
    complete.manureManagementOtherDairyCows.drainToPaddocks / 100;

  // (Agricultural_SoilsG77, Nitrous_Oxide_MMSG62, Data_InputG94)
  const manureSolidStorageFractionMilking =
    complete.manureManagementMilkingCows.solidStorage / 100;
  const manureSolidStorageFractionOther =
    complete.manureManagementOtherDairyCows.solidStorage / 100;

  const { constants } = context;

  const total = SEASONS.reduce(
    (acc, season) => {
      const seasonTotal = DAIRY_CLASSES.reduce(
        (acc2, dairyClass) => {
          const dairyKey = DAIRYCLASSES_TO_CAMELCASE[dairyClass];
          const isMilkingCow = dairyClass === 'milking_cows';

          const dairyClassSeason = complete.classes[dairyKey][season];

          // (Nitrous_Oxide_MMSD40, Data_InputD9)
          // (Enteric_FermentationD15, Nitrous_Oxide_MMSD30, Data_InputD15)
          // (Enteric_FermentationD10, Nitrous_Oxide_MMSD35, Data_InputD21)
          const { head, liveweight, liveweightGain } = dairyClassSeason;

          // 1.1 for milking cows, 1.0 for other
          // (Enteric_FermentationD32, Nitrous_Oxide_MMSD74)
          const milkMetabolicRateIncrease = isMilkingCow ? 1.1 : 1.0;

          // (Enteric_FermentationD25, Nitrous_Oxide_MMSD25, Data_InputD39)
          const milkProduction = dairyClassSeason.milkProduction ?? 0;

          // (Enteric_FermentationD20, Nitrous_Oxide_MMSD15, Data_InputD33)
          const dryMatterDigestibility =
            dairyClassSeason.dryMatterDigestibility ?? 0;

          // (Enteric_FermentationC30)
          const GROSSENERGY = 18.4;

          const additionalIntakeForMilkProductionFactor = isMilkingCow
            ? 1.03
            : 1.0;

          // (Enteric_FermentationM13)
          const additionalIntakeForMilkProduction =
            (milkProduction * additionalIntakeForMilkProductionFactor * 3.054) /
            0.6 /
            (0.00795 * dryMatterDigestibility - 0.0014) /
            GROSSENERGY;

          // (Enteric_FermentationM6, Nitrous_Oxide_MMSD5)
          const feedIntake =
            (1.185 +
              0.00454 * liveweight -
              0.0000026 * liveweight ** 2 +
              0.315 * liveweightGain) **
              2 *
              milkMetabolicRateIncrease +
            additionalIntakeForMilkProduction;

          // (Nitrous_Oxide_MMSD10, Data_InputD27)
          const crudeProtein = dairyClassSeason.crudeProtein ?? 0;

          // (Nitrous_Oxide_MMSM8)
          const crudeProteinIntake = feedIntake * (crudeProtein / 100);

          // (Nitrous_Oxide_MMSD20)
          const energyFromDMD = 0.1604 * dryMatterDigestibility - 1.037;

          // (Nitrous_Oxide_MMSM36)
          const nitrogenExcretedInFaeces =
            (0.3 *
              (crudeProteinIntake * (1 - (dryMatterDigestibility + 10) / 100)) +
              0.105 * (energyFromDMD * feedIntake * 0.008) +
              0.0152 * feedIntake) /
            6.25;

          // (Nitrous_Oxide_MMSM49)
          const totalSeasonalFaecalNitrogenExcreted =
            91.25 * head * nitrogenExcretedInFaeces * 10 ** -6;

          // (Nitrous_Oxide_MMSM26)
          const MP_CONVERSION = 1.03;

          // (Nitrous_Oxide_MMSN16)
          const LIVEWEIGHT_GAIN = 0;

          // (Nitrous_Oxide_MMSM20)
          const intakeRelativeToMaintenance =
            (feedIntake /
              (1.185 +
                0.00454 * liveweight -
                0.0000026 * liveweight ** 2 +
                0.315 * LIVEWEIGHT_GAIN) **
                2) *
              milkMetabolicRateIncrease +
            additionalIntakeForMilkProduction;

          // (Nitrous_Oxide_MMSD59)
          const referenceWeight =
            constants.DAIRY.CATTLE_STANDARD_REFERENCE_WEIGHTS[dairyClass];

          // (Nitrous_Oxide_MMSD45)
          const relativeSize = liveweight / referenceWeight;

          // (Nitrous_Oxide_MMSM28)
          const nitrogenRetained =
            (0.032 * (milkProduction * MP_CONVERSION)) / 6.38 +
            ((0.212 -
              0.008 * (intakeRelativeToMaintenance - 2) -
              (0.14 - 0.008 * (intakeRelativeToMaintenance - 2)) /
                (1 + Math.exp(-6 * (relativeSize - 0.4)))) *
              (liveweightGain * 0.92)) /
              6.25;

          // (Nitrous_Oxide_MMSM42)
          const nitrogenExcretedUrine =
            crudeProteinIntake / 6.25 -
            nitrogenRetained -
            nitrogenExcretedInFaeces -
            (1.1 * 10 ** -4 * liveweight ** 0.75) / 6.25;

          // (Nitrous_Oxide_MMSM56)
          const totalSeasonalUrinaryNitrogenExcreted =
            91.25 * head * nitrogenExcretedUrine * 10 ** -6;

          // (Nitrous_Oxide_MMSM63, Agricultural_SoilsD82)
          const seasonalNitrogenExcreted =
            totalSeasonalFaecalNitrogenExcreted +
            totalSeasonalUrinaryNitrogenExcreted;

          // (Nitrous_Oxide_MMSM95)
          const mms8 =
            seasonalNitrogenExcreted *
            (isMilkingCow
              ? manureSolidStorageFractionMilking
              : manureSolidStorageFractionOther);

          // (Nitrous_Oxide_MMSM190)
          const leachingForSolidStorageFracWET = 1;
          // (Nitrous_Oxide_MMSM191)
          const leachingForSolidStorageFracLEACH = 0.02;

          // (Nitrous_Oxide_MMSM193, Agricultural_SoilsD87)
          const leachingSolidStorage =
            mms8 *
            leachingForSolidStorageFracWET *
            leachingForSolidStorageFracLEACH;

          // (Agricultural_SoilsB116)
          const mmsAnaerobicLagoonFracGASM = 0.35;

          // (Agricultural_SoilsD113)
          const mmsAnaerobicLagoon =
            seasonalNitrogenExcreted *
            (isMilkingCow
              ? manureAnaerobicFractionMilking
              : manureAnaerobicFractionOtherDairy) *
            (1 -
              constants.DAIRY.CATTLE_N2O_MMS.anaerobic_lagoon.EF -
              mmsAnaerobicLagoonFracGASM);

          // (Agricultural_SoilsB121)
          const mmsSumpDispersalFracGASM = 0.07;

          // (Agricultural_SoilsD118)
          const mmsSumpDispersal =
            seasonalNitrogenExcreted *
            (isMilkingCow
              ? manureSumpDispersalFractionMilking
              : manureSumpDispersalFractionOther) *
            (1 -
              constants.DAIRY.CATTLE_N2O_MMS.daily_spread.EF -
              mmsSumpDispersalFracGASM);

          // (Agricultural_SoilsD123)
          const mmsDrainToPaddocks =
            seasonalNitrogenExcreted *
            (isMilkingCow
              ? manureDrainToPaddockFractionMilking
              : manureDrainToPaddockFractionOther) *
            (1 -
              constants.DAIRY.CATTLE_N2O_MMS.daily_spread.EF -
              constants.DAIRY.CATTLE_N2O_MMS.daily_spread.FracGASM);

          // (Agricultural_SoilsD128)
          const mmsSolidStorage =
            seasonalNitrogenExcreted *
              (isMilkingCow
                ? manureSolidStorageFractionMilking
                : manureSolidStorageFractionOther) *
              (1 -
                constants.DAIRY.CATTLE_N2O_MMS.solid_storage.EF -
                constants.DAIRY.CATTLE_N2O_MMS.solid_storage.FracGASM) -
            leachingSolidStorage;

          // (Agricultural_SoilsD134:137)
          const mmsTotal =
            // NOTE: pasture not included in spreadsheet, or here either
            mmsAnaerobicLagoon +
            mmsSumpDispersal +
            mmsDrainToPaddocks +
            mmsSolidStorage;

          // (Agricultural_SoilsG206)
          const totalSeasonalFaecalNitrogenExcretedGg =
            totalSeasonalFaecalNitrogenExcreted *
            (isMilkingCow
              ? manurePastureFractionMilking
              : manurePastureFractionOther);

          // (Agricultural_SoilsG211)
          const totalSeasonalUrinaryNitrogenExcretedGg =
            totalSeasonalUrinaryNitrogenExcreted *
            (isMilkingCow
              ? manurePastureFractionMilking
              : manurePastureFractionOther);

          // (Agricultural_SoilsD216)
          const massOfAnimalWasteVolatisedPre =
            mmsTotal +
            totalSeasonalFaecalNitrogenExcretedGg +
            totalSeasonalUrinaryNitrogenExcretedGg;

          // (Enteric_FermentationM20)
          const dailyMethaneYield = 20.7 * (feedIntake / 1000);

          // (Enteric_FermentationM30)
          const annualMethaneProductionAnimal =
            head * dailyMethaneYield * 91.25 * 10 ** -6;

          // (Agricultural_SoilsD264)
          const massAnimalWastLostThroughRunoff =
            massOfAnimalWasteVolatisedPre *
            constants.COMMON.LEACHING.FERT_N_FRACLEACH *
            constants.COMMON.LEACHING.FERT_N_FRACWET;

          // manure N2O

          // (Nitrous_Oxide_MMSM75)
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
          // (Nitrous_Oxide_MMS M108)
          const mms1Total = mms1Fraction * mms.PASTURE_EF * gwpFactorsC15;
          const mms2Total = mms2Fraction * mms.ANAEROBIC_EF * gwpFactorsC15;
          const mms3Total = mms3Fraction * mms.SUMP_EF * gwpFactorsC15;
          const mms5Total = mms5Fraction * mms.DRAIN_EF * gwpFactorsC15;
          const mms8Total = mms8Fraction * mms.SOLID_EF * gwpFactorsC15;

          // (Nitrous_Oxide_MMSM149)
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

          // (Nitrous_Oxide_MMSM193)
          const leachingStorage =
            mms8Fraction *
            constants.COMMON.LEACHING.STORAGE_FRACWET *
            constants.COMMON.LEACHING.STORAGE_FRACLEACH;

          // (Manure_ManagementM6)
          const volatileSolids =
            (feedIntake * (1 - dryMatterDigestibility / 100) +
              0.04 * feedIntake) *
            (1 - constants.DAIRY.ASH_CONTENT);

          // (Manure_ManagementM18)
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

          // (Manure_ManagementM43)
          const totalMethaneMMS =
            methaneMMS1 + methaneMMS2 + methaneMMS3 + methaneMMS5 + methaneMMS8;

          const mpw = constants.DAIRY.METHANE_MPW[dairyClass];

          // (Manure_ManagementM53)
          const annualMethaneFromManure =
            dairyClass === 'dairyBulls_lt_1' || dairyClass === 'heifers_lt_1'
              ? (head * totalMethaneMMS * 7.25 + head * mpw * 84) * 10 ** -6
              : head * totalMethaneMMS * 91.25 * 10 ** -6;

          // (Agricultural_SoilsD152)
          const urineDungFaecalNitrogen =
            totalSeasonalFaecalNitrogenExcreted *
            (isMilkingCow
              ? manurePastureFractionMilking
              : manurePastureFractionOther);
          // (Agricultural_SoilsD157)
          const urineDungUrinaryNitrogen =
            totalSeasonalUrinaryNitrogenExcreted *
            (isMilkingCow
              ? manurePastureFractionMilking
              : manurePastureFractionOther);

          // (Agricultural_SoilsD166)
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

  // (Agricultural_SoilsD216)
  const massOfAnimalWasteVolatised =
    total.massOfAnimalWasteVolatisedPre * constants.LIVESTOCK.FRAC_GASM;

  // (Enteric_FermentationL35)
  const methaneGg = total.methaneProduction * constants.COMMON.GWP_FACTORSC5;
  const totalEntericMethane = methaneGg * 10 ** 3;

  // (Agricultural_SoilsD139)
  const totalMMS = total.mmsTotal;

  // (Agricultural_SoilsD145)
  const totalAnimalWasteN2O =
    totalMMS * constants.DAIRY.MMS_EF * constants.COMMON.GWP_FACTORSC15;
  // (Agricultural_SoilsD146)
  const totalAnimalWasteGg =
    totalAnimalWasteN2O * constants.COMMON.GWP_FACTORSC6;
  // (Agricultural_SoilsD147, Data_SummaryC14)
  const totalAnimalWaste = totalAnimalWasteGg * 10 ** 3;

  // fertiliser

  const FRACTION_OF_N_APPLIED_TO_PRODUCTIONSYSTEM = 1;

  const productionSystemConstants = rainfallAbove600
    ? constants.DAIRY.PRODUCTIONSYSTEM_EF.RAINFALL_GT_600
    : constants.DAIRY.PRODUCTIONSYSTEM_EF.RAINFALL_LT_600;

  // (Agricultural_SoilsD247)
  const totalEmissionsFromFertiliser = SEASONS.reduce(
    (acc, season) => {
      const fertiliser = complete.seasonalFertiliser[season];

      // (Agricultural_SoilsD11)
      const nitrogenFertiliserCropsNonIrrigated =
        fertiliser.cropsDryland * complete.areas.croppedDryland;

      const nitrogenFertiliserCropsIrrigated =
        fertiliser.cropsIrrigated * complete.areas.croppedIrrigated;

      const nitrogenFertiliserPastureNonIrrigated =
        fertiliser.pastureDryland * complete.areas.improvedPastureDryland;

      const nitrogenFertiliserPastureIrrigated =
        fertiliser.pastureIrrigated * complete.areas.improvedPastureIrrigated;

      // (Agricultural_SoilsD32)
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

      // (Agricultural_SoilsD247)
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

      // (Agricultural_SoilsD59)
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

      // (Agricultural_SoilsD184)
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

  // (Agricultural_SoilsD232)
  const atmosphericDepositionN2OFertiliser =
    (massOfAnimalWasteVolatised + totalEmissionsFromFertiliser.atmospheric) *
    constants.DAIRY.MASS_N_VOLATISED_EF *
    constants.COMMON.GWP_FACTORSC15;
  const atmosphericDepositionN2OFertiliserGg =
    atmosphericDepositionN2OFertiliser * constants.COMMON.GWP_FACTORSC6;
  const atmosphericDepositionN2O = atmosphericDepositionN2OFertiliserGg * 1000;

  // (Agricultural_SoilsD275)
  const totalN2OLeaching =
    (totalEmissionsFromFertiliser.leaching +
      total.massAnimalWastLostThroughRunoff) *
    constants.COMMON.LEACHING.N2O_EF *
    constants.COMMON.GWP_FACTORSC15;
  const totalN2OLeachingGg = totalN2OLeaching * constants.COMMON.GWP_FACTORSC6;
  const totalN2OLeachingTonnes = totalN2OLeachingGg * 10 ** 3;

  // (Nitrous_Oxide_MMSL139)
  const totalMMSN2ODirectGg =
    total.mmsDirectTotalN2O * constants.COMMON.GWP_FACTORSC6;
  const totalMMSN2ODirect = totalMMSN2ODirectGg * 10 ** 3;

  // (Nitrous_Oxide_MMSL183)
  const totalMMSN2OIndirect = total.mmsIndirectTotalN2O;

  const productionSystemEF = productionSystemConstants[system];

  // (Nitrous_Oxide_MMSL184)
  const totalMMSN2OIndirectGg =
    totalMMSN2OIndirect *
    productionSystemEF *
    constants.COMMON.GWP_FACTORSC15 *
    constants.COMMON.GWP_FACTORSC6;

  const totalMMSN2OIndirectTonnes = totalMMSN2OIndirectGg * 10 ** 3;

  // (Nitrous_Oxide_MMSL205)
  const totalLeachingSolidStorageGg =
    total.leachingStorage *
    constants.COMMON.LEACHING.STORAGE_EF *
    constants.COMMON.GWP_FACTORSC15 *
    constants.COMMON.GWP_FACTORSC6;

  const totalLeachingSolidStorage = totalLeachingSolidStorageGg * 10 ** 3;

  const totalManureIndirectN2O =
    totalMMSN2OIndirectTonnes + totalLeachingSolidStorage;

  const totalManureN2O = totalMMSN2ODirect + totalManureIndirectN2O;

  // (Manure_ManagementL59)
  const totalMethaneGg = total.annualMethane * constants.COMMON.GWP_FACTORSC5;
  const totalMethaneTonnes = totalMethaneGg * 10 ** 3;

  // (Agricultural_SoilsD173)
  const totalUrineDungGg =
    total.urineDungNitrogenTotal * constants.COMMON.GWP_FACTORSC6;
  const urineDungTonnes = totalUrineDungGg * 10 ** 3;

  // (Agricultural_SoilsD71)
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
