import { ExecutionContext } from '../executionContext';
import { HasLivestockConstants } from './constants';

export function calculateScope3Herbicide(
  beefHerbicideKg: number,
  beefOtherHerbicideKg: number,
  sheepHerbicideKg: number,
  sheepOtherHerbicideKg: number,
  context: ExecutionContext<HasLivestockConstants>,
) {
  const { constants } = context;

  const herbicideEnergyProduction =
    constants.LIVESTOCK.ENERGY_TO_MANUFACTURE.HERBICIDE_ENERGY *
    constants.LIVESTOCK.ENERGY_TO_MANUFACTURE.HERBICIDE_EF;
  const herbicideOtherEnergyProduction =
    constants.LIVESTOCK.ENERGY_TO_MANUFACTURE.HERBICIDEGENERAL_ENERGY *
    constants.LIVESTOCK.ENERGY_TO_MANUFACTURE.HERBICIDEGENERAL_EF;
  const insecticideEnergyProduction =
    constants.LIVESTOCK.ENERGY_TO_MANUFACTURE.INSECTICIDE_ENERGY *
    constants.LIVESTOCK.ENERGY_TO_MANUFACTURE.INSECTICIDE_EF;
  const herbicidePesticideAverage =
    (herbicideOtherEnergyProduction + insecticideEnergyProduction) / 2;

  //   const dataInputBeefD101 = beefHerbicide; // kg a.i. per enterprise
  const beefHerbicideTonnes = beefHerbicideKg / 1000;

  const beefHerbicideCO2 =
    beefHerbicideTonnes *
    herbicideEnergyProduction *
    constants.LIVESTOCK.EMISSION_BREAKDOWN.HERBICIDE.CO2;
  const beefHerbicideCH4 =
    beefHerbicideTonnes *
    herbicideEnergyProduction *
    constants.LIVESTOCK.EMISSION_BREAKDOWN.HERBICIDE.CH4;
  const beefHerbicideN2O =
    beefHerbicideTonnes *
    herbicideEnergyProduction *
    constants.LIVESTOCK.EMISSION_BREAKDOWN.HERBICIDE.N2O;
  const beefHerbicideTotalGHG =
    beefHerbicideCO2 + beefHerbicideCH4 + beefHerbicideN2O;

  const beefOtherHerbicideTonnes = beefOtherHerbicideKg / 1000;

  const beefHerbicideOtherCO2 =
    beefOtherHerbicideTonnes *
    herbicidePesticideAverage *
    constants.LIVESTOCK.EMISSION_BREAKDOWN.HERBICIDE.CO2;
  const beefHerbicideOtherCH4 =
    beefOtherHerbicideTonnes *
    herbicidePesticideAverage *
    constants.LIVESTOCK.EMISSION_BREAKDOWN.HERBICIDE.CH4;
  const beefHerbicideOtherN2O =
    beefOtherHerbicideTonnes *
    herbicidePesticideAverage *
    constants.LIVESTOCK.EMISSION_BREAKDOWN.HERBICIDE.N2O;
  const beefHerbicideOtherTotalGHG =
    beefHerbicideOtherCO2 + beefHerbicideOtherCH4 + beefHerbicideOtherN2O;

  // Total embedded emissions herbicide/pesticide
  const beefTotalEmbeddedEmissions =
    beefHerbicideTotalGHG + beefHerbicideOtherTotalGHG;

  const sheepHerbicideTonnes = sheepHerbicideKg / 1000;
  const sheepHerbicideCO2 =
    sheepHerbicideTonnes *
    herbicideEnergyProduction *
    constants.LIVESTOCK.EMISSION_BREAKDOWN.HERBICIDE.CO2;
  const sheepHerbicideCH4 =
    sheepHerbicideTonnes *
    herbicideEnergyProduction *
    constants.LIVESTOCK.EMISSION_BREAKDOWN.HERBICIDE.CH4;
  const sheepHerbicideN2O =
    sheepHerbicideTonnes *
    herbicideEnergyProduction *
    constants.LIVESTOCK.EMISSION_BREAKDOWN.HERBICIDE.N2O;
  const sheepHerbicideTotalGHG =
    sheepHerbicideCO2 + sheepHerbicideCH4 + sheepHerbicideN2O;

  const sheepOtherHerbicideTonnes = sheepOtherHerbicideKg / 1000;
  const sheepHerbicideOtherCO2 =
    sheepOtherHerbicideTonnes *
    herbicidePesticideAverage *
    constants.LIVESTOCK.EMISSION_BREAKDOWN.HERBICIDE.CO2;
  const sheepHerbicideOtherCH4 =
    sheepOtherHerbicideTonnes *
    herbicidePesticideAverage *
    constants.LIVESTOCK.EMISSION_BREAKDOWN.HERBICIDE.CH4;
  const sheepHerbicideOtherN2O =
    sheepOtherHerbicideTonnes *
    herbicidePesticideAverage *
    constants.LIVESTOCK.EMISSION_BREAKDOWN.HERBICIDE.N2O;
  const sheepHerbicideOtherTotalGHG =
    sheepHerbicideOtherCO2 + sheepHerbicideOtherCH4 + sheepHerbicideOtherN2O;

  // Total embedded emissions herbicide/pesticide
  const sheepTotalEmbeddedEmissions =
    sheepHerbicideTotalGHG + sheepHerbicideOtherTotalGHG;

  return {
    beef: beefTotalEmbeddedEmissions,
    sheep: sheepTotalEmbeddedEmissions,
    total: beefTotalEmbeddedEmissions + sheepTotalEmbeddedEmissions,
  };
}
