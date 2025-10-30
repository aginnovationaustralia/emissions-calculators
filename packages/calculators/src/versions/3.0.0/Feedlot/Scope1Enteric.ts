import { ExecutionContext } from '../executionContext';
import { FeedlotStay } from '../types/Feedlot/stay.input';
import { ConstantsForFeedlotCalculator } from './constants';

//
//
//
// START SCOPE 1 ENTERIC FERMENTATION
export function calculateScope1Enteric(
  stay: FeedlotStay,
  context: ExecutionContext<ConstantsForFeedlotCalculator>,
) {
  const feedIntake = stay.dailyIntake;

  // Daily methane production
  // M = (5.11 × I - 4.00 × EE + 2.26 × NDF ) × 10-3
  //  I = Intanke of dry matter per day
  //  EE = Ether extract as a percentage of intake
  //  NDF = Neutral detergent fibre (as a percentage of intake)
  const dailyMethaneYield =
    stay.livestock === 0
      ? 0
      : (5.11 * feedIntake -
          4.0 * (stay.etherExtract / 100) +
          2.26 * (stay.ndf / 100)) *
        10 ** -3;

  // Seasonal methane production
  // E = L x N x M x 10^-6
  //  L = length of stay
  //  N = Numbers of cattle in group
  //  M= Methane production (kg/hd/day)
  const seasonalMethane =
    stay.stayAverageDuration * stay.livestock * dailyMethaneYield * 10 ** -6;

  const totalCO2Gg = seasonalMethane * context.constants.COMMON.GWP_FACTORSC5;

  const totalTonnes = totalCO2Gg * 10 ** 3;

  return totalTonnes;
}
// END SCOPE 1 ENTERIC FERMENTATION
//
//
//
