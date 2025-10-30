import { getOtherFertiliserAmounts } from '../common/fertiliser';
import { SEASONS } from '../constants/constants';
import { ExecutionContext } from '../executionContext';
import { Fertiliser } from '../types/fertiliser.input';
import { GoatClasses } from '../types/Goat/goatclasses.input';
import { GoatClassAPI, GoatClassesAPI, Season, State } from '../types/types';
import { ConstantsForGoatCalculator } from './constants';
import { getLeachingOtherDryland, getMultiplier } from './functions';

type GoatSeasonEmissions = {
  seasonalEntericMethaneProduction: number;
  seasonalManureMethaneProduction: number;
  urineDungDeposited: number;
  seasonalUrineExcreted: number;
  seasonalFaecelExcreted: number;
};

export function goatEmissionsForSeason(
  head: number,
  state: State,
  context: ExecutionContext<ConstantsForGoatCalculator>,
): GoatSeasonEmissions {
  const { constants } = context;

  // (manureManagementE35)
  const MANUREYEAR = constants.GOAT.MANUREPRODUCTION / 365;

  //   WARNING manureManagementD18 is always 1, based off wrong state
  const proportionAnimalsWarmClimate = state === 'nt' ? 1 : 0;
  const proportionAnimalsTemperateClimate = state === 'nt' ? 0 : 1;

  // (manureManagementD20)
  const M =
    MANUREYEAR *
      proportionAnimalsWarmClimate *
      constants.LIVESTOCK.METHANE_WARM_EF +
    MANUREYEAR *
      proportionAnimalsTemperateClimate *
      constants.LIVESTOCK.METHANE_TEMPERATE_EF;

  // WARNING: manureManagementL24 has L20 but should be D20
  // (manureManagementD24)
  const seasonalManureMethaneProduction = head * M * 91.25 * 10 ** -6;

  //   enteric
  const seasonalEntericMethaneProduction =
    ((head * constants.GOAT.EF) / 4) * 10 ** -6;

  // (Nitrous_Oxide_MMSC16)
  const NITROGENEF = 7;

  // (Nitrous_Oxide_MMSR7)
  const seasonalUrinaryExcreted = ((head * NITROGENEF) / 4) * 10 ** -6;
  // R15
  const seasonalFaecelExcreted = seasonalUrinaryExcreted * 0.29;
  // R24
  const seasonalUrineExcreted = seasonalUrinaryExcreted * 0.71;

  // (Agricultural_SoilsD32)
  const URINEEF = 0.004;

  // (Agricultural_SoilsE35)
  const urineDungDeposited =
    seasonalFaecelExcreted * URINEEF * constants.COMMON.GWP_FACTORSC15 +
    seasonalUrineExcreted * URINEEF * constants.COMMON.GWP_FACTORSC15;

  return {
    seasonalEntericMethaneProduction,
    seasonalManureMethaneProduction,
    urineDungDeposited,
    seasonalUrineExcreted,
    seasonalFaecelExcreted,
  };
}

const EMPTY_SEASON: GoatSeasonEmissions = {
  seasonalEntericMethaneProduction: 0,
  seasonalManureMethaneProduction: 0,
  urineDungDeposited: 0,
  seasonalUrineExcreted: 0,
  seasonalFaecelExcreted: 0,
};

const EMPTY_INTERNAL_TOTALS: Record<Season, GoatSeasonEmissions> = {
  spring: EMPTY_SEASON,
  summer: EMPTY_SEASON,
  autumn: EMPTY_SEASON,
  winter: EMPTY_SEASON,
};

