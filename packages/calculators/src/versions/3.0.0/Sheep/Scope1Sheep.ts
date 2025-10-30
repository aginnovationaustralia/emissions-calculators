import { getOtherFertiliserAmounts } from '../common/fertiliser';
import { SEASONS } from '../constants/constants';
import { ExecutionContext } from '../executionContext';
import { Fertiliser } from '../types/fertiliser.input';
import { EwesLambing } from '../types/Sheep/eweslambing.input';
import {
  SheepCompleteEmissions,
  SheepIntermediaryEmissions,
} from '../types/Sheep/internal';
import { SeasonalLambing } from '../types/Sheep/seasonallambing.input';
import { SheepClasses } from '../types/Sheep/sheepclasses.input';
import { Season, SheepClassesAPI, State } from '../types/types';
import { ConstantsForSheepCalculator } from './constants';
import { getMilkIntake, getNFertiliserUreaOtherIrrigated } from './functions';

/**
 * This calculates intermediary emissions for any type of sheep.
 * @param head Number of head, same as livestock number
 * @param liveweight Liveweight in kg/head
 * @param liveweightGain Liveweight gain in kg/day
 * @param woolShornKgHead Wool shorn in kg/head
 * @param cleanWoolYield Clean wool yield in %
 * @param standardWeight Standard weight constant for this type of sheep
 * @param dryMatterDigestibility Dry matter digestibility constant for this type of sheep
 * @param feedAvailability Feed availability constant for this type of sheep
 * @param crudeProtein Crude protein constant for this type of sheep
 * @returns
 */
export function sheepEmissionsForSeason(
  season: string,
  sheepType: (typeof SheepClassesAPI)[number],
  head: number,
  liveweight: number,
  liveweightGain: number,
  woolShornKgHead: number,
  cleanWoolYield: number,
  standardWeight: number,
  dryMatterDigestibility: number,
  feedAvailability: number,
  crudeProtein: number,
  milkIntake: number,
  milkProduction: number,
  proportionLactating: number,
  context: ExecutionContext<ConstantsForSheepCalculator>,
): SheepIntermediaryEmissions {
  // Enteric sheep D15:D18
  const metabolismOfDiet = 0.00795 * dryMatterDigestibility - 0.0014;

  const potentialIntake =
    ((104.7 * metabolismOfDiet + 0.307 * liveweight - 15) *
      liveweight ** 0.75) /
    1000;

  const milkFeedAdjustment = 1.3;
  const additionalIntakeForMilk =
    milkProduction > 0
      ? proportionLactating * milkFeedAdjustment + (1 - proportionLactating) * 1
      : 1;

  const relativeIntake = 1 - Math.exp(-2 * feedAvailability ** 2);
  const actualIntake =
    sheepType === 'breedingEwes'
      ? additionalIntakeForMilk * potentialIntake * relativeIntake
      : potentialIntake * relativeIntake;

  // (entericFermentationSheepR35)
  const methaneProduction = actualIntake * 0.0188 + 0.00158;
  const seasonalMethaneProduction = 91.25 * head * methaneProduction * 10 ** -6;

  const crudeProteinIntake =
    actualIntake * (crudeProtein / 100) + 0.045 * milkIntake; // (nitrousOxideMMSSheepS7)
  const metabolisableEnergy = 0.1604 * dryMatterDigestibility - 1.037; // (nitrousOxideMMSSheepD25)
  const nitrogenExcretedInFaeces =
    (0.3 * (crudeProteinIntake * (1 - (dryMatterDigestibility + 10) / 100)) +
      0.105 * (metabolisableEnergy * actualIntake * 0.008) +
      0.08 * (0.045 * milkIntake) +
      0.0152 * actualIntake) /
    6.25; // (nitrousOxideMMSSheepS33)
  const seasonalFaecalNExcreted =
    head * nitrogenExcretedInFaeces * 91.25 * 10 ** -6;

  const woolProduction = (woolShornKgHead * (cleanWoolYield / 100)) / 365;
  const emptyBodyGain = liveweightGain * 0.92;

  const relativeSize = liveweight / standardWeight;

  const usedMilkProduction = sheepType === 'breedingEwes' ? milkProduction : 0;

  const nitrogenRetainedInBody =
    (0.045 * usedMilkProduction +
      woolProduction * 0.84 +
      ((212 -
        4 * ((emptyBodyGain * 1000) / (4 * standardWeight ** 0.75) - 1) -
        (140 -
          4 * ((emptyBodyGain * 1000) / (4 * standardWeight ** 0.75) - 1)) /
          (1 + Math.exp(-6 * (relativeSize - 0.4)))) *
        emptyBodyGain) /
        1000) /
    6.25;

  const nExcretedUrine =
    crudeProteinIntake / 6.25 -
    nitrogenRetainedInBody -
    nitrogenExcretedInFaeces; // (nitrousOxideMMSSheepS39)

  const seasonalNitrogenUrinaryExcreted =
    head * nExcretedUrine * 91.25 * 10 ** -6; // (nitrousOxideMMSSheepS51)

  // these were from a different part of the spreadsheet than above
  // manure management
  // actual intake

  // (manureManagementSheepD20)
  const methaneProductionFromManure =
    actualIntake *
    (1 - dryMatterDigestibility / 100) *
    context.constants.COMMON.EF_TEMPERATURE;

  // (manureManagementSheepD26)
  const seasonalMethaneProductionManure =
    head * methaneProductionFromManure * 91.25 * 10 ** -6;

  return {
    urine: seasonalNitrogenUrinaryExcreted,
    faeces: seasonalFaecalNExcreted,
    intermediate: {
      actualIntake,
      seasonalMethaneProductionManure,
      seasonalMethaneProduction,
    },
  };
}

