import { PORK_CLASSES, SEASONS } from '../constants/constants';
import { ExecutionContext } from '../executionContext';
import { PorkClass, Season } from '../types/types';
import { ConstantsForPorkCalculator } from './constants';

type PorkSeasonNumber = {
  [porkType in PorkClass]?: {
    [season in Season]: number;
  };
};

const EMPTY_INTERNAL_TOTALS = {
  spring: 0,
  summer: 0,
  autumn: 0,
  winter: 0,
};

export function calculateScope1Enteric(
  head: PorkSeasonNumber,
  context: ExecutionContext<ConstantsForPorkCalculator>,
) {
  const { constants } = context;

  // (Enteric_FermentationD15)
  const methaneMJperkg = 18.6;

  // (Enteric_FermentationD14)
  const methaneF = 55.22;

  const totals: Required<PorkSeasonNumber> = {
    sows: { ...EMPTY_INTERNAL_TOTALS },
    boars: { ...EMPTY_INTERNAL_TOTALS },
    gilts: { ...EMPTY_INTERNAL_TOTALS },
    suckers: { ...EMPTY_INTERNAL_TOTALS },
    weaners: { ...EMPTY_INTERNAL_TOTALS },
    growers: { ...EMPTY_INTERNAL_TOTALS },
    slaughter_pigs: { ...EMPTY_INTERNAL_TOTALS },
  };

  SEASONS.forEach((season) => {
    PORK_CLASSES.forEach((type) => {
      const currentClass = head[type];
      if (!currentClass) {
        return;
      }

      const newType = (
        ['sows', 'boars', 'gilts'].includes(type) ? type : 'slaughter_pigs'
      ) as 'sows' | 'boars' | 'gilts' | 'slaughter_pigs';

      // (Enteric_FermentationC35)
      const feedIntakeDM = constants.PORK.HERD_FEEDINTAKE[newType];

      const headSeasonType = currentClass[season];

      // (Enteric_FermentationD17)
      const dailyMethaneProduction =
        (feedIntakeDM * methaneMJperkg * 0.007) / methaneF;

      // (Enteric_FermentationD23)
      const methaneProductionSeason =
        headSeasonType * dailyMethaneProduction * 91.25 * 10 ** -6;

      totals[type] = { ...totals[type], [season]: methaneProductionSeason };
    });
  });

  // (entericFermentationC28)
  const totalMethaneProduction = PORK_CLASSES.reduce((acc, type) => {
    return (
      acc +
      SEASONS.reduce((acc2, season) => {
        return acc2 + totals[type][season];
      }, 0)
    );
  }, 0);

  const totalMethaneGg =
    totalMethaneProduction * constants.COMMON.GWP_FACTORSC5;
  const totalMethaneTonnes = totalMethaneGg * 10 ** 3;

  // (dataSummaryC9)
  return totalMethaneTonnes;
}
