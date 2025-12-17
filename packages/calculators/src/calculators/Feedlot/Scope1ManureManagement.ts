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

  const feedIntake = stay.dailyIntake;

  const volatileSolidProduction =
    feedIntake *
    (1 - stay.dryMatterDigestibility / 100) *
    (1 - constants.FEEDLOT.ASH_CONTENT);

  const integratedEF = constants.FEEDLOT.INTEGRATED_EF[state];

  const methaneProductionFromManure =
    volatileSolidProduction *
    constants.FEEDLOT.EMISSION_POTENTIAL *
    integratedEF *
    constants.LIVESTOCK.METHANE_DENSITY;

  const seasonalMethaneProduction =
    stay.stayAverageDuration *
    stay.livestock *
    methaneProductionFromManure *
    10 ** -6;

  const totalCO2Gg = seasonalMethaneProduction * constants.COMMON.GWP_FACTORSC5;

  const manureManagementCH4 = totalCO2Gg * 10 ** 3;

  return manureManagementCH4;
}