type SheepSeasonEmissions = SheepIntermediaryEmissions & {
  N2O: number;
};

const emptySeason: SheepSeasonEmissions = {
  urine: 0,
  faeces: 0,
  intermediate: {
    actualIntake: 0,
    seasonalMethaneProduction: 0,
    seasonalMethaneProductionManure: 0,
  },
  N2O: 0,
};

const EMPTY_INTERNAL_TOTALS: Record<Season, SheepSeasonEmissions> = {
  spring: emptySeason,
  summer: emptySeason,
  autumn: emptySeason,
  winter: emptySeason,
};

/**
 *
 * @param sheep
 * @param state
 * @param fertiliser (dataInputSheepD96 to dataInputSheepF98)
 * @param rainfallAbove600 (dataInputSheepE6)
 * @returns
 */
export function calculateCompleteSheepEmissions(
  sheep: SheepClasses,
  state: State,
  fertiliser: Fertiliser,
  rainfallAbove600: boolean,
  ewesLambing: EwesLambing,
  lambingRates: SeasonalLambing,
  context: ExecutionContext<ConstantsForSheepCalculator>,
): SheepCompleteEmissions {
  const totals: {
    [sheepType in (typeof SheepClassesAPI)[number]]: Record<
      Season,
      SheepSeasonEmissions
    >;
  } = {
    rams: { ...EMPTY_INTERNAL_TOTALS },
    wethers: { ...EMPTY_INTERNAL_TOTALS },
    maidenBreedingEwes: { ...EMPTY_INTERNAL_TOTALS },
    breedingEwes: { ...EMPTY_INTERNAL_TOTALS },
    otherEwes: { ...EMPTY_INTERNAL_TOTALS },
    eweLambs: { ...EMPTY_INTERNAL_TOTALS },
    wetherLambs: { ...EMPTY_INTERNAL_TOTALS },
    tradeLambsAndHoggets: { ...EMPTY_INTERNAL_TOTALS },
    tradeWethers: { ...EMPTY_INTERNAL_TOTALS },
    tradeEwes: { ...EMPTY_INTERNAL_TOTALS },
    tradeRams: { ...EMPTY_INTERNAL_TOTALS },
    tradeMaidenBreedingEwes: { ...EMPTY_INTERNAL_TOTALS },
    tradeBreedingEwes: { ...EMPTY_INTERNAL_TOTALS },
    tradeOtherEwes: { ...EMPTY_INTERNAL_TOTALS },
    tradeEweLambs: { ...EMPTY_INTERNAL_TOTALS },
    tradeWetherLambs: { ...EMPTY_INTERNAL_TOTALS },
  };

  const { constants } = context;

  SEASONS.forEach((season) => {
    // also known as dry matter availability
    const feedAvailability = constants.SHEEP.FEEDAVAILABILITY[season][state];
    const crudeProtein = constants.SHEEP.CRUDEPROTEIN[season][state];
    const dryMatterDigestibility =
      constants.SHEEP.DRYMATTERDIGESTIBILITY[season][state];

    const breedingEwes = sheep.breedingEwes[season];
    const eweLambs = sheep.eweLambs[season];
    const wetherLambs = sheep.wetherLambs[season];

    const ewesHead = breedingEwes.head;
    const eweLambsHead = eweLambs.head;
    const wetherLambsHead = wetherLambs.head;
    const totalLambsHead = eweLambsHead + wetherLambsHead;

    /**
     * NOTE:
     * The proportion of lactating ewes shouldn't exceed 1.
     * As of 2.0.0, we enforce a maximum of 1 on the seasonal rates of
     * ewes lambing.
     */
    const proportionLactating =
      ewesLambing[season] * Math.min(lambingRates[season], 1);
    const milkProduced = proportionLactating * 1.6;

    SheepClassesAPI.forEach((sheepType) => {
      const sheepInputType = sheep[sheepType];
      if (!sheepInputType) {
        return;
      }

      const sheepSeason = sheepInputType[season];

      const milkIntake =
        sheepType === 'eweLambs' || sheepType === 'wetherLambs'
          ? getMilkIntake(milkProduced, ewesHead, totalLambsHead)
          : 0;

      const sheepSeasonEmissions = sheepEmissionsForSeason(
        season,
        sheepType,
        sheepSeason.head,
        sheepSeason.liveweight,
        sheepSeason.liveweightGain,
        sheepInputType.woolShorn,
        sheepInputType.cleanWoolYield,
        constants.SHEEP.STANDARDWEIGHT[sheepType][state],
        sheepSeason.dryMatterDigestibility ?? dryMatterDigestibility,
        sheepSeason.feedAvailability ?? feedAvailability,
        sheepSeason.crudeProtein ?? crudeProtein,
        milkIntake,
        proportionLactating * 1.6,
        proportionLactating,
        context,
      );

      // (agriculturalSoilsSheepD35)
      const sheepSeasonN2O =
        sheepSeasonEmissions.faeces *
          constants.SHEEP.EF_URINEDUNGDEPOSITED *
          constants.COMMON.GWP_FACTORSC15 +
        sheepSeasonEmissions.urine *
          constants.SHEEP.EF_URINEDUNGDEPOSITED *
          constants.COMMON.GWP_FACTORSC15;

      totals[sheepType] = {
        ...totals[sheepType],
        [season]: { ...sheepSeasonEmissions, N2O: sheepSeasonN2O },
      };
    });
  });

  const allSheepClass = Object.values(totals)
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

  // TODO: cleanup this mess
  // this is just urine + faeces for every type of sheep
  const springTotalNDungUrine =
    constants.LIVESTOCK.FRAC_GASM * springTotalUrineDung;
  const summerTotalNDungUrine =
    constants.LIVESTOCK.FRAC_GASM * summerTotalUrineDung;
  const autumnTotalNDungUrine =
    constants.LIVESTOCK.FRAC_GASM * autumnTotalUrineDung;
  const winterTotalNDungUrine =
    constants.LIVESTOCK.FRAC_GASM * winterTotalUrineDung;

  const { otherFertiliserDryland, otherFertiliserIrrigated } =
    getOtherFertiliserAmounts(context, fertiliser);

  // TODO: pull this out into separate function as its used in beef too
  // (agriculturalSoilsSheepD14)
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
  const nFertiliserOtherIrrigatedSoil =
    otherFertiliserIrrigated *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_IRRIGATEDCROP *
    constants.COMMON.GWP_FACTORSC15;
  // (agriculturalSoilsSheepD17)
  const totalN2ODrylandSoil =
    nFertiliserGrazingDrylandSoil +
    nFertiliserCroppingDrylandSoil +
    nFertiliserOtherDrylandSoil;
  const totalN2OIrrigatedSoil =
    nFertiliserGrazingIrrigatedSoil +
    nFertiliserCroppingIrrigatedSoil +
    nFertiliserOtherIrrigatedSoil;
  // (agriculturalSoilsSheepD18)
  const totalSoilCO2e =
    (totalN2ODrylandSoil + totalN2OIrrigatedSoil) *
    constants.COMMON.GWP_FACTORSC6;

  const fracWetMultiplier = rainfallAbove600 ? 1 : 0; // (agriculturalSoilsSheepF83)
  const fracLeach = constants.COMMON.LEACHING.FRACLEACH_FERTILISER_SOILS;

  // (agriculturalSoilsSheepD57)
  const nUreaGrazingDryland =
    fertiliser.pastureDryland *
    0.46 *
    constants.LIVESTOCK.INOGRANICFERTILISER_ATMOSPHERIC_N;
  const nUreaCroppingDryland =
    fertiliser.cropsDryland *
    0.46 *
    constants.LIVESTOCK.INOGRANICFERTILISER_ATMOSPHERIC_N;
  const nOtherNDryland =
    otherFertiliserDryland *
    constants.LIVESTOCK.INOGRANICFERTILISER_ATMOSPHERIC_N;

  const totalN2ODryland =
    (nUreaGrazingDryland + nUreaCroppingDryland + nOtherNDryland) *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE *
    constants.COMMON.GWP_FACTORSC15;

  const nUreaGrazingIrrigated =
    fertiliser.pastureIrrigated *
    0.46 *
    constants.LIVESTOCK.INOGRANICFERTILISER_ATMOSPHERIC_N;
  const nUreaCroppingIrrigated =
    fertiliser.cropsIrrigated *
    0.46 *
    constants.LIVESTOCK.INOGRANICFERTILISER_ATMOSPHERIC_N;
  const nUreaOtherNIrrigated =
    otherFertiliserIrrigated *
    constants.LIVESTOCK.INOGRANICFERTILISER_ATMOSPHERIC_N;

  const totalN2OIrrigated =
    (nUreaGrazingIrrigated *
      constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_IRRIGATEDPASTURE +
      nUreaCroppingIrrigated *
        constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_IRRIGATEDCROP +
      nUreaOtherNIrrigated *
        constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_IRRIGATEDCROP) *
    constants.COMMON.GWP_FACTORSC15;

  // (agriculturalSoilsSheepD61)
  const totalCO2e =
    (totalN2ODryland + totalN2OIrrigated) * constants.COMMON.GWP_FACTORSC6;

  // (agriculturalSoilsSheepD64)
  const springNDungUrine =
    springTotalNDungUrine *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE *
    constants.COMMON.GWP_FACTORSC15;
  const summerNDungUrine =
    summerTotalNDungUrine *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE *
    constants.COMMON.GWP_FACTORSC15;
  const autumnNDungUrine =
    autumnTotalNDungUrine *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE *
    constants.COMMON.GWP_FACTORSC15;
  const winterNDungUrine =
    winterTotalNDungUrine *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE *
    constants.COMMON.GWP_FACTORSC15;

  // total N2O from atmospheric deposition
  // (agriculturalSoilsSheepD70)
  const totalN2OAtmosphereGg =
    (springNDungUrine +
      summerNDungUrine +
      autumnNDungUrine +
      winterNDungUrine) *
    constants.COMMON.GWP_FACTORSC6;
  // (agriculturalSoilsSheepD71)
  const totalN2OAtmosphereTonnes = totalN2OAtmosphereGg * 10 ** 3;
  // (dataSummaryD13)
  const totalAtmosphere = totalCO2e + totalN2OAtmosphereTonnes;

  // total N2O from urine and dung for all
  // (agriculturalSoilsSheepD40)
  const totalN2O = allSheepClass.reduce((a, b) => a + b.N2O, 0);
  const totalN2OUrineDungGg = totalN2O * constants.COMMON.GWP_FACTORSC6;
  // (agriculturalSoilsSheepD42)
  const totalN2OUrineDungTonnes = totalN2OUrineDungGg * 10 ** 3;

  // (manureManagementSheepC31)
  const totalMethaneManure = allSheepClass.reduce(
    (a, b) => a + b.intermediate.seasonalMethaneProductionManure,
    0,
  ); //  Gg CH4/farm/year
  const totalMethaneManureGg =
    totalMethaneManure * constants.COMMON.GWP_FACTORSC5; // Gg CO2-e/farm/year
  // (manureManagementSheepC33)
  const totalMethaneManureTonnes = totalMethaneManureGg * 10 ** 3; // t CO2-e/farm/year

  // (entericFermentationSheepQ46)
  const totalMethane = allSheepClass.reduce(
    (a, b) => a + b.intermediate.seasonalMethaneProduction,
    0,
  ); //  Gg CH4/farm/year
  const totalMethaneGg = totalMethane * constants.COMMON.GWP_FACTORSC5; // Gg CO2-e/farm/year
  // (entericFermentationSheepQ48)
  const totalMethaneTonnes = totalMethaneGg * 10 ** 3; // t CO2-e/farm/year

  // ------------

  // same name as above... (agriculturalSoilsSheepD87)
  const nFertiliserUreaGrazingNonIrrigated =
    fertiliser.pastureDryland * 0.46 * fracWetMultiplier * fracLeach;
  const nFertiliserUreaCroppingNonIrrigated =
    fertiliser.cropsDryland * 0.46 * fracWetMultiplier * fracLeach;
  const nFertiliserUreaOtherNonIrrigated =
    otherFertiliserDryland * fracWetMultiplier * fracLeach;
  const nFertiliserUreaGrazingIrrigated =
    fertiliser.pastureIrrigated * 0.46 * fracWetMultiplier * fracLeach;
  const nFertiliserUreaCroppingIrrigated =
    fertiliser.cropsIrrigated * 0.46 * fracWetMultiplier * fracLeach;
  const nFertiliserUreaOtherIrrigated = getNFertiliserUreaOtherIrrigated(
    otherFertiliserIrrigated,
    fracWetMultiplier,
    fracLeach,
  );

  // The mass of dung and urine N applied to soils that is lost through leaching and runoff (M)
  // (agriculturalSoilsSheepD92)
  const springDungRunoff = springTotalUrineDung * fracWetMultiplier * fracLeach;
  const summerDungRunoff = summerTotalUrineDung * fracWetMultiplier * fracLeach;
  const autumnDungRunoff = autumnTotalUrineDung * fracWetMultiplier * fracLeach;
  const winterDungRunoff = winterTotalUrineDung * fracWetMultiplier * fracLeach;

  // total N2O from leeching and runoff
  // (agriculturalSoilsSheepD101)
  const ureaGrazingNonIrrigatedN2O =
    nFertiliserUreaGrazingNonIrrigated *
    constants.LIVESTOCK.LEECHING_AND_RUNOFF *
    constants.COMMON.GWP_FACTORSC15;
  const ureaCroppingNonIrrigatedN2O =
    nFertiliserUreaCroppingNonIrrigated *
    constants.LIVESTOCK.LEECHING_AND_RUNOFF *
    constants.COMMON.GWP_FACTORSC15;
  const ureaOtherNonIrrigatedN2O =
    nFertiliserUreaOtherNonIrrigated *
    constants.LIVESTOCK.LEECHING_AND_RUNOFF *
    constants.COMMON.GWP_FACTORSC15;
  const ureaGrazingIrrigatedN2O =
    nFertiliserUreaGrazingIrrigated *
    constants.LIVESTOCK.LEECHING_AND_RUNOFF *
    constants.COMMON.GWP_FACTORSC15;
  const ureaCroppingIrrigatedN2O =
    nFertiliserUreaCroppingIrrigated *
    constants.LIVESTOCK.LEECHING_AND_RUNOFF *
    constants.COMMON.GWP_FACTORSC15;
  const ureaOtherIrrigatedN2O =
    nFertiliserUreaOtherIrrigated *
    constants.LIVESTOCK.LEECHING_AND_RUNOFF *
    constants.COMMON.GWP_FACTORSC15;

  // (agriculturalSoilsSheepD104)
  const totalFertiliserN2OLeeching =
    ureaGrazingNonIrrigatedN2O +
    ureaCroppingNonIrrigatedN2O +
    ureaOtherNonIrrigatedN2O +
    ureaGrazingIrrigatedN2O +
    ureaCroppingIrrigatedN2O +
    ureaOtherIrrigatedN2O;

  // (agriculturalSoilsSheepD107)
  const springN2ODungLeeching =
    springDungRunoff *
    constants.LIVESTOCK.LEECHING_AND_RUNOFF *
    constants.COMMON.GWP_FACTORSC15;
  const summerN2ODungLeeching =
    summerDungRunoff *
    constants.LIVESTOCK.LEECHING_AND_RUNOFF *
    constants.COMMON.GWP_FACTORSC15;
  const autumnN2ODungLeeching =
    autumnDungRunoff *
    constants.LIVESTOCK.LEECHING_AND_RUNOFF *
    constants.COMMON.GWP_FACTORSC15;
  const winterN2ODungLeeching =
    winterDungRunoff *
    constants.LIVESTOCK.LEECHING_AND_RUNOFF *
    constants.COMMON.GWP_FACTORSC15;

  // (agriculturalSoilsSheepD111)
  const totalN2ODungLeeching =
    springN2ODungLeeching +
    summerN2ODungLeeching +
    autumnN2ODungLeeching +
    winterN2ODungLeeching;

  // (agriculturalSoilsSheepD113)
  const totalN2OLeeching =
    totalFertiliserN2OLeeching + totalN2ODungLeeching * 1000;

  // (agriculturalSoilsSheepD115, dataSummaryD14)
  const totalN2OLeechingGg = totalN2OLeeching * constants.COMMON.GWP_FACTORSC6;

  return {
    leechingRunoffN2O: totalN2OLeechingGg,
    atmosphericDepositionN2O: totalAtmosphere,
    urineAndDungN2O: totalN2OUrineDungTonnes,
    manureManagementCH4: totalMethaneManureTonnes,
    entericCH4: totalMethaneTonnes,
    fertiliserN2O: totalSoilCO2e,
    intermediate: {
      totalCO2e,
    },
  };
}
