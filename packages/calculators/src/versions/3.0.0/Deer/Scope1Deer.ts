import { getOtherFertiliserAmounts } from '../common/fertiliser';
import { SEASONS } from '../constants/constants';
import { ExecutionContext } from '../executionContext';
import { DeerComplete } from '../types/Deer/deer.input';
import { Fertiliser } from '../types/fertiliser.input';
import { DeerClassesAPI, State } from '../types/types';
import { ConstantsForDeerCalculator } from './constants';
import { getLeachingOtherDryland } from './functions';

// const apiTypeToClassName: { [api in DeerClassAPI]: DeerClass } = {
//   bucks: 'bucks',
//   breedingDoes: 'breeding_does',
//   fawn: 'fawn',
//   otherDoes: 'other_does',
//   tradeBucks: 'trade_bucks',
//   tradeDoes: 'trade_does',
// };

// another fertiliser input as we merge them before
export function calculateScope1(
  deer: DeerComplete,
  fertiliser: Fertiliser,
  rainfallAbove600: boolean,
  state: State,
  context: ExecutionContext<ConstantsForDeerCalculator>,
) {
  const { constants } = context;
  // (Manure_ManagementE35)
  const deerManureProduction = constants.DEER.MANUREPRODUCTION / 365;

  // (Manure_ManagementD17)
  const proportionAnimalsWarm =
    constants.COMMON.OTHERLIVESTOCK_ALLOCATION_CLIMATEREGIONS[state].warm;
  // (Manure_ManagementD18)
  const proportionAnimalsTemperate =
    constants.COMMON.OTHERLIVESTOCK_ALLOCATION_CLIMATEREGIONS[state].temperate;

  // (Manure_ManagementD20)
  const methaneProductionM =
    deerManureProduction *
      proportionAnimalsWarm *
      constants.COMMON.METHANE_WARM_EF +
    deerManureProduction *
      proportionAnimalsTemperate *
      constants.COMMON.METHANE_TEMPERATE_EF;

  const total = SEASONS.reduce(
    (acc, season) => {
      const res = DeerClassesAPI.reduce(
        (acc2, deerType) => {
          const deerClass = deer.classes[deerType];
          if (!deerClass) {
            return acc2;
          }

          const { head } = deerClass[season];

          // (Nitrous_Oxide_MMSO7)
          const seasonalUrinaryN =
            ((head * constants.DEER.NITROGEN_EXCRETED_FACTOR) / 4) * 10 ** -6;

          // (Nitrous_Oxide_MMSO15, Agricultural_SoilsD21)
          const seasonalFaecalN = seasonalUrinaryN * constants.DEER.FAECALN_PMF;

          // (Nitrous_Oxide_MMSP22)
          const DEER_SEASONALURINE_PMU = 0.71;

          // (Nitrous_Oxide_MMSO24, Agricultural_SoilsD26)
          const seasonalUrineN = seasonalUrinaryN * DEER_SEASONALURINE_PMU;

          // (Agricultural_SoilsD48)
          const atmosphericDeposition =
            (seasonalFaecalN + seasonalUrineN) * constants.COMMON.FRAC_GASM;

          // (Agricultural_SoilsD64)
          const nDungUrine =
            atmosphericDeposition *
            constants.COMMON.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE *
            constants.COMMON.GWP_FACTORSC15;

          // enteric

          // (Enteric_FermentationD16)
          const seasonalMethane =
            ((head * constants.DEER.ENTERIC_EF) / 4) * 10 ** -6;

          // manure

          // (Manure_ManagementD24)
          const manureMethaneProduction =
            head * methaneProductionM * 91.25 * 10 ** -6;

          // urine dung

          // (Agricultural_SoilsD35)
          const urineDungDepositedDuringGrazing =
            seasonalFaecalN *
              constants.COMMON.URINEDUNG_EF *
              constants.COMMON.GWP_FACTORSC15 +
            seasonalUrineN *
              constants.COMMON.URINEDUNG_EF *
              constants.COMMON.GWP_FACTORSC15;

          return {
            seasonalFaecalN: acc2.seasonalFaecalN + seasonalFaecalN,
            seasonalUrineN: acc2.seasonalUrineN + seasonalUrineN,
            atmosphericDeposition:
              acc2.atmosphericDeposition + atmosphericDeposition,
            nDungUrine: acc2.nDungUrine + nDungUrine,
            seasonalMethane: acc2.seasonalMethane + seasonalMethane,
            manureMethaneProduction:
              acc2.manureMethaneProduction + manureMethaneProduction,
            urineDungDepositedDuringGrazing:
              acc2.urineDungDepositedDuringGrazing +
              urineDungDepositedDuringGrazing,
          };
        },
        {
          seasonalFaecalN: 0,
          seasonalUrineN: 0,
          atmosphericDeposition: 0,
          nDungUrine: 0,
          seasonalMethane: 0,
          manureMethaneProduction: 0,
          urineDungDepositedDuringGrazing: 0,
        },
      );

      return {
        seasonalFaecalN: acc.seasonalFaecalN + res.seasonalFaecalN,
        seasonalUrineN: acc.seasonalUrineN + res.seasonalUrineN,
        atmosphericDeposition:
          acc.atmosphericDeposition + res.atmosphericDeposition,
        nDungUrine: acc.nDungUrine + res.nDungUrine,
        seasonalMethane: acc.seasonalMethane + res.seasonalMethane,
        manureMethaneProduction:
          acc.manureMethaneProduction + res.manureMethaneProduction,
        urineDungDepositedDuringGrazing:
          acc.urineDungDepositedDuringGrazing +
          res.urineDungDepositedDuringGrazing,
      };
    },
    {
      seasonalFaecalN: 0,
      seasonalUrineN: 0,
      atmosphericDeposition: 0,
      nDungUrine: 0,
      seasonalMethane: 0,
      manureMethaneProduction: 0,
      urineDungDepositedDuringGrazing: 0,
    },
  );

  //
  const { otherFertiliserDryland, otherFertiliserIrrigated } =
    getOtherFertiliserAmounts(context, fertiliser);

  // (Agricultural_SoilsJ10)
  const ATMOSPHERICNDEPOSITION_FACTOR = 0.11;

  // (Agricultural_SoilsD57)
  const nFertiliserUreaGrazingDryland =
    deer.fertiliser.pastureDryland * 0.46 * ATMOSPHERICNDEPOSITION_FACTOR;

  // (Agricultural_SoilsD58)
  const nFertiliserUreaCropsDryland =
    deer.fertiliser.cropsDryland * 0.46 * ATMOSPHERICNDEPOSITION_FACTOR;

  // WARNING: in code this was Data_InputE47 which points to an undefined cell
  // (Agricultural_SoilsD59)
  const nFertiliserOtherDryland =
    otherFertiliserDryland * ATMOSPHERICNDEPOSITION_FACTOR;

  // (Agricultural_SoilsD60)
  const totalN2ODryland =
    (nFertiliserUreaGrazingDryland +
      nFertiliserUreaCropsDryland +
      nFertiliserOtherDryland) *
    constants.COMMON.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE *
    constants.COMMON.GWP_FACTORSC15;

  // (Agricultural_SoilsF57)
  const nFertiliserUreaGrazingIrrigated =
    deer.fertiliser.pastureIrrigated * 0.46 * ATMOSPHERICNDEPOSITION_FACTOR;

  // (Agricultural_SoilsF58)
  const nFertiliserUreaCropsIrrigated =
    deer.fertiliser.cropsIrrigated * 0.46 * ATMOSPHERICNDEPOSITION_FACTOR;

  // (Agricultural_SoilsF59)
  const nFertiliserUreaOtherIrrigated =
    otherFertiliserIrrigated * ATMOSPHERICNDEPOSITION_FACTOR;

  // (Agricultural_SoilsF60)
  const totalN2OIrrigated =
    (nFertiliserUreaGrazingIrrigated *
      constants.COMMON.AGRICULTURAL_SOILS.EF_IRRIGATEDPASTURE +
      nFertiliserUreaCropsIrrigated *
        constants.COMMON.AGRICULTURAL_SOILS.EF_IRRIGATEDCROP +
      nFertiliserUreaOtherIrrigated *
        constants.COMMON.AGRICULTURAL_SOILS.EF_IRRIGATEDCROP) *
    constants.COMMON.GWP_FACTORSC15;

  // (Agricultural_SoilsD61)
  const atmosphericDepositionN2O =
    (totalN2ODryland + totalN2OIrrigated) * constants.COMMON.GWP_FACTORSC6;

  // (Agricultural_SoilsD69)
  const totalNDungUrinePre = total.nDungUrine;

  // (Agricultural_SoilsD70)
  const totalNDungUrineGg = totalNDungUrinePre * constants.COMMON.GWP_FACTORSC6;
  // (Agricultural_SoilsD71)
  const totalNDungUrine = totalNDungUrineGg * 10 ** 3;

  // (Data_SummaryC12)
  const atmopshericN2O = atmosphericDepositionN2O + totalNDungUrine;

  // (Enteric_FermentationC22)
  const methaneGg = total.seasonalMethane * constants.COMMON.GWP_FACTORSC5;
  const totalMethaneEnteric = methaneGg * 10 ** 3;

  // leaching

  // (Agricultural_SoilsF83)
  const fracWetMultiplier = rainfallAbove600 ? 1 : 0;
  // (Agricultural_SoilsF84)
  const fracLEACH = 0.24;

  // (Agricultural_SoilsD87)
  const leachingPastureDryland =
    deer.fertiliser.pastureDryland * 0.46 * fracWetMultiplier * fracLEACH;
  const leachingCropsDryland =
    deer.fertiliser.cropsDryland * 0.46 * fracWetMultiplier * fracLEACH;
  const leachingOtherDryland = getLeachingOtherDryland(
    otherFertiliserDryland,
    fracWetMultiplier,
    fracLEACH,
  );
  // not used due to below
  //   const leachingPastureIrrigated =
  //     deer.fertiliser.pastureIrrigated * 0.46 * fracWetMultiplier * fracLEACH;
  //   const leachingCropsIrrigated =
  //     deer.fertiliser.cropsIrrigated * 0.46 * fracWetMultiplier * fracLEACH;
  //   const leachingOtherIrrigated =
  //     deer.fertiliser.otherIrrigated * 0.46 * fracWetMultiplier * fracLEACH;

  // (Agricultural_SoilsD11)
  const LEACHING_EF = 0.011;

  // (Agricultural_SoilsD101)
  // WARNING: irrigated for this one is all 0
  const nSyntheticPastureDryland =
    leachingPastureDryland * LEACHING_EF * constants.COMMON.GWP_FACTORSC15;
  const nSyntheticCropsDryland =
    leachingCropsDryland * LEACHING_EF * constants.COMMON.GWP_FACTORSC15;
  // WARNING: Agricultural_SoilsD103 points to E not D
  const nSyntheticOtherDryland =
    leachingOtherDryland * LEACHING_EF * constants.COMMON.GWP_FACTORSC15;

  // (Agricultural_SoilsD104)
  const totalNSynthetic =
    nSyntheticPastureDryland + nSyntheticCropsDryland + nSyntheticOtherDryland;

  // (Agricultural_SoilsD92:95)
  const massDungUrineLostThroughLeaching =
    (total.seasonalFaecalN + total.seasonalUrineN) *
    fracWetMultiplier *
    fracLEACH;

  // (Agricultural_SoilsD111)
  const nDungUrineLeaching =
    massDungUrineLostThroughLeaching *
    LEACHING_EF *
    constants.COMMON.GWP_FACTORSC15;

  // (Agricultural_SoilsC113)
  const leachingN2O = totalNSynthetic + nDungUrineLeaching * 10 ** 3;
  // (Agricultural_SoilsC115, Data_SummaryC13)
  const totalLeachingN2O = leachingN2O * constants.COMMON.GWP_FACTORSC6;

  // (Manure_ManagementC29)
  const totalManureMethane = total.manureMethaneProduction;
  // (Manure_ManagementC30)
  const totalManureMethaneGg =
    totalManureMethane * constants.COMMON.GWP_FACTORSC5;
  const manureMethane = totalManureMethaneGg * 10 ** 3;
  // (Manure_ManagementC31, Data_SummaryC9)

  // (Agricultural_SoilsD40)
  const uringDungGrazing = total.urineDungDepositedDuringGrazing;
  // (Agricultural_SoilsD41)
  const urineDungGrazingGg = uringDungGrazing * constants.COMMON.GWP_FACTORSC6;
  // (Agricultural_SoilsD42, Data_SummaryC11)
  const totalUrineDung = urineDungGrazingGg * 10 ** 3;

  // fertiliser

  // (Agricultural_SoilsD14)
  const soilFertiliserGrazingDryland =
    fertiliser.pastureDryland *
    0.46 *
    constants.COMMON.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE *
    constants.COMMON.GWP_FACTORSC15;

  const soilFertiliserCropsDryland =
    fertiliser.cropsDryland *
    0.46 *
    constants.COMMON.AGRICULTURAL_SOILS.EF_NONIRRIGATEDCROP *
    constants.COMMON.GWP_FACTORSC15;
  const soilFertiliserOtherDryland =
    otherFertiliserDryland *
    constants.COMMON.AGRICULTURAL_SOILS.EF_NONIRRIGATEDCROP *
    constants.COMMON.GWP_FACTORSC15;

  const soilFertiliserPastureIrrigated =
    fertiliser.pastureIrrigated *
    0.46 *
    constants.COMMON.AGRICULTURAL_SOILS.EF_IRRIGATEDPASTURE *
    constants.COMMON.GWP_FACTORSC15;

  const soilFertiliserCropsIrrigated =
    fertiliser.cropsIrrigated *
    0.46 *
    constants.COMMON.AGRICULTURAL_SOILS.EF_IRRIGATEDCROP *
    constants.COMMON.GWP_FACTORSC15;
  const soilFertiliserOtherIrrigated =
    otherFertiliserIrrigated *
    constants.COMMON.AGRICULTURAL_SOILS.EF_IRRIGATEDCROP *
    constants.COMMON.GWP_FACTORSC15;

  // (Agricultural_SoilsD18, Data_SummaryC10)
  const totalFertiliserSoil =
    (soilFertiliserGrazingDryland +
      soilFertiliserCropsDryland +
      soilFertiliserOtherDryland +
      soilFertiliserPastureIrrigated +
      soilFertiliserCropsIrrigated +
      soilFertiliserOtherIrrigated) *
    constants.COMMON.GWP_FACTORSC6;

  return {
    atmopshericN2O,
    totalMethaneEnteric,
    totalLeachingN2O,
    manureMethane,
    totalUrineDung,
    totalFertiliserSoil,
  };
}
