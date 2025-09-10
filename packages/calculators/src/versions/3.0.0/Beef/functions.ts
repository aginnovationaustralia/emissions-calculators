import { ExecutionContext } from '../executionContext';

export function getAtmosphericNDepositionUreaIrrigatedTotal(
  context: ExecutionContext,
  atmosphericNDepositionUreaGrazingIrrigated: number,
  atmosphericNDepositionUreaCroppingIrrigated: number,
  atmosphericNDepositionUreaOtherIrrigated: number,
) {
  const { constants } = context;
  const { EF_IRRIGATEDPASTURE, EF_IRRIGATEDCROP } =
    constants.AGRICULTURAL_SOILS;

  return (
    (atmosphericNDepositionUreaGrazingIrrigated * EF_IRRIGATEDPASTURE +
      atmosphericNDepositionUreaCroppingIrrigated * EF_IRRIGATEDCROP +
      atmosphericNDepositionUreaOtherIrrigated * EF_IRRIGATEDCROP) *
    constants.GWP_FACTORSC15
  );
}
