import { ExecutionContext } from '../executionContext';
import { calculateScope3Fertiliser as calculateScope3FertiliserGrains } from '../Grains/Scope3Fertiliser';
import { CottonCrop } from '../types/Cotton/cotton.input';

export function calculateScope3Fertiliser(
  cotton: CottonCrop,
  context: ExecutionContext,
) {
  const { constants, version } = context;

  if (version.greaterThanOrEqualTo('1.0.1')) {
    return calculateScope3FertiliserGrains(cotton, context).total;
  }

  // (Urea_ApplicationC8, Embedded_Emissions_B4)
  const totalMassFertiliser =
    cotton.areaSown * cotton.ureaApplication * 10 ** -3;

  // (Embedded_Emissions_D53)
  const N_EEF = 65 * 0.05;

  // (Embedded_Emissions_B45, Embedded_Emissions_D4)
  const ureaEEF = N_EEF * constants.FERTILISER_CONTENT.UREA.N;

  // (Embedded_Emissions_E4)
  const ureaGHG = totalMassFertiliser * ureaEEF;

  // (FertiliserC14, Embedded_Emissions_B5)
  const sspTonnes = (cotton.singleSuperPhosphate * cotton.areaSown) / 1000;

  // (Embedded_Emissions_D54)
  const P_EEF = 15 * 0.06;

  // (Embedded_Emissions_D56)
  const S_EEF = 5 * 0.06;

  // (Embedded_Emissions_B43, Embedded_Emissions_D5)
  const sspEEF =
    P_EEF * constants.FERTILISER_CONTENT.SSP.P +
    S_EEF * constants.FERTILISER_CONTENT.SSP.S;

  // (Embedded_Emissions_E5)
  const sspGHG = sspTonnes * sspEEF;

  // (Embedded_Emissions_D6)
  const otherGHG =
    constants.CUSTOMIZED_FERTILIZER[cotton.otherFertiliserType].TotalGHG;

  // (Embedded_Emissions_B6, FertiliserC15)
  const otherTonnes =
    (cotton.otherFertiliserApplication * cotton.areaSown) / 1000;

  // (Embedded_Emissions_E6)
  const otherGHGETonnes = otherTonnes * otherGHG;

  // (Embedded_Emissions_E7, Data_Summary_C23)
  const totalEmbedded = ureaGHG + sspGHG + otherGHGETonnes;

  return totalEmbedded;
}
