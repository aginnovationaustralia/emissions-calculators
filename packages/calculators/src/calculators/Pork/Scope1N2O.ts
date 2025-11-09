import { PORK_CLASSES, SEASONS } from '@/constants/constants';
import { Fertiliser } from '@/types/fertiliser.input';
import { LivestockManure } from '@/types/livestockManure.input';
import {
  ManureManagementSystem,
  ManureManagementSystems,
  PorkClass,
  Season,
  State,
} from '@/types/types';
import { ObjectEntry } from 'type-fest/source/entry';
import { getOtherFertiliserAmounts } from '../../calculators/common/fertiliser';
import { divideBySafeFromZero } from '../common/tools';
import { entriesFromObject } from '../common/tools/object';
import { ExecutionContext } from '../executionContext';
import { ConstantsForPorkCalculator } from './constants';
import { getNFertiliserOtherDryland } from './functions';

function calculateAnnualNitrogenFromManureAndWaste(
  type: PorkClass,
  head: number,
  context: ExecutionContext<ConstantsForPorkCalculator>,
) {
  const { constants } = context;

  const newType = (
    ['sows', 'boars', 'gilts'].includes(type) ? type : 'slaughter_pigs'
  ) as 'sows' | 'boars' | 'gilts' | 'slaughter_pigs';

  const swineManure = constants.PORK.MANURE_NITROGEN[newType];

  //
  //
  // CALCULATE ANNUAL NITROGEN FROM MANURE AND WASTE - Nitrous Oxide_MMS

  // Annual nitrogen from swine manure and waste feed (AE)
  // AE = N x E x 10^-6
  //  N = number of pigs
  //  E = nitrogen in waste (kg/head/year)

  const N = head;
  const E = swineManure / 4;

  const annualNitrogenFromManureAndWaste = N * E * 10 ** -6;

  return annualNitrogenFromManureAndWaste;
}
// END CALCULATE ANNUAL NITROGEN FROM MANURE AND WASTE - Nitrous Oxide_MMS
//
//

const EMPTY_INTERNAL_TOTALS = {
  spring: {
    annualNitrogen: 0,
    annualIndirectNitrogen: 0,
  },
  summer: {
    annualNitrogen: 0,
    annualIndirectNitrogen: 0,
  },
  autumn: {
    annualNitrogen: 0,
    annualIndirectNitrogen: 0,
  },
  winter: {
    annualNitrogen: 0,
    annualIndirectNitrogen: 0,
  },
};

const emptyManureSystems: Record<ManureManagementSystem, number> = {
  coveredAnaerobicPond: 0,
  uncoveredAnaerobicPond: 0,
  deepLitter: 0,
  outdoorSystems: 0,
  undefinedSystem: 0,
};

const emptyByTypeAndSystem: Record<
  PorkClass,
  Record<ManureManagementSystem, number>
> = {
  sows: { ...emptyManureSystems },
  boars: { ...emptyManureSystems },
  gilts: { ...emptyManureSystems },
  suckers: { ...emptyManureSystems },
  weaners: { ...emptyManureSystems },
  growers: { ...emptyManureSystems },
  slaughter_pigs: { ...emptyManureSystems },
};

type PorkSeasonNumber = {
  [porkType in PorkClass]?: {
    summer: number;
    autumn: number;
    winter: number;
    spring: number;
    manure: LivestockManure;
  };
};

type PorkSeasonNitrogen = {
  [porkType in PorkClass]: {
    [season in Season]: {
      annualNitrogen: number;
      annualIndirectNitrogen: number;
    };
  };
};

/**
 * @param manure the complete LivestockManure object
 * @param season the season
 * @returns the total manure for the season, across all systems
 */
const getTotalManureForSeason = (manure: LivestockManure, season: Season) => {
  return ManureManagementSystems.reduce((acc, system) => {
    return acc + (manure[season][system] ?? 0);
  }, 0);
};

