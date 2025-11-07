import { ExecutionContext } from '../../executionContext';

export function calculateScope1Lime(
  limestoneTonnes: number,
  limestoneFraction: number,
  context: ExecutionContext,
) {
  const { constants } = context;
  const { SCOPE1 } = constants.COMMON.LIMING;
  const CO2EmissionsFromLime =
    ((limestoneTonnes *
      limestoneFraction *
      SCOPE1.LIMESTONE_FRACTIONPURITY *
      SCOPE1.LIMESTONE_EF +
      limestoneTonnes *
        (1 - limestoneFraction) *
        SCOPE1.DOLOMITE_FRACTIONPURITY *
        SCOPE1.DOLOMITE_EF) *
      constants.COMMON.GWP_FACTORSC18) /
    1000;
  return CO2EmissionsFromLime * 10 ** 3;
}
