import { ExecutionContext } from '../../executionContext';

export function calculateScope3Lime(
  limestoneTonnes: number,
  context: ExecutionContext,
) {
  const { constants } = context;
  const {
    FUEL_SCOPE3_PRODUCTION_NATURAL_GAS,
    FUEL_SCOPE3_PRODUCTION_ELECTRICITY,
    FUEL_SCOPE3_PRODUCTION_DISTILLATE_FUEL,
    FUEL_SCOPE3_PRODUCTION_COAL,
    FUEL_SCOPE3_PRODUCTION_GASOLINE,
    FUEL_SCOPE3_POST_PRODUCTION_DISTILLATE_FUEL,
  } = constants.COMMON.LIMING.SCOPE3;

  const productionTotal =
    FUEL_SCOPE3_PRODUCTION_NATURAL_GAS +
    FUEL_SCOPE3_PRODUCTION_ELECTRICITY +
    FUEL_SCOPE3_PRODUCTION_DISTILLATE_FUEL +
    FUEL_SCOPE3_PRODUCTION_COAL +
    FUEL_SCOPE3_PRODUCTION_GASOLINE;

  const totalGHG =
    (productionTotal + FUEL_SCOPE3_POST_PRODUCTION_DISTILLATE_FUEL) / 1000;
  const limeGHG = limestoneTonnes * totalGHG;

  return limeGHG;
}
