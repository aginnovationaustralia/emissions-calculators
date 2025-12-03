import { getOtherFertiliserAmounts } from '@/calculators/common/fertiliser';
import { SEASONS, SEASONS_AFTER } from '@/constants/constants';
import { BeefClasses } from '@/types/Beef/beefclasses.input';
import {
  BeefCompleteEmissions,
  BeefIntermediaryEmissions,
} from '@/types/Beef/internal';
import { BeefClassesAPI, Season, State } from '@/types/enums';
import { Fertiliser } from '@/types/fertiliser.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForBeefCalculator } from './constants';
import { getAtmosphericNDepositionUreaIrrigatedTotal } from './functions';

export function beefEmissionsForSeason(
  head: number,
  liveweight: number,
  liveweightGain: number,
  calfMilkIntake: number,
  additionalIntakeForMilkProduction: number,
  dryMatterDigestibility: number,
  crudeProtein: number,
  nitrogenExcretedNumber: number,
  milkProduction: number,
  northofTropicOfCapricorn: boolean,
  context: ExecutionContext<ConstantsForBeefCalculator>,
): BeefIntermediaryEmissions {
  const feedIntake =
    (1.185 +
      0.00454 * liveweight -
      0.0000026 * liveweight ** 2 +
      0.315 * liveweightGain) **
      2 *
    additionalIntakeForMilkProduction; // (entericFermentationBeefS6)

  const dryMatterDigestibilityPercent = dryMatterDigestibility / 100;
  const MEFromDMD = 0.1604 * (dryMatterDigestibilityPercent * 100) - 1.037;
  const nitrogenExcretedInFaeces =
    (0.3 *
      (feedIntake * (crudeProtein / 100)) *
      (1 - (dryMatterDigestibilityPercent * 100 + 10) / 100) +
      0.105 * (MEFromDMD * feedIntake * 0.008) +
      0.0152 * feedIntake) /
      6.25 +
    (0.08 * (0.032 * calfMilkIntake)) / 6.38; // (nitrousOxideMMSBeefS29)
  const seasonalFaecalNitrogenExcreted =
    91.25 * head * nitrogenExcretedInFaeces * 10 ** -6; // (nitrousOxideMMSBeefS55)

  const beefLiveweightGainPerDay = 0; // constant for all beef (nitrousOxideMMSBeefT14)

  const intakeRelativeToMaintenance =
    (feedIntake /
      (1.185 +
        0.00454 * liveweight -
        0.0000026 * liveweight ** 2 +
        0.315 * beefLiveweightGainPerDay) **
        2) *
    additionalIntakeForMilkProduction; // (nitrousOxideMMSBeefS17)

  // (nitrousOxideMMSBeefD45)
  const relativeSize = liveweight / nitrogenExcretedNumber;

  // NOTE: calfMilkIntake is actually milk production (nitrousOxideMMSBeefH30)
  // (nitrousOxideMMSBeefS23)
  const nitrogenRetainedInTheBody =
    (0.032 * milkProduction) / 6.38 +
    ((0.212 -
      0.008 * (intakeRelativeToMaintenance - 2) -
      (0.14 - 0.008 * (intakeRelativeToMaintenance - 2)) /
        (1 + Math.exp(-6 * (relativeSize - 0.4)))) *
      (liveweightGain * 0.92)) /
      6.25;

  // (nitrousOxideMMSBeefS49)
  const nitrogenExcretedInUrine =
    ((crudeProtein / 100) * feedIntake) / 6.25 +
    (calfMilkIntake * 0.032) / 6.38 -
    nitrogenRetainedInTheBody -
    nitrogenExcretedInFaeces -
    (0.00011 * liveweight ** 0.75) / 6.25;

  // (nitrousOxideMMSBeefS61)
  const seasonalUrinaryNitrogenExcreted =
    91.25 * head * nitrogenExcretedInUrine * 10 ** -6;

  // (entericFermentationBeefS20)
  const dailyMethaneYield = (20.7 * feedIntake) / 1000;
  // (entericFermentationBeefS26)
  const totalCH4Production = 91.25 * head * dailyMethaneYield * 10 ** -6;

  // (manureManagementBeefC27)
  const animalsInWarmClimate = northofTropicOfCapricorn ? 1 : 0;
  // (manureManagementBeefC30)
  const animalsInTemperateClimate = 1 - animalsInWarmClimate;

  // (manureManagementBeefD34)
  const methaneProductionFromManure =
    feedIntake *
    (1 - dryMatterDigestibilityPercent) *
    (animalsInWarmClimate * context.constants.LIVESTOCK.METHANE_WARM_EF +
      animalsInTemperateClimate *
        context.constants.LIVESTOCK.METHANE_TEMPERATE_EF);

  // (manureManagementBeefD41)
  const manureCH4 = head * methaneProductionFromManure * 91.25 * 10 ** -6;

  return {
    urine: seasonalUrinaryNitrogenExcreted,
    faeces: seasonalFaecalNitrogenExcreted,
    intermediate: {
      actualIntake: feedIntake,
      seasonalMethaneProduction: 0,
      totalCH4Production,
      manureCH4,
    },
  };
}

