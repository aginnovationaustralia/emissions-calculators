import { ExecutionContext } from '../../executionContext';

/**
 *
 * @param glyphosateUsage kg a.i per farm
 * @param generalHerbicideUsage kg a.i per farm
 * @returns
 */
export function calculateScope3Herbicide(
  glyphosateUsage: number,
  generalHerbicideUsage: number,
  context: ExecutionContext,
) {
  const { constants } = context;

  const glyphosateTonnes = glyphosateUsage / 1000;

  const glyphosateEnergyEmissions =
    constants.COMMON.AGROCHEMICAL_ENERGY_MANUFACTURE.HERBICIDE_GLYPHOSATE
      .TOTAL_ENERGY *
    constants.COMMON.AGROCHEMICAL_ENERGY_MANUFACTURE.HERBICIDE_GLYPHOSATE.EF;

  const glyphosateGHGTonnes = glyphosateTonnes * glyphosateEnergyEmissions;

  const herbicideTonnes = generalHerbicideUsage / 1000;

  const herbicideEnergyEmissions =
    constants.COMMON.AGROCHEMICAL_ENERGY_MANUFACTURE.HERBICIDE_GENERAL
      .TOTAL_ENERGY *
    constants.COMMON.AGROCHEMICAL_ENERGY_MANUFACTURE.HERBICIDE_GENERAL.EF;

  const insecticideEnergyEmissions =
    constants.COMMON.AGROCHEMICAL_ENERGY_MANUFACTURE.INSECTICIDE.TOTAL_ENERGY *
    constants.COMMON.AGROCHEMICAL_ENERGY_MANUFACTURE.INSECTICIDE.EF;

  const herbicideAverageEnergyEmissions =
    (herbicideEnergyEmissions + insecticideEnergyEmissions) / 2;

  const herbicideGHGTonnes = herbicideTonnes * herbicideAverageEnergyEmissions;

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
