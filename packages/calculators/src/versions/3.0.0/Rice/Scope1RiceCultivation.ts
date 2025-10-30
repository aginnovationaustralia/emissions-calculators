import { ExecutionContext } from '../executionContext';
import { RiceCrop } from '../types/Rice/rice.input';
import { ConstantsForRiceCalculator } from './constants';

export const calculateScope1RiceCultivation = (
  rice: RiceCrop,
  context: ExecutionContext<ConstantsForRiceCalculator>,
) => {
  const { constants } = context;

  // Methane rice F23
  const growingSeasonEmissionRate =
    constants.RICE.EF_FLOODED_FIELDS *
    constants.RICE.SF_CULTIVATION_WATER_REGIME[rice.waterRegimeSubType] *
    constants.RICE.SF_PRESEASON_WATER_REGIME[rice.ricePreseasonFloodingPeriod] *
    rice.growingSeasonDays;

  // Methane rice F32
  const totalGgCH4 = rice.areaSown * growingSeasonEmissionRate * 10 ** -6;

  // Methan rice F33
  const totalGgCO2 = totalGgCH4 * constants.COMMON.GWP_FACTORSC5;

  // Methane rice F34
  return totalGgCO2 * 10 ** 3;
};
