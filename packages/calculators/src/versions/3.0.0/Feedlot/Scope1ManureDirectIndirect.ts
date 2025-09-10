import { ExecutionContext } from '../executionContext';
import { FeedlotStay } from '../types/Feedlot/stay.input';

export function calculateScope1ManureDirectIndirect(
  stay: FeedlotStay,
  context: ExecutionContext,
) {
  const { constants } = context;

  // (entericFermentationK9)
  const feedIntake = stay.dailyIntake;

  // (nitrousOxideMMSD5)
  const crudeProteinFraction = stay.crudeProtein / 100;

  // (nitrousOxideMMSK8)
  const nitrogenIntake = (feedIntake * crudeProteinFraction) / 6.25;

  // (nitrousOxideMMSD15)
  const nitrogenRetentionFraction = stay.nitrogenRetention / 100;

  // (nitrousOxideMMSK14)
  const nitrogenExcreted = nitrogenIntake * (1 - nitrogenRetentionFraction);

  // (nitrousOxideMMSK20)
  const annualNitrogenExcretion =
    stay.livestock * nitrogenExcreted * stay.stayAverageDuration * 10 ** -6;

  // (nitrousOxideMMSK30 > nitrousOxideMMSK35)
  const totalDirectEmissionsN2O =
    annualNitrogenExcretion *
    constants.FEEDLOT_I_NOF *
    constants.GWP_FACTORSC15;

  // (nitrousOxideMMSK36)
  const totalDirectGgCO2 = totalDirectEmissionsN2O * constants.GWP_FACTORSC6;
  // (nitrousOxideMMSK37, dataSummaryC12)
  const totalDirectTonnes = totalDirectGgCO2 * 10 ** 3;

  // Indirect

  // (nitrousOxideMMSK46)
  const mnAtmosphere = annualNitrogenExcretion * constants.FEEDLOT_I_FRACGASM;

  // (nitrousOxideMMSK56)
  const totalIndirectEmissionsN2O =
    mnAtmosphere * constants.FEEDLOT_INDIRECT_EF * constants.GWP_FACTORSC15;

  // (nitrousOxideMMSK62)
  const totalIndirectGgCO2 =
    totalIndirectEmissionsN2O * constants.GWP_FACTORSC6;

  // (nitrousOxideMMSK63)
  const totalIndirectTonnes = totalIndirectGgCO2 * 10 ** 3;

  return { direct: totalDirectTonnes, indirect: totalIndirectTonnes };
}