export function calculateCompleteGoatEmissions(
  goats: GoatClasses,
  state: State,
  fertiliser: Fertiliser,
  rainfallAbove600: boolean,
  context: ExecutionContext<ConstantsForGoatCalculator>,
) {
  const { constants } = context;

  const totals: {
    [goatType in GoatClassAPI]: {
      [season in Season]: GoatSeasonEmissions;
    };
  } = {
    bucksBilly: { ...EMPTY_INTERNAL_TOTALS },
    wethers: { ...EMPTY_INTERNAL_TOTALS },
    maidenBreedingDoesNannies: { ...EMPTY_INTERNAL_TOTALS },
    breedingDoesNannies: { ...EMPTY_INTERNAL_TOTALS },
    otherDoesCulledFemales: { ...EMPTY_INTERNAL_TOTALS },
    kids: { ...EMPTY_INTERNAL_TOTALS },
    tradeBucks: { ...EMPTY_INTERNAL_TOTALS },
    tradeDoes: { ...EMPTY_INTERNAL_TOTALS },
    tradeWethers: { ...EMPTY_INTERNAL_TOTALS },
    tradeMaidenBreedingDoesNannies: { ...EMPTY_INTERNAL_TOTALS },
    tradeBreedingDoesNannies: { ...EMPTY_INTERNAL_TOTALS },
    tradeOtherDoesCulledFemales: { ...EMPTY_INTERNAL_TOTALS },
    tradeKids: { ...EMPTY_INTERNAL_TOTALS },
  };

  SEASONS.forEach((season) => {
    GoatClassesAPI.forEach((goatType) => {
      const goatInputType = goats[goatType];
      if (!goatInputType) {
        return;
      }

      const goatSeason = goatInputType[season];

      const goatSeasonEmissions = goatEmissionsForSeason(
        goatSeason.head,
        state,
        context,
      );

      totals[goatType] = {
        ...totals[goatType],
        [season]: { ...goatSeasonEmissions },
      };
    });
  });

  const allGoatSeasons = Object.values(totals)
    .map((season) => Object.values(season))
    .flat();

  const entericCH4 =
    allGoatSeasons.reduce(
      (acc, x) => acc + x.seasonalEntericMethaneProduction,
      0,
    ) *
    constants.COMMON.GWP_FACTORSC5 *
    1000;

  const manureCH4 =
    allGoatSeasons.reduce(
      (acc, x) => acc + x.seasonalManureMethaneProduction,
      0,
    ) *
    constants.COMMON.GWP_FACTORSC5 *
    1000;

  const urineDung =
    allGoatSeasons.reduce((acc, x) => acc + x.urineDungDeposited, 0) *
    constants.COMMON.GWP_FACTORSC6 *
    1000;

  // (agriculturalSoilsD48)
  const springTotalUrineDung = Object.values(totals)
    .map((t) => t.spring)
    .reduce(
      (a, b) => a + b.seasonalFaecelExcreted + b.seasonalUrineExcreted,
      0,
    );

  const summerTotalUrineDung = Object.values(totals)
    .map((t) => t.summer)
    .reduce(
      (a, b) => a + b.seasonalFaecelExcreted + b.seasonalUrineExcreted,
      0,
    );

  const autumnTotalUrineDung = Object.values(totals)
    .map((t) => t.autumn)
    .reduce(
      (a, b) => a + b.seasonalFaecelExcreted + b.seasonalUrineExcreted,
      0,
    );

  const winterTotalUrineDung = Object.values(totals)
    .map((t) => t.winter)
    .reduce(
      (a, b) => a + b.seasonalFaecelExcreted + b.seasonalUrineExcreted,
      0,
    );

  const multiplier = getMultiplier(context);
  // (agriculturalSoilsD64 + D48)
  const springUrineDungN2O = springTotalUrineDung * multiplier;
  const summerUrineDungN2O = summerTotalUrineDung * multiplier;
  const winterUrineDungN2O = winterTotalUrineDung * multiplier;
  const autumnUrineDungN2O = autumnTotalUrineDung * multiplier;

  // (agriculturalSoilsD71)
  const totalAtmosphericDeposition =
    (springUrineDungN2O +
      summerUrineDungN2O +
      winterUrineDungN2O +
      autumnUrineDungN2O) *
    constants.COMMON.GWP_FACTORSC6 *
    1000;

  // (agriculturalSoilsD57)
  // Atmospheric nitrogen deposition Fertiliser
  // Dryland
  const atmosphericNDepositionUreaGrazingDryland =
    fertiliser.pastureDryland *
    0.46 *
    constants.LIVESTOCK.INOGRANICFERTILISER_ATMOSPHERIC_N;

  const atmosphericNDepositionUreaCroppingDryland =
    fertiliser.cropsDryland *
    0.46 *
    constants.LIVESTOCK.INOGRANICFERTILISER_ATMOSPHERIC_N;

  const { otherFertiliserDryland, otherFertiliserIrrigated } =
    getOtherFertiliserAmounts(context, fertiliser);

  const atmosphericNDepositionUreaOtherDryland =
    otherFertiliserDryland *
    constants.LIVESTOCK.INOGRANICFERTILISER_ATMOSPHERIC_N;

  const atmosphericNDepositionUreaDrylandTotal =
    (atmosphericNDepositionUreaGrazingDryland +
      atmosphericNDepositionUreaCroppingDryland +
      atmosphericNDepositionUreaOtherDryland) *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE *
    constants.COMMON.GWP_FACTORSC15;

  // Irrigated
  const atmosphericNDepositionUreaGrazingIrrigated =
    fertiliser.pastureIrrigated *
    0.46 *
    constants.LIVESTOCK.INOGRANICFERTILISER_ATMOSPHERIC_N;

  const atmosphericNDepositionUreaCroppingIrrigated =
    fertiliser.cropsIrrigated *
    0.46 *
    constants.LIVESTOCK.INOGRANICFERTILISER_ATMOSPHERIC_N;

  const atmosphericNDepositionUreaOtherIrrigated =
    otherFertiliserIrrigated *
    constants.LIVESTOCK.INOGRANICFERTILISER_ATMOSPHERIC_N;

  const atmosphericNDepositionUreaIrrigatedTotal =
    (atmosphericNDepositionUreaGrazingIrrigated *
      constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_IRRIGATEDPASTURE +
      atmosphericNDepositionUreaCroppingIrrigated *
        constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_IRRIGATEDCROP +
      atmosphericNDepositionUreaOtherIrrigated *
        constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_IRRIGATEDCROP) *
    constants.COMMON.GWP_FACTORSC15;

  const totalAtmosphericNDepositionFertiliser =
    (atmosphericNDepositionUreaDrylandTotal +
      atmosphericNDepositionUreaIrrigatedTotal) *
    constants.COMMON.GWP_FACTORSC6;
  // END Atmospheric nitrogen deposition Fertiliser

  // (agriculturalSoilsD14)
  const nFertiliserGrazingDrylandSoil =
    fertiliser.pastureDryland *
    0.46 *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE *
    constants.COMMON.GWP_FACTORSC15;
  const nFertiliserCroppingDrylandSoil =
    fertiliser.cropsDryland *
    0.46 *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDCROP *
    constants.COMMON.GWP_FACTORSC15;
  const nFertiliserOtherDrylandSoil =
    otherFertiliserDryland *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDCROP *
    constants.COMMON.GWP_FACTORSC15;
  // same for irrigated
  const nFertiliserGrazingIrrigatedSoil =
    fertiliser.pastureIrrigated *
    0.46 *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_IRRIGATEDPASTURE *
    constants.COMMON.GWP_FACTORSC15;
  const nFertiliserCroppingIrrigatedSoil =
    fertiliser.cropsIrrigated *
    0.46 *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_IRRIGATEDCROP *
    constants.COMMON.GWP_FACTORSC15;

  // WARNING: agriculturalSoilsF16 points to G62 but should be F62
  const nFertiliserOtherIrrigatedSoil =
    otherFertiliserIrrigated *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_IRRIGATEDCROP *
    constants.COMMON.GWP_FACTORSC15;

  // (agriculturalSoilsD17)
  const totalN2ODrylandSoil =
    nFertiliserGrazingDrylandSoil +
    nFertiliserCroppingDrylandSoil +
    nFertiliserOtherDrylandSoil;
  const totalN2OIrrigatedSoil =
    nFertiliserGrazingIrrigatedSoil +
    nFertiliserCroppingIrrigatedSoil +
    nFertiliserOtherIrrigatedSoil;

  // (agrictulturalSoilsD18)
  const totalSoilCO2e =
    (totalN2ODrylandSoil + totalN2OIrrigatedSoil) *
    constants.COMMON.GWP_FACTORSC6;

  // (fracLeach)
  const fracLeach = constants.COMMON.LEACHING.FRACLEACH_MMS;

  // (fracWetMultiplier)
  const fracWetMultiplier = rainfallAbove600 ? 1 : 0; // 2=yes.1=no

  // WARNING: why is * 0.46 now included in other when in other calcs (sb) its not?
  // (agriculturalSoilsD87 to F89)
  const leechingNFertiliserGrazingNonIrrigated =
    fertiliser.pastureDryland * 0.46 * fracWetMultiplier * fracLeach;
  const leechingNFertiliserCroppingNonIrrigated =
    fertiliser.cropsDryland * 0.46 * fracWetMultiplier * fracLeach;

  const leechingNFertiliserOtherNonIrrigated = getLeachingOtherDryland(
    otherFertiliserDryland,
    fracWetMultiplier,
    fracLeach,
  );
  // const leechingNFertiliserGrazingIrrigated =
  //   fertiliser.pastureIrrigated * 0.46 * fracWetMultiplier * fracLeach;
  // const leechingNFertiliserCroppingIrrigated =
  //   fertiliser.cropsIrrigated * 0.46 * fracWetMultiplier * fracLeach;
  // const leechingNFertiliserOtherIrrigated =
  //   fertiliser.otherIrrigated * 0.46 * fracWetMultiplier * fracLeach;

  // (agriculturalSoilsBeefD99 to agriculturalSoilsBeefF101)
  const nFertiliserGrazingNonIrrigated =
    leechingNFertiliserGrazingNonIrrigated *
    constants.LIVESTOCK.LEECHING_AND_RUNOFF *
    constants.COMMON.GWP_FACTORSC15;
  const nFertiliserCroppingNonIrrigated =
    leechingNFertiliserCroppingNonIrrigated *
    constants.LIVESTOCK.LEECHING_AND_RUNOFF *
    constants.COMMON.GWP_FACTORSC15;
  const nFertiliserOtherNonIrrigated =
    leechingNFertiliserOtherNonIrrigated *
    constants.LIVESTOCK.LEECHING_AND_RUNOFF *
    constants.COMMON.GWP_FACTORSC15;
  // const nFertiliserGrazingIrrigated =
  //   leechingNFertiliserGrazingIrrigated *
  //   constants.LEECHING_AND_RUNOFF *
  //   constants.COMMON.GWP_FACTORSC15;
  // const nFertiliserCroppingIrrigated =
  //   leechingNFertiliserCroppingIrrigated *
  //   constants.LEECHING_AND_RUNOFF *
  //   constants.COMMON.GWP_FACTORSC15;
  // const nFertiliserOtherIrrigated =
  //   leechingNFertiliserOtherIrrigated * constants.LEECHING_AND_RUNOFF * constants.COMMON.GWP_FACTORSC15;

  // WARNING: F101:F103 is all hardcoded 0
  // (agriculturalSoilsD104)
  const nFertiliserCropsTotal =
    nFertiliserGrazingNonIrrigated +
    nFertiliserCroppingNonIrrigated +
    nFertiliserOtherNonIrrigated +
    0 +
    0 +
    0;

  // (agriculturalSoilsD92)
  const springDungRunoff = springTotalUrineDung * fracWetMultiplier * fracLeach;
  const summerDungRunoff = summerTotalUrineDung * fracWetMultiplier * fracLeach;
  const autumnDungRunoff = autumnTotalUrineDung * fracWetMultiplier * fracLeach;
  const winterDungRunoff = winterTotalUrineDung * fracWetMultiplier * fracLeach;

  // (agriculturalSoilsD107)
  const springDungN2O =
    springDungRunoff *
    constants.LIVESTOCK.LEECHING_AND_RUNOFF *
    constants.COMMON.GWP_FACTORSC15;
  const summerDungN2O =
    summerDungRunoff *
    constants.LIVESTOCK.LEECHING_AND_RUNOFF *
    constants.COMMON.GWP_FACTORSC15;
  const autumnDungN2O =
    autumnDungRunoff *
    constants.LIVESTOCK.LEECHING_AND_RUNOFF *
    constants.COMMON.GWP_FACTORSC15;
  const winterDungN2O =
    winterDungRunoff *
    constants.LIVESTOCK.LEECHING_AND_RUNOFF *
    constants.COMMON.GWP_FACTORSC15;

  // (agriculturalSoilsBeefD109)
  const totalNDungUrine =
    springDungN2O + summerDungN2O + autumnDungN2O + winterDungN2O;

  // (agriculturalSoilsBeefC111)
  const totalN2OLeechingAndRunoff =
    nFertiliserCropsTotal + totalNDungUrine * 10 ** 3;

  const leechingRunoffN2O =
    totalN2OLeechingAndRunoff * constants.COMMON.GWP_FACTORSC6;

  return {
    atmosphericDepositionN2O:
      totalAtmosphericDeposition + totalAtmosphericNDepositionFertiliser,
    entericCH4,
    manureCH4,
    fertiliserN2O: totalSoilCO2e,
    urineDungN2O: urineDung,
    leechingRunoffN2O,
  };
}
