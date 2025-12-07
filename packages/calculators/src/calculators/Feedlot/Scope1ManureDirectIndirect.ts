import { FeedlotStay } from '@/types/Feedlot/stay.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForFeedlotCalculator } from './constants';

export function calculateScope1ManureDirectIndirect(
  stay: FeedlotStay,
  context: ExecutionContext<ConstantsForFeedlotCalculator>,
) {
  const { constants } = context;

  const feedIntake = stay.dailyIntake;

  const crudeProteinFraction = stay.crudeProtein / 100;

  const nitrogenIntake = (feedIntake * crudeProteinFraction) / 6.25;

  const nitrogenRetentionFraction = stay.nitrogenRetention / 100;

  const nitrogenExcreted = nitrogenIntake * (1 - nitrogenRetentionFraction);

  const annualNitrogenExcretion =
    stay.livestock * nitrogenExcreted * stay.stayAverageDuration * 10 ** -6;

  // (nitrousOxideMMSK30 > nitrousOxideMMSK35)
  const totalDirectEmissionsN2O =
    annualNitrogenExcretion *
    constants.FEEDLOT.I_NOF *
    constants.COMMON.GWP_FACTORSC15;

  const totalDirectGgCO2 =
    totalDirectEmissionsN2O * constants.COMMON.GWP_FACTORSC6;
  // (nitrousOxideMMSK37, dataSummaryC12)
  const totalDirectTonnes = totalDirectGgCO2 * 10 ** 3;

  // Indirect

  const mnAtmosphere = annualNitrogenExcretion * constants.FEEDLOT.I_FRACGASM;

  const totalIndirectEmissionsN2O =
    mnAtmosphere *
    constants.FEEDLOT.INDIRECT_EF *
    constants.COMMON.GWP_FACTORSC15;

  const totalIndirectGgCO2 =
    totalIndirectEmissionsN2O * constants.COMMON.GWP_FACTORSC6;

  const totalIndirectTonnes = totalIndirectGgCO2 * 10 ** 3;

  return { direct: totalDirectTonnes, indirect: totalIndirectTonnes };
}