export type BeefSeasonEmissions = BeefIntermediaryEmissions & {
  N2O: number;
};

const emptySeason: BeefSeasonEmissions = {
  urine: 0,
  faeces: 0,
  intermediate: {
    actualIntake: 0,
    seasonalMethaneProduction: 0,
    totalCH4Production: 0,
    manureCH4: 0,
  },
  N2O: 0,
};

const EMPTY_INTERNAL_TOTALS: Record<Season, BeefSeasonEmissions> = {
  spring: emptySeason,
  summer: emptySeason,
  autumn: emptySeason,
  winter: emptySeason,
};

export function calculateCompleteBeefEmissions(
  beef: BeefClasses,
  state: State,
  fertiliser: Fertiliser,
  propertyNorthOfTropicOfCapricorn: boolean,
  rainfallAbove600: boolean,
  percentCowsCalving: {
    [season in Season]: number;
  },
  context: ExecutionContext<ConstantsForBeefCalculator>,
): BeefCompleteEmissions {
  const { constants, checkpoint } = context;

  const totals: Record<
    (typeof BeefClassesAPI)[number],
    {
      [season in Season]: BeefSeasonEmissions;
    }
  > = {
    bullsGt1: { ...EMPTY_INTERNAL_TOTALS },
    steersLt1: { ...EMPTY_INTERNAL_TOTALS },
    steers1To2: { ...EMPTY_INTERNAL_TOTALS },
    steersGt2: { ...EMPTY_INTERNAL_TOTALS },
    cowsGt2: { ...EMPTY_INTERNAL_TOTALS },
    heifersLt1: { ...EMPTY_INTERNAL_TOTALS },
    heifers1To2: { ...EMPTY_INTERNAL_TOTALS },
    heifersGt2: { ...EMPTY_INTERNAL_TOTALS },
    steersGt2Traded: { ...EMPTY_INTERNAL_TOTALS },
    steers1To2Traded: { ...EMPTY_INTERNAL_TOTALS },
    steersLt1Traded: { ...EMPTY_INTERNAL_TOTALS },
    bullsGt1Traded: { ...EMPTY_INTERNAL_TOTALS },
    cowsGt2Traded: { ...EMPTY_INTERNAL_TOTALS },
    heifersLt1Traded: { ...EMPTY_INTERNAL_TOTALS },
    heifers1To2Traded: { ...EMPTY_INTERNAL_TOTALS },
    heifersGt2Traded: { ...EMPTY_INTERNAL_TOTALS },
  };

  const tropic = propertyNorthOfTropicOfCapricorn
    ? 'NORTHOFTROPIC'
    : 'SOUTHOFTROPIC';

  SEASONS.forEach((season) => {
    const crudeProtein = constants.BEEF.CRUDEPROTEIN[season][state];
    const dryMatterDigestibility =
      constants.BEEF.DRYMATTERDIGESTIBILITY[season][state];

    // (entericFermentationBeefC28)
    const lcfaSeason =
      percentCowsCalving[season] *
        constants.BEEF.FEED_ADJUSTMENT.CALVING_SEASON +
      percentCowsCalving[SEASONS_AFTER[season]] *
        constants.BEEF.FEED_ADJUSTMENT.SEASON_AFTER_CALVING;
    // (entericFermentationBeefC29)
    const calfMilkIntakeSeason =
      percentCowsCalving[season] *
        constants.BEEF.MILK_INTAKE[tropic].CALVING_SEASON +
      percentCowsCalving[SEASONS_AFTER[season]] *
        constants.BEEF.MILK_INTAKE[tropic].SEASON_AFTER_CALVING;

    // only for cows > 2 (entericFermentationBeefW14)
    const additionalIntakeForMilkProductionSeason =
      lcfaSeason +
      (1 -
        (percentCowsCalving[season] +
          percentCowsCalving[SEASONS_AFTER[season]]) *
          1);

    BeefClassesAPI.forEach((beefType) => {
      const beefInputType = beef[beefType];

      if (!beefInputType) {
        return;
      }

      const beefSeason = beefInputType[season];

      // (nitrousOxideMMSBeefS45)
      const nitrogenExcretedNumber =
        constants.BEEF.NITROGENEXCRETEDNUMBER[beefType][state];

      const beefSeasonEmissions = beefEmissionsForSeason(
        beefSeason.head,
        beefSeason.liveweight,
        beefSeason.liveweightGain,
        beefType === 'steersLt1' || beefType === 'heifersLt1'
          ? calfMilkIntakeSeason
          : 0,
        beefType === 'cowsGt2' ? additionalIntakeForMilkProductionSeason : 1,
        beefSeason.dryMatterDigestibility ?? dryMatterDigestibility,
        beefSeason.crudeProtein ?? crudeProtein,
        nitrogenExcretedNumber,
        beefType === 'cowsGt2' ? calfMilkIntakeSeason : 0,
        propertyNorthOfTropicOfCapricorn,
        context,
      );

      // for urine and dung
      // (agriculturalSoilsBeefD37)
      const beefSeasonN2O =
        beefSeasonEmissions.faeces *
          constants.BEEF.EF_URINEDUNGDEPOSITED *
          constants.COMMON.GWP_FACTORSC15 +
        beefSeasonEmissions.urine *
          constants.BEEF.EF_URINEDUNGDEPOSITED *
          constants.COMMON.GWP_FACTORSC15;

      totals[beefType] = {
        ...totals[beefType],
        [season]: { ...beefSeasonEmissions, N2O: beefSeasonN2O },
      };
    });
  });

  const allBeefSeasons = Object.values(totals)
    .map((season) => Object.values(season))
    .flat();

  const springTotalUrineDung = Object.values(totals)
    .map((t) => t.spring)
    .reduce((a, b) => a + b.faeces + b.urine, 0);
  const summerTotalUrineDung = Object.values(totals)
    .map((t) => t.summer)
    .reduce((a, b) => a + b.faeces + b.urine, 0);
  const autumnTotalUrineDung = Object.values(totals)
    .map((t) => t.autumn)
    .reduce((a, b) => a + b.faeces + b.urine, 0);
  const winterTotalUrineDung = Object.values(totals)
    .map((t) => t.winter)
    .reduce((a, b) => a + b.faeces + b.urine, 0);

  const springTotalNDepositionUrineDung =
    constants.LIVESTOCK.FRAC_GASM * springTotalUrineDung;
  const summerTotalNDepositionUrineDung =
    constants.LIVESTOCK.FRAC_GASM * summerTotalUrineDung;
  const autumnTotalNDepositionUrineDung =
    constants.LIVESTOCK.FRAC_GASM * autumnTotalUrineDung;
  const winterTotalNDepositionUrineDung =
    constants.LIVESTOCK.FRAC_GASM * winterTotalUrineDung;

  // Gg N2O/farm/year
  // (agriculturalSoilsBeefC42)
  const totalN2ODepositedDuringGrazing = allBeefSeasons.reduce(
    (acc, t) => acc + t.N2O,
    0,
  );
  // Gg CO2-e/farm/year
  // (agriculturalSoilsBeefC43)
  const totalN2ODepositedGg =
    totalN2ODepositedDuringGrazing * constants.COMMON.GWP_FACTORSC6;
  // t CO2-e/farm/year
  // (agriculturalSoilsBeefC44)
  const totalN2ODepositedTonnes = totalN2ODepositedGg * 1000;

  // (entericFermentationBeefR31)
  const totalCH4Production = allBeefSeasons.reduce(
    (acc, t) => acc + t.intermediate.totalCH4Production,
    0,
  );
  const totalCH4ProductionGg =
    totalCH4Production * constants.COMMON.GWP_FACTORSC5;
  const totalCH4ProductionTonnes = totalCH4ProductionGg * 1000;

  // (agriculturalSoilsBeefD57)
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
    constants.COMMON.GWP_FACTORSC15; // (agriculturalSoilsBeefD60)
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
    getAtmosphericNDepositionUreaIrrigatedTotal(
      context,
      atmosphericNDepositionUreaGrazingIrrigated,
      atmosphericNDepositionUreaCroppingIrrigated,
      atmosphericNDepositionUreaOtherIrrigated,
    );

  const agriculturalSoilsBeefO6 = constants.COMMON.GWP_FACTORSC6;

  // (agriculturalSoilsBeefD61)
  const totalAtmosphericNDepositionFertiliser =
    (atmosphericNDepositionUreaDrylandTotal +
      atmosphericNDepositionUreaIrrigatedTotal) *
    agriculturalSoilsBeefO6;

  // (agriculturalSoilsBeefD63)
  const springNDungUrineAtmosphere =
    springTotalNDepositionUrineDung *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE *
    constants.COMMON.GWP_FACTORSC15;
  const summerNDungUrineAtmosphere =
    summerTotalNDepositionUrineDung *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE *
    constants.COMMON.GWP_FACTORSC15;
  const autumnNDungUrineAtmosphere =
    autumnTotalNDepositionUrineDung *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE *
    constants.COMMON.GWP_FACTORSC15;
  const winterNDungUrineAtmosphere =
    winterTotalNDepositionUrineDung *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE *
    constants.COMMON.GWP_FACTORSC15;

  // Gg N2O/farm/year
  // (agriculturalSoilsBeefD68)
  const totalN2O =
    springNDungUrineAtmosphere +
    summerNDungUrineAtmosphere +
    autumnNDungUrineAtmosphere +
    winterNDungUrineAtmosphere;

  // Gg CO2-e/farm/year
  const totalN2OGg = totalN2O * constants.COMMON.GWP_FACTORSC6;
  // t CO2-e/farm/year
  // (agriculturalSoilsBeefD70)
  const totalN2OTonnes = totalN2OGg * 10 ** 3;

  // (dataSummaryC13)
  const atmosphericDeposition =
    totalAtmosphericNDepositionFertiliser + totalN2OTonnes;

  // manureManagementCH4

  // (manureManagementBeefC46)
  const totalCH4FromManure = allBeefSeasons.reduce(
    (acc, t) => acc + t.intermediate.manureCH4,
    0,
  );

  // (manureManagementBeefC47)
  const totalCH4Gg = totalCH4FromManure * constants.COMMON.GWP_FACTORSC5;

  // (manureManagementBeefC48)
  const manureCH4 = totalCH4Gg * 1000;

  // Leeching and runoff

  // (fracLeach)
  const fracLeach = constants.COMMON.LEACHING.FRACLEACH_FERTILISER_SOILS;

  // (fracWetMultiplier)
  const fracWetMultiplier = rainfallAbove600 ? 1 : 0;

  // (agriculturalSoilsBeefD86 to F88)
  const leechingNFertiliserGrazingNonIrrigated =
    fertiliser.pastureDryland * 0.46 * fracWetMultiplier * fracLeach;
  const leechingNFertiliserCroppingNonIrrigated =
    fertiliser.cropsDryland * 0.46 * fracWetMultiplier * fracLeach;
  const leechingNFertiliserOtherNonIrrigated =
    otherFertiliserDryland * fracWetMultiplier * fracLeach;
  const leechingNFertiliserGrazingIrrigated =
    fertiliser.pastureIrrigated * 0.46 * fracWetMultiplier * fracLeach;
  const leechingNFertiliserCroppingIrrigated =
    fertiliser.cropsIrrigated * 0.46 * fracWetMultiplier * fracLeach;
  const leechingNFertiliserOtherIrrigated =
    otherFertiliserIrrigated * fracWetMultiplier * fracLeach;

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
  const nFertiliserGrazingIrrigated =
    leechingNFertiliserGrazingIrrigated *
    constants.LIVESTOCK.LEECHING_AND_RUNOFF *
    constants.COMMON.GWP_FACTORSC15;
  const nFertiliserCroppingIrrigated =
    leechingNFertiliserCroppingIrrigated *
    constants.LIVESTOCK.LEECHING_AND_RUNOFF *
    constants.COMMON.GWP_FACTORSC15;
  const nFertiliserOtherIrrigated =
    leechingNFertiliserOtherIrrigated *
    constants.LIVESTOCK.LEECHING_AND_RUNOFF *
    constants.COMMON.GWP_FACTORSC15;

  // (agriculturalSoilsBeefD102)
  const nFertiliserCropsTotal =
    nFertiliserGrazingNonIrrigated +
    nFertiliserCroppingNonIrrigated +
    nFertiliserOtherNonIrrigated +
    nFertiliserGrazingIrrigated +
    nFertiliserCroppingIrrigated +
    nFertiliserOtherIrrigated;

  // (agriculturalSoilsBeefD91)
  const springDungRunoff = springTotalUrineDung * fracWetMultiplier * fracLeach;
  const summerDungRunoff = summerTotalUrineDung * fracWetMultiplier * fracLeach;
  const autumnDungRunoff = autumnTotalUrineDung * fracWetMultiplier * fracLeach;
  const winterDungRunoff = winterTotalUrineDung * fracWetMultiplier * fracLeach;

  // (agriculturalSoilsBeefD105)
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

  checkpoint?.('Agricultural soils - beef', {
    leechingNFertiliserGrazingNonIrrigated: {
      cell: 'D86',
      value: leechingNFertiliserGrazingNonIrrigated,
    },
    nFertiliserCropsTotal: {
      cell: 'D102',
      value: nFertiliserCropsTotal,
    },
    totalNDungUrine: {
      cell: 'D109',
      value: totalNDungUrine,
    },
    totalN2OLeechingAndRunoff: {
      cell: 'C111',
      value: totalN2OLeechingAndRunoff,
    },
  });

  const leechingRunoffN2O =
    totalN2OLeechingAndRunoff * constants.COMMON.GWP_FACTORSC6;

  // (agriculturalSoilsBeefD14)
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
  // NOTE: other doesn't have * 0.46
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
  const nFertiliserOtherIrrigatedSoil =
    otherFertiliserIrrigated *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_IRRIGATEDCROP *
    constants.COMMON.GWP_FACTORSC15;

  // (agriculturalSoilsBeefD17)
  const totalN2ODrylandSoil =
    nFertiliserGrazingDrylandSoil +
    nFertiliserCroppingDrylandSoil +
    nFertiliserOtherDrylandSoil;
  const totalN2OIrrigatedSoil =
    nFertiliserGrazingIrrigatedSoil +
    nFertiliserCroppingIrrigatedSoil +
    nFertiliserOtherIrrigatedSoil;

  // (agriculturalSoilsBeefD18)
  const totalSoilCO2e =
    (totalN2ODrylandSoil + totalN2OIrrigatedSoil) *
    constants.COMMON.GWP_FACTORSC6;

  return {
    leechingRunoffN2O,
    atmosphericDepositionN2O: atmosphericDeposition,
    urineAndDungN2O: totalN2ODepositedTonnes,
    manureManagementCH4: manureCH4,
    entericCH4: totalCH4ProductionTonnes,
    fertiliserN2O: totalSoilCO2e,
    intermediate: {
      totalAtmosphericNDepositionFertiliser,
      totalN2OTonnes,
    },
  };
}
