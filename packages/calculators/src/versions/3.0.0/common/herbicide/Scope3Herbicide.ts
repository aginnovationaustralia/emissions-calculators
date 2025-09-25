import { ExecutionContext } from '../../executionContext';
import { CommonConstants } from '../constants';

/**
 *
 * @param glyphosateUsage kg a.i per farm
 * @param generalHerbicideUsage kg a.i per farm
 * @returns
 */
export function calculateScope3Herbicide(
  glyphosateUsage: number,
  generalHerbicideUsage: number,
  context: ExecutionContext<CommonConstants>,
) {
  const { constants } = context;

  // (embeddedEmissions_C13)
  const glyphosateTonnes = glyphosateUsage / 1000;

  // (embeddedEmissions_E148, embeddedEmissions_C129, embeddedEmissions_E13)
  const glyphosateEnergyEmissions =
    constants.COMMON.AGROCHEMICAL_ENERGY_MANUFACTURE.HERBICIDE_GLYPHOSATE
      .TOTAL_ENERGY *
    constants.COMMON.AGROCHEMICAL_ENERGY_MANUFACTURE.HERBICIDE_GLYPHOSATE.EF;

  // (embeddedEmissions_F13)
  const glyphosateGHGTonnes = glyphosateTonnes * glyphosateEnergyEmissions;

  // (embeddedEmissions_C14)
  const herbicideTonnes = generalHerbicideUsage / 1000;

  // (embeddedEmissions_E149)
  const herbicideEnergyEmissions =
    constants.COMMON.AGROCHEMICAL_ENERGY_MANUFACTURE.HERBICIDE_GENERAL
      .TOTAL_ENERGY *
    constants.COMMON.AGROCHEMICAL_ENERGY_MANUFACTURE.HERBICIDE_GENERAL.EF;

  // (embeddedEmissions_E150)
  const insecticideEnergyEmissions =
    constants.COMMON.AGROCHEMICAL_ENERGY_MANUFACTURE.INSECTICIDE.TOTAL_ENERGY *
    constants.COMMON.AGROCHEMICAL_ENERGY_MANUFACTURE.INSECTICIDE.EF;

  // (embeddedEmissions_E151, embeddedEmissions_C128, embeddedEmissions_E14)
  const herbicideAverageEnergyEmissions =
    (herbicideEnergyEmissions + insecticideEnergyEmissions) / 2;

  // (embeddedEmissions_F14)
  const herbicideGHGTonnes = herbicideTonnes * herbicideAverageEnergyEmissions;

  // (embeddedEmissions_F15, dataSummary_B24)
  const totalEmbeddedEmissionsHerbicide =
    glyphosateGHGTonnes + herbicideGHGTonnes;

  return {
    total: totalEmbeddedEmissionsHerbicide,
    intermediate: {
      glyphosate: glyphosateTonnes,
      herbicide: herbicideTonnes,
    },
  };
}
