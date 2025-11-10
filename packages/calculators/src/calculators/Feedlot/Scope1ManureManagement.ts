import { FeedlotStay } from '@/types/Feedlot/stay.input';
import { State } from '@/types/enums';
import { ExecutionContext } from '../executionContext';
import { ConstantsForFeedlotCalculator } from './constants';

export function calculateScope1ManureManagement(
  stay: FeedlotStay,
  state: State,
  context: ExecutionContext<ConstantsForFeedlotCalculator>,
) {
  const { constants } = context;

  // (entericFermentationK9)
  const feedIntake = stay.dailyIntake;

  // (manureManagementD36)
  const volatileSolidProduction =
    feedIntake *
    (1 - stay.dryMatterDigestibility / 100) *
    (1 - constants.FEEDLOT.ASH_CONTENT);

  // (manureManagementT14, manureManagementC29)
  const integratedEF = constants.FEEDLOT.INTEGRATED_EF[state];

  // (manureManagementD47)
  const methaneProductionFromManure =
    volatileSolidProduction *
    constants.FEEDLOT.EMISSION_POTENTIAL *
    integratedEF *
    constants.LIVESTOCK.METHANE_DENSITY;

  // (manureManagementD57:F60, manureManagementC62)
  const seasonalMethaneProduction =
    stay.stayAverageDuration *
    stay.livestock *
    methaneProductionFromManure *
    10 ** -6;

  // (manureManagementC63)
  const totalCO2Gg = seasonalMethaneProduction * constants.COMMON.GWP_FACTORSC5;

  // (manureManagementC64, dataSummaryC11)
  const manureManagementCH4 = totalCO2Gg * 10 ** 3;

  return manureManagementCH4;
}
