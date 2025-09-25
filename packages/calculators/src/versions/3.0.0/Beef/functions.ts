import { ExecutionContext } from '../executionContext';
import { ConstantsForBeefCalculator } from './constants';

export function getAtmosphericNDepositionUreaIrrigatedTotal(
  context: ExecutionContext<ConstantsForBeefCalculator>,
  atmosphericNDepositionUreaGrazingIrrigated: number,
  atmosphericNDepositionUreaCroppingIrrigated: number,
  atmosphericNDepositionUreaOtherIrrigated: number,
) {
  const { constants } = context;
  const { EF_IRRIGATEDPASTURE, EF_IRRIGATEDCROP } =
    constants.COMMON.AGRICULTURAL_SOILS;

  return (
    (atmosphericNDepositionUreaGrazingIrrigated * EF_IRRIGATEDPASTURE +
      atmosphericNDepositionUreaCroppingIrrigated * EF_IRRIGATEDCROP +
      atmosphericNDepositionUreaOtherIrrigated * EF_IRRIGATEDCROP) *
    constants.COMMON.GWP_FACTORSC15
  );
}
