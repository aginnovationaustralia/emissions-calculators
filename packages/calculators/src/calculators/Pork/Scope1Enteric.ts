import { SEASONS } from '@/constants/constants';
import { PorkClasses } from '@/types/Pork/porkclasses.input';
import { PorkClassesAPI, Season } from '@/types/enums';
import { ExecutionContext } from '../executionContext';
import { ConstantsForPorkCalculator } from './constants';

const EMPTY_INTERNAL_TOTALS = {
  spring: 0,
  summer: 0,
  autumn: 0,
  winter: 0,
};

export function calculateScope1Enteric(
  head: PorkClasses,
  context: ExecutionContext<ConstantsForPorkCalculator>,
) {
  const { constants } = context;

  // (Enteric_FermentationD15)
  const methaneMJperkg = 18.6;

  // (Enteric_FermentationD14)
  const methaneF = 55.22;

  const totals: Record<keyof PorkClasses, Record<Season, number>> = {
    sows: { ...EMPTY_INTERNAL_TOTALS },
    boars: { ...EMPTY_INTERNAL_TOTALS },
    gilts: { ...EMPTY_INTERNAL_TOTALS },
    suckers: { ...EMPTY_INTERNAL_TOTALS },
    weaners: { ...EMPTY_INTERNAL_TOTALS },
    growers: { ...EMPTY_INTERNAL_TOTALS },
    slaughterPigs: { ...EMPTY_INTERNAL_TOTALS },
  };

  SEASONS.forEach((season) => {
    PorkClassesAPI.forEach((type) => {
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

  const totalMethaneProduction = PorkClassesAPI.reduce((acc, type) => {
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

  return totalMethaneTonnes;
}
