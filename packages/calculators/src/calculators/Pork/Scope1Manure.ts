import { DAYS_IN_SEASON, SEASONS } from '@/constants/constants';
import { ManureManagementSystems, PorkClassesAPI, State } from '@/types/enums';
import { PorkClasses } from '@/types/Pork/porkclasses.input';
import { divideBySafeFromZero } from '../common/tools';
import { ExecutionContext } from '../executionContext';
import { ConstantsForPorkCalculator } from './constants';

const EMPTY_INTERNAL_TOTALS = {
  spring: 0,
  summer: 0,
  autumn: 0,
  winter: 0,
};

export function calculateScope1Manure(
  state: State,
  head: PorkClasses,
  context: ExecutionContext<ConstantsForPorkCalculator>,
) {
  const { constants } = context;

  const totals = {
    sows: { ...EMPTY_INTERNAL_TOTALS },
    boars: { ...EMPTY_INTERNAL_TOTALS },
    gilts: { ...EMPTY_INTERNAL_TOTALS },
    suckers: { ...EMPTY_INTERNAL_TOTALS },
    weaners: { ...EMPTY_INTERNAL_TOTALS },
    growers: { ...EMPTY_INTERNAL_TOTALS },
    slaughterPigs: { ...EMPTY_INTERNAL_TOTALS },
  };

  //
  //
  //
  // START MANURE MANAGEMENT
  // Methane production from wastes (M)
  // M = VS x Bo x iMCF x p
  //  VS = volatile solids production (kg/head/day)
  //  iMCF = integrated methane conversion factor

  const methaneEmissionPotential = constants.PORK.METHANE_EMISSION_POTENTIAL; // Bo
  const densityOfMethane = constants.LIVESTOCK.METHANE_DENSITY; // p

  ManureManagementSystems.forEach((system) => {
    PorkClassesAPI.forEach((type) => {
      const currentClass = head[type];
      if (!currentClass) {
        return;
      }
      SEASONS.forEach((season) => {
        // Seasonal methane production (E)
        // E = (91.25 x N x M) x 10^-6
        // N = number of pigs in each class
        // M = methane production
        const headCount = currentClass[season]; // N

        const manureForSystem = currentClass.manure[season][system];
        if (!manureForSystem) {
          return;
        }

        const volatileSolids = divideBySafeFromZero(
          (manureForSystem * 10 ** 3) / DAYS_IN_SEASON,
          headCount,
        ); // VS

        let MCF: number;
        if (system === 'undefinedSystem') {
          MCF = constants.PORK.INTEGRATED_EF[state].iMCF;
        } else {
          MCF = constants.PORK.MMS[system].MCF;
        }

        const methaneProduction =
          volatileSolids * methaneEmissionPotential * densityOfMethane * MCF;

        const seasonalMethaneProductionForSystem =
          DAYS_IN_SEASON * headCount * methaneProduction * 10 ** -6;

        const currentSeasonalMethaneProduction = totals[type][season];

        totals[type] = {
          ...totals[type],
          [season]:
            currentSeasonalMethaneProduction +
            seasonalMethaneProductionForSystem,
        };
      });
    });
  });

  const totalManure = PorkClassesAPI.reduce((acc, type) => {
    return (
      acc +
      SEASONS.reduce((acc2, season) => {
        return acc2 + totals[type][season];
      }, 0)
    );
  }, 0);

  const totalManureGg = totalManure * constants.COMMON.GWP_FACTORSC5;
  const totalManureTonnes = totalManureGg * 10 ** 3;

  return totalManureTonnes;
  // END MANURE MANAGEMENT
  //
  //
  //
}