/**
 * @param manure the complete LivestockManure object
 * @param system the manure management system
 * @returns the total manure for the system, across all seasons
 */
const getTotalManureForSystem = (
  manure: LivestockManure,
  system: ManureManagementSystem,
) => {
  return entriesFromObject(manure).reduce((acc, [, season]) => {
    return acc + (season[system] ?? 0);
  }, 0);
};

/** Sum all manure for all systems across all seasons
 * @param manure the complete LivestockManure object
 * @returns the total manure, across all systems and seasons
 */
const getTotalManureTonnes = (manure: LivestockManure) => {
  return ManureManagementSystems.reduce((acc, system) => {
    return acc + getTotalManureForSystem(manure, system);
  }, 0);
};

const isPorkClassWithDetailedEmissions = (
  porkClass: PorkClass,
): porkClass is 'sows' | 'boars' | 'gilts' =>
  ['sows', 'boars', 'gilts'].includes(porkClass);

const getSeasonNitrogenFromManureAndFeed = (
  classes: PorkSeasonNumber,
  porkClass: PorkClass,
  constants: ConstantsForPorkCalculator,
  season: Season,
) => {
  const E = isPorkClassWithDetailedEmissions(porkClass)
    ? constants.PORK.MANURE_NITROGEN[porkClass]
    : constants.PORK.MANURE_NITROGEN.slaughter_pigs;

  const headForSeason = classes[porkClass]?.[season] ?? 0;
  const amountForSeason = headForSeason * (E / 4) * 10 ** -6;

  return amountForSeason;
};

const getTotalNitrogenFromManureAndFeed = (
  classes: PorkSeasonNumber,
  porkClass: PorkClass,
  constants: ConstantsForPorkCalculator,
) => {
  let result = 0;

  SEASONS.forEach((season) => {
    result += getSeasonNitrogenFromManureAndFeed(
      classes,
      porkClass,
      constants,
      season,
    );
  });

  return result;
};

/**
 * The `others` from `fertiliser` is not used as it is already inside
 * `otherFertilisers`
 * @param state
 * @param head
 * @param fertiliser
 * @param otherFertilisers
 * @returns
 */
