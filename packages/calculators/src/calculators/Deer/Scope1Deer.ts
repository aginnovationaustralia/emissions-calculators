import { getOtherFertiliserAmounts } from '@/calculators/common/fertiliser';
import { SEASONS } from '@/constants/constants';
import { DeerComplete } from '@/types/Deer/deer.input';
import { DeerClassesAPI, State } from '@/types/enums';
import { Fertiliser } from '@/types/fertiliser.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForDeerCalculator } from './constants';
import { getLeachingOtherDryland } from './functions';

export function calculateScope1(
  deer: DeerComplete,
  fertiliser: Fertiliser,
  rainfallAbove600: boolean,
  state: State,
  context: ExecutionContext<ConstantsForDeerCalculator>,
) {
  const { constants } = context;
  const deerManureProduction = constants.DEER.MANUREPRODUCTION / 365;

  const proportionAnimalsWarm =
    constants.LIVESTOCK.OTHERLIVESTOCK_ALLOCATION_CLIMATEREGIONS[state].warm;
  const proportionAnimalsTemperate =
    constants.LIVESTOCK.OTHERLIVESTOCK_ALLOCATION_CLIMATEREGIONS[state]
      .temperate;

  const methaneProductionM =
    deerManureProduction *
      proportionAnimalsWarm *
      constants.LIVESTOCK.METHANE_WARM_EF +
    deerManureProduction *
      proportionAnimalsTemperate *
      constants.LIVESTOCK.METHANE_TEMPERATE_EF;

  const total = SEASONS.reduce(
    (acc, season) => {
      const res = DeerClassesAPI.reduce(
        (acc2, deerType) => {
          const deerClass = deer.classes[deerType];
          if (!deerClass) {
            return acc2;
          }

          const { head } = deerClass[season];

          const seasonalUrinaryN =
            ((head * constants.DEER.NITROGEN_EXCRETED_FACTOR) / 4) * 10 ** -6;

          const seasonalFaecalN = seasonalUrinaryN * constants.DEER.FAECALN_PMF;

          const DEER_SEASONALURINE_PMU = 0.71;

          const seasonalUrineN = seasonalUrinaryN * DEER_SEASONALURINE_PMU;

          const atmosphericDeposition =
            (seasonalFaecalN + seasonalUrineN) * constants.LIVESTOCK.FRAC_GASM;

          const nDungUrine =
            atmosphericDeposition *
            constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE *
            constants.COMMON.GWP_FACTORSC15;

          // enteric

          const seasonalMethane =
            ((head * constants.DEER.ENTERIC_EF) / 4) * 10 ** -6;

          // manure

          const manureMethaneProduction =
            head * methaneProductionM * 91.25 * 10 ** -6;

          // urine dung

          const urineDungDepositedDuringGrazing =
            seasonalFaecalN *
              constants.LIVESTOCK.URINEDUNG_EF *
              constants.COMMON.GWP_FACTORSC15 +
            seasonalUrineN *
              constants.LIVESTOCK.URINEDUNG_EF *
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

  const { otherFertiliserDryland, otherFertiliserIrrigated } =
    getOtherFertiliserAmounts(context, fertiliser);

  const ATMOSPHERICNDEPOSITION_FACTOR = 0.11;

  const nFertiliserUreaGrazingDryland =
    deer.fertiliser.pastureDryland * 0.46 * ATMOSPHERICNDEPOSITION_FACTOR;

  const nFertiliserUreaCropsDryland =
    deer.fertiliser.cropsDryland * 0.46 * ATMOSPHERICNDEPOSITION_FACTOR;

  const nFertiliserOtherDryland =
    otherFertiliserDryland * ATMOSPHERICNDEPOSITION_FACTOR;

  const totalN2ODryland =
    (nFertiliserUreaGrazingDryland +
      nFertiliserUreaCropsDryland +
      nFertiliserOtherDryland) *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE *
    constants.COMMON.GWP_FACTORSC15;

  const nFertiliserUreaGrazingIrrigated =
    deer.fertiliser.pastureIrrigated * 0.46 * ATMOSPHERICNDEPOSITION_FACTOR;

  const nFertiliserUreaCropsIrrigated =
    deer.fertiliser.cropsIrrigated * 0.46 * ATMOSPHERICNDEPOSITION_FACTOR;

  const nFertiliserUreaOtherIrrigated =
    otherFertiliserIrrigated * ATMOSPHERICNDEPOSITION_FACTOR;

  const totalN2OIrrigated =
    (nFertiliserUreaGrazingIrrigated *
      constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_IRRIGATEDPASTURE +
      nFertiliserUreaCropsIrrigated *
        constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_IRRIGATEDCROP +
      nFertiliserUreaOtherIrrigated *
        constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_IRRIGATEDCROP) *
    constants.COMMON.GWP_FACTORSC15;

  const atmosphericDepositionN2O =
    (totalN2ODryland + totalN2OIrrigated) * constants.COMMON.GWP_FACTORSC6;

  const totalNDungUrinePre = total.nDungUrine;

  const totalNDungUrineGg = totalNDungUrinePre * constants.COMMON.GWP_FACTORSC6;
  const totalNDungUrine = totalNDungUrineGg * 10 ** 3;

  const atmosphericN2O = atmosphericDepositionN2O + totalNDungUrine;

  const methaneGg = total.seasonalMethane * constants.COMMON.GWP_FACTORSC5;
  const totalMethaneEnteric = methaneGg * 10 ** 3;

  // leaching

  const fracWetMultiplier = rainfallAbove600 ? 1 : 0;
  const fracLEACH = 0.24;

  const leachingPastureDryland =
    deer.fertiliser.pastureDryland * 0.46 * fracWetMultiplier * fracLEACH;
  const leachingCropsDryland =
    deer.fertiliser.cropsDryland * 0.46 * fracWetMultiplier * fracLEACH;
  const leachingOtherDryland = getLeachingOtherDryland(
    otherFertiliserDryland,
    fracWetMultiplier,
    fracLEACH,
  );

  const LEACHING_EF = 0.011;

  const nSyntheticPastureDryland =
    leachingPastureDryland * LEACHING_EF * constants.COMMON.GWP_FACTORSC15;
  const nSyntheticCropsDryland =
    leachingCropsDryland * LEACHING_EF * constants.COMMON.GWP_FACTORSC15;
  const nSyntheticOtherDryland =
    leachingOtherDryland * LEACHING_EF * constants.COMMON.GWP_FACTORSC15;

  const totalNSynthetic =
    nSyntheticPastureDryland + nSyntheticCropsDryland + nSyntheticOtherDryland;

  const massDungUrineLostThroughLeaching =
    (total.seasonalFaecalN + total.seasonalUrineN) *
    fracWetMultiplier *
    fracLEACH;

  const nDungUrineLeaching =
    massDungUrineLostThroughLeaching *
    LEACHING_EF *
    constants.COMMON.GWP_FACTORSC15;

  const leachingN2O = totalNSynthetic + nDungUrineLeaching * 10 ** 3;
  const totalLeachingN2O = leachingN2O * constants.COMMON.GWP_FACTORSC6;

  const totalManureMethane = total.manureMethaneProduction;
  const totalManureMethaneGg =
    totalManureMethane * constants.COMMON.GWP_FACTORSC5;
  const manureMethane = totalManureMethaneGg * 10 ** 3;

  const uringDungGrazing = total.urineDungDepositedDuringGrazing;
  const urineDungGrazingGg = uringDungGrazing * constants.COMMON.GWP_FACTORSC6;
  const totalUrineDung = urineDungGrazingGg * 10 ** 3;

  // fertiliser

  const soilFertiliserGrazingDryland =
    fertiliser.pastureDryland *
    0.46 *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE *
    constants.COMMON.GWP_FACTORSC15;

  const soilFertiliserCropsDryland =
    fertiliser.cropsDryland *
    0.46 *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDCROP *
    constants.COMMON.GWP_FACTORSC15;
  const soilFertiliserOtherDryland =
    otherFertiliserDryland *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDCROP *
    constants.COMMON.GWP_FACTORSC15;

  const soilFertiliserPastureIrrigated =
    fertiliser.pastureIrrigated *
    0.46 *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_IRRIGATEDPASTURE *
    constants.COMMON.GWP_FACTORSC15;

  const soilFertiliserCropsIrrigated =
    fertiliser.cropsIrrigated *
    0.46 *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_IRRIGATEDCROP *
    constants.COMMON.GWP_FACTORSC15;
  const soilFertiliserOtherIrrigated =
    otherFertiliserIrrigated *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_IRRIGATEDCROP *
    constants.COMMON.GWP_FACTORSC15;

  const totalFertiliserSoil =
    (soilFertiliserGrazingDryland +
      soilFertiliserCropsDryland +
      soilFertiliserOtherDryland +
      soilFertiliserPastureIrrigated +
      soilFertiliserCropsIrrigated +
      soilFertiliserOtherIrrigated) *
    constants.COMMON.GWP_FACTORSC6;

  return {
    atmosphericN2O,
    totalMethaneEnteric,
    totalLeachingN2O,
    manureMethane,
    totalUrineDung,
    totalFertiliserSoil,
  };
}
