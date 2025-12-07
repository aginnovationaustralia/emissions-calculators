import { FeedlotStay } from '@/types/Feedlot/stay.input';
import { FeedlotSystem } from '@/types/enums';
import { ExecutionContext } from '../executionContext';
import { ConstantsForFeedlotCalculator } from './constants';
import { getFeedlotProductionSystemEF } from './functions';

// system is
// head
// liveweight kg
// crudeprotein 0-100
// nitrogen retention 0-100%
// averageLengthOfStay
// Dietary net energy concentration MJ/kg
// dietaryNetEnergyConcentration

export function calculateScope1Atmospheric(
  stay: FeedlotStay,
  system: FeedlotSystem,
  context: ExecutionContext<ConstantsForFeedlotCalculator>,
) {
  const { constants } = context;

  const systemEF = constants.FEEDLOT.MANURE_EF[system].EF;
  const systemFracGASM = constants.FEEDLOT.MANURE_EF[system].FracGASM;

  const crudeProteinFraction = stay.crudeProtein / 100;

  const nitrogenIntake = (stay.dailyIntake * crudeProteinFraction) / 6.25;

  const nitrogenRetentionFraction = stay.nitrogenRetention / 100;

  const nitrogenExcreted = nitrogenIntake * (1 - nitrogenRetentionFraction);

  const annualNitrogenExcretion =
    stay.livestock * nitrogenExcreted * stay.stayAverageDuration * 10 ** -6;

  const animalWasteAppliedToSoil =
    annualNitrogenExcretion * (1 - systemEF - systemFracGASM) -
    constants.FEEDLOT.MN_LEACH;

  const massOfAnimalWasteVolatised =
    (animalWasteAppliedToSoil +
      constants.FEEDLOT.UN_SOIL +
      constants.FEEDLOT.FN_SOIL) *
    constants.FEEDLOT.AG_SOILS;

  const animalWaste =
    massOfAnimalWasteVolatised *
    getFeedlotProductionSystemEF(system, context) *
    constants.COMMON.GWP_FACTORSC15;

  const totalAmmoniaLossesCO2 = animalWaste;

  const totalAmmoniaLossesGgCO2 =
    totalAmmoniaLossesCO2 * constants.COMMON.GWP_FACTORSC6;

  const annualN2OProduction =
    animalWasteAppliedToSoil *
    constants.FEEDLOT.ANNUAL_N2O_EF *
    constants.COMMON.GWP_FACTORSC15;

  const annualN2OGg = annualN2OProduction * constants.COMMON.GWP_FACTORSC6;

  const annualN2OTonnes = annualN2OGg * 10 ** 3;

  const totalAtmosphericTonnes = totalAmmoniaLossesGgCO2 * 10 ** 3;

  return {
    atmosphericDeposition: totalAtmosphericTonnes,
    manureAppliedToSoil: annualN2OTonnes,
  };
}