export function calculateScope1N2O(
  state: State,
  head: PorkSeasonNumber,
  fertiliser: Fertiliser,
  rainfallAbove600: boolean,
  context: ExecutionContext<ConstantsForPorkCalculator>,
) {
  const { constants } = context;

  const totals: PorkSeasonNitrogen = {
    sows: { ...EMPTY_INTERNAL_TOTALS },
    boars: { ...EMPTY_INTERNAL_TOTALS },
    gilts: { ...EMPTY_INTERNAL_TOTALS },
    suckers: { ...EMPTY_INTERNAL_TOTALS },
    weaners: { ...EMPTY_INTERNAL_TOTALS },
    growers: { ...EMPTY_INTERNAL_TOTALS },
    slaughter_pigs: { ...EMPTY_INTERNAL_TOTALS },
  };

  //
  //
  //
  // DIRECT NITROUS OXIDE EMISSIONS - Nitrous Oxide_MMS
  // Total emissions of nitrous oxide (TotalMMS)
  // TotalMMS = AE x NOF x Cg
  //  AE = Nitrogen from manure and waste (Gg/yr)
  //  Cg = Global Warming Potential of nitrous oxide

  SEASONS.forEach((season) => {
    PORK_CLASSES.forEach((type) => {
      const currentClass = head[type];
      if (!currentClass) {
        return;
      }

      const totalAnnualNitrogenPerType =
        calculateAnnualNitrogenFromManureAndWaste(
          type,
          currentClass[season],
          context,
        );

      totals[type] = {
        ...totals[type],
        [season]: {
          annualNitrogen: totalAnnualNitrogenPerType,
        },
      };
    });
  });

  let totalManureMMSKg = 0;

  PORK_CLASSES.forEach((type) => {
    const currentClass = head[type];
    if (!currentClass) {
      return;
    }

    const manureForClass = currentClass.manure;
    const totalManureForClass = getTotalManureTonnes(manureForClass);

    const nitrogenFromManureAndFeedAE = getTotalNitrogenFromManureAndFeed(
      head,
      type,
      constants,
    );

    ManureManagementSystems.forEach((system) => {
      const manureForSystem = getTotalManureForSystem(manureForClass, system);

      const manureProportion = divideBySafeFromZero(
        manureForSystem,
        totalManureForClass,
      );
      if (system === 'undefinedSystem') {
        const { iNOF } = constants.PORK.INTEGRATED_EF[state];

        const totalN2OForSystem =
          nitrogenFromManureAndFeedAE *
          iNOF *
          manureProportion *
          constants.COMMON.GWP_FACTORSC15;

        totalManureMMSKg += totalN2OForSystem * constants.COMMON.GWP_FACTORSC6;
      } else {
        const { NOF } =
          constants.PORK.MMS[
            system as Exclude<ManureManagementSystem, 'undefinedSystem'>
          ];

        const totalN2OForSystem =
          nitrogenFromManureAndFeedAE *
          NOF *
          manureProportion *
          constants.COMMON.GWP_FACTORSC15;

        totalManureMMSKg += totalN2OForSystem * constants.COMMON.GWP_FACTORSC6;
      }
    });
  });
  const totalManureMMSTonnes = totalManureMMSKg * 10 ** 3;
  // END DIRECT NITROUS OXIDE EMISSIONS - Nitrous Oxide_MMS
  //
  //
  //

  //
  //
  //
  // INDIRECT NITROUS OXIDE EMISSIONS - Nitrous Oxide_MMS
  // Mass of piggery waste volatilised  (Matmos)
  // Matmos = (N x AE x FracGASMMMS)
  //  N = number of pigs
  //  AE = mass of nitrogen excreted
  //  FracGASM = fraction of N volatilised for the swine industry
  const fracGASMForState = constants.PORK.INTEGRATED_EF[state].iFracGasm;

  const indirectN2OEValues: Record<
    PorkClass,
    Record<ManureManagementSystem, number>
  > = {
    ...emptyByTypeAndSystem,
  };

  PORK_CLASSES.forEach((type) => {
    const currentClass = head[type];
    if (!currentClass) {
      return;
    }

    const totalManureForType = getTotalManureTonnes(currentClass.manure);

    ManureManagementSystems.forEach((system) => {
      const manureForSystem = getTotalManureForSystem(
        currentClass.manure,
        system,
      );

      const manureProportion = divideBySafeFromZero(
        manureForSystem,
        totalManureForType,
      );

      const nFromManureFeedAE = getTotalNitrogenFromManureAndFeed(
        head,
        type,
        constants,
      );

      const fracGasmForSystem =
        system === 'undefinedSystem'
          ? fracGASMForState
          : constants.PORK.MMS[system].FracGASM;

      const matmos = nFromManureFeedAE * fracGasmForSystem * manureProportion;

      const result =
        matmos *
        constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDCROP *
        constants.COMMON.GWP_FACTORSC15;

      indirectN2OEValues[type][system] = result;
    });
  });

  const totalIndirectN2O = entriesFromObject(indirectN2OEValues).reduce(
    (acc1, [, systemValues]) =>
      acc1 +
      entriesFromObject(systemValues).reduce(
        (acc, [, value]) => acc + value,
        0,
      ),
    0,
  );

  const indirectN2OGg = totalIndirectN2O * constants.COMMON.GWP_FACTORSC6;

  // C182
  const indirectAtmosphericTonnes = indirectN2OGg * 10 ** 3;
  // END INDIRECT NITROUS OXIDE EMISSIONS - Nitrous Oxide_MMS
  //
  //
  //

  //
  //
  //
  // LEACHING AND RUNOFF - Nitrous Oxide_MMS

  // Mass of N lost through leaching and runoff (MNLEACH)
  // N x AE x MS x FracWET x FracLeach_MS
  //  AE = mass of nitrogen in waste
  //  MS = fraction of waste handled through drylot
  //  FracWET = Fraction of N available for leaching and runoff
  //  FracLeach (Gg N/Gg applied) = 0.02
  const wasteFracWet = constants.PORK.FRACWET[state]; // FracWET
  const wasteAllocationMMS = constants.PORK.WASTE_MMS[state]; // MS
  //
  // Annual leaching and runoff emissions (E)
  // E = MNLEACH x EF x Cg
  //  EF (Gg N2O-N/Gg N) = 0.011
  //  Cg = Global Warming Potential of nitrous oxide
  const leachingEF = 0.011; // EF
  const fracLeach = constants.COMMON.LEACHING.FRACLEACH;

  let annualLeachingAndRunoffE = 0;
  let annualLeachingAndRunoffAEUndefined = 0;

  PORK_CLASSES.forEach((type) => {
    const currentClass = head[type];
    if (!currentClass) {
      return;
    }

    const totalManureForType = getTotalManureTonnes(currentClass.manure);

    const manureForOutdoorSystems = getTotalManureForSystem(
      currentClass.manure,
      'outdoorSystems',
    );

    const fractionOfTotalManureOutdoor = divideBySafeFromZero(
      manureForOutdoorSystems,
      totalManureForType,
    );

    const totalNitrogenAEForType = getTotalNitrogenFromManureAndFeed(
      head,
      type,
      constants,
    );

    const mnLeach =
      totalNitrogenAEForType *
      fractionOfTotalManureOutdoor *
      fracLeach *
      wasteFracWet;

    const totalOutdoor = mnLeach * leachingEF * constants.COMMON.GWP_FACTORSC15;

    annualLeachingAndRunoffE += totalOutdoor * constants.COMMON.GWP_FACTORSC6;

    const manureForUndefined = getTotalManureForSystem(
      currentClass.manure,
      'undefinedSystem',
    );

    const fractionOfTotalManureUndefined = divideBySafeFromZero(
      manureForUndefined,
      totalManureForType,
    );

    const mnLeachUndefined =
      totalNitrogenAEForType *
      fractionOfTotalManureUndefined *
      fracLeach *
      wasteFracWet *
      wasteAllocationMMS;

    const totalUndefined =
      mnLeachUndefined * leachingEF * constants.COMMON.GWP_FACTORSC15;

    annualLeachingAndRunoffAEUndefined +=
      totalUndefined * constants.COMMON.GWP_FACTORSC6;
  });

  // C273
  const totalAnnualLeachingMMSTonnes =
    (annualLeachingAndRunoffE + annualLeachingAndRunoffAEUndefined) * 10 ** 3;
  // END LEACHING AND RUNOFF - Nitrous Oxide_MMS
  //
  //
  //

  //
  //
  //
  // START ATMOSPHERIC DEPOSITION

  // START Atmospheric nitrogen deposition Urine and Dung
  // Mass of N volatilised from animal waste deposited on or applied to soils (M)
  // M = (MNSoil + UNSoil + FNSoil) x FracGASMsoil
  // (MNSoil + UNSoil + FNSoil) = totalN2O
  //  FracGASM = 0.21

  // Nitrous oxide production
  // Nitrous oxide production = M x EF x Cg
  //  EF (Gg N2O-N/Gg N) = 0.0059
  //  Cg = Global Warming Potential of nitrous oxide

  type NumberBySeason = Record<Season, number>;
  type SeasonNumberEntry = ObjectEntry<NumberBySeason>;

  const n20AEBySeason: NumberBySeason = {
    spring: 0,
    summer: 0,
    autumn: 0,
    winter: 0,
  };

  SEASONS.forEach((season) => {
    PORK_CLASSES.forEach((type) => {
      const currentClass = head[type];
      if (!currentClass) {
        return;
      }

      const seasonManureForType = getTotalManureForSeason(
        currentClass.manure,
        season,
      );

      const manureForOutdoorSystems =
        currentClass.manure[season].outdoorSystems;

      const n20AE = getSeasonNitrogenFromManureAndFeed(
        head,
        type,
        constants,
        season,
      );

      const fractionOfTotalManure = divideBySafeFromZero(
        manureForOutdoorSystems ?? 0,
        seasonManureForType,
      );

      const outdoorSystemsN20AE = n20AE * fractionOfTotalManure;

      n20AEBySeason[season] += outdoorSystemsN20AE;
    });
  });

  // D72:75
  const nVolatilisedBySeason: SeasonNumberEntry[] = entriesFromObject(
    n20AEBySeason,
  ).map(
    ([season, n20AE]) =>
      [season, n20AE * constants.LIVESTOCK.FRAC_GASM] as SeasonNumberEntry,
  );

  // D80:84
  const totalN2OBySeason = nVolatilisedBySeason.map(
    ([season, n20AE]) =>
      [
        season,
        n20AE *
          constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_IRRIGATEDPASTURE *
          constants.COMMON.GWP_FACTORSC15,
      ] as SeasonNumberEntry,
  );

  // D85
  const totalN2OProductionAtmospheric = totalN2OBySeason.reduce(
    (acc, [, n20AE]) => acc + n20AE,
    0,
  );

  // D86
  const totalN2OProductionAtmosphericGg =
    totalN2OProductionAtmospheric * constants.COMMON.GWP_FACTORSC16;

  // D87
  const totalN2OProductionAtmosphericTonnes =
    totalN2OProductionAtmosphericGg * 10 ** 3;
  // END Atmospheric nitrogen deposition Urine and Dung
  //

  // START Atmospheric nitrogen deposition Fertiliser
  const atmosphericNDepositionFertiliser = 0.11;

  // because of the `otherFertiliser` we sum it up instead
  const { otherFertiliserDryland, otherFertiliserIrrigated } =
    getOtherFertiliserAmounts(context, fertiliser);

  const nUreaGrazingDryland =
    fertiliser.pastureDryland * 0.46 * atmosphericNDepositionFertiliser;
  const nUreaGrazingIrrigated =
    fertiliser.pastureIrrigated * 0.46 * atmosphericNDepositionFertiliser;
  const nUreaCropsDryland =
    fertiliser.cropsDryland * 0.46 * atmosphericNDepositionFertiliser;
  const nUreaCropsIrrigated =
    fertiliser.cropsIrrigated * 0.46 * atmosphericNDepositionFertiliser;
  const nUreaOtherDryland =
    otherFertiliserDryland * atmosphericNDepositionFertiliser;
  const nUreaOtherIrrigated =
    otherFertiliserIrrigated * atmosphericNDepositionFertiliser;

  const totalFertiliserN2ODryland =
    (nUreaGrazingDryland + nUreaCropsDryland + nUreaOtherDryland) *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE *
    constants.COMMON.GWP_FACTORSC15;

  const totalFertiliserN2OIrrigated =
    (nUreaGrazingIrrigated *
      constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_IRRIGATEDPASTURE +
      nUreaCropsIrrigated *
        constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_IRRIGATEDCROP +
      nUreaOtherIrrigated *
        constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_IRRIGATEDCROP) *
    constants.COMMON.GWP_FACTORSC15;

  const totalFertiliserN2O =
    (totalFertiliserN2ODryland + totalFertiliserN2OIrrigated) *
    constants.COMMON.GWP_FACTORSC6;
  // END Atmospheric nitrogen deposition Fertiliser
  // END ATMOSPHERIC DEPOSITION
  //
  //
  //

  //
  //
  //
  // START LEACHING AND RUNOFF - Agricultural Soils
  //
  // The mass of fertiliser N applied to soils that is lost through leaching and runoff (M)
  // M = M x FracWET x FracLEACH
  //  M = mass of fertiliser in each production system
  //  FracWET  (fraction of N available for leaching and runoff)
  const fracWetMultiplier = rainfallAbove600 ? 0 : 1;
  const fracLeachFertiliser =
    constants.COMMON.LEACHING.FRACLEACH_FERTILISER_SOILS;

  const nFertiliserGrazingDryland =
    fertiliser.pastureDryland * 0.46 * fracWetMultiplier * fracLeachFertiliser;
  const nFertiliserCroppingDryland =
    fertiliser.cropsDryland * 0.46 * fracWetMultiplier * fracLeachFertiliser;
  const nFertiliserOtherDryland = getNFertiliserOtherDryland(
    otherFertiliserDryland,
    fracWetMultiplier,
    fracLeachFertiliser,
  );

  //
  // Total N2O production from leaching and runoff - Fertiliser (E)
  // E = M x EF x Cg
  //  EF (Gg N2O-N/Gg N) = 0.0011
  //  Cg = Global Warming Potential of nitrous oxide
  // (WARNING: all the irrigated ones are 0, thats why the above ones are
  // commented out)
  const nFertiliserCropsNonIrrigated1 =
    nFertiliserGrazingDryland * leachingEF * constants.COMMON.GWP_FACTORSC15;
  const nFertiliserCropsNonIrrigated2 =
    nFertiliserCroppingDryland * leachingEF * constants.COMMON.GWP_FACTORSC15;
  const nFertiliserCropsNonIrrigated3 =
    nFertiliserOtherDryland * leachingEF * constants.COMMON.GWP_FACTORSC15;

  const totalNFertiliserCropsNonIrrigated =
    nFertiliserCropsNonIrrigated1 +
    nFertiliserCropsNonIrrigated2 +
    nFertiliserCropsNonIrrigated3;
  //

  //
  // The mass of dung and urine N applied to soils that is lost through leaching and runoff (M)
  // M = M x FracWET x FracLEACH
  // M = mass of fertiliser in each production system
  //  FracWET  (fraction of N available for leaching and runoff) - State specifc
  //  FracWet Multiplier
  //  FracLEACH

  const allAENitrogenFromSeasons = Object.values(n20AEBySeason).reduce(
    (acc, n20AE) => acc + n20AE,
    0,
  );

  const massDungUrineNLost =
    allAENitrogenFromSeasons * fracLeachFertiliser * wasteFracWet;
  //
  // Total N2O production from leaching and runoff - Fertiliser (E)
  // E = M x EF x Cg
  //  EF (Gg N2O-N/Gg N) = 0.0011
  //  Cg = Global Warming Potential of nitrous oxide
  const totalNDungUrine =
    massDungUrineNLost * leachingEF * constants.COMMON.GWP_FACTORSC15;
  //
  // Total N2O2e from Leaching and Runoff - Fertiliser &Urine and Dung - tonnes
  const totalN2OLeaching =
    totalNFertiliserCropsNonIrrigated + totalNDungUrine * 10 ** 3;

  // Total CO2e from Leaching and Runoff - Fertiliser & Urine and Dung - tonnes
  const totalN2OLeachingTonnes =
    totalN2OLeaching * constants.COMMON.GWP_FACTORSC6;
  // END LEACHING AND RUNOFF - Agricultural Soils
  //
  //
  //

  return {
    atmosphericIndirectN2O: indirectAtmosphericTonnes,
    atmosphericN2O: totalN2OProductionAtmosphericTonnes + totalFertiliserN2O,
    leachingMMSN2O: totalAnnualLeachingMMSTonnes,
    leachingSoilN2O: totalN2OLeachingTonnes,
    manureDirectN2O: totalManureMMSTonnes,
  };
}
