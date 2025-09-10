import { ExecutionContext } from '../executionContext';
import { FeedlotStay } from '../types/Feedlot/stay.input';
import { FeedlotSystem } from '../types/types';
import { getFeedlotProductionSystemEF } from './functions';

// system is (dataInputD10, agriculturalSoilsB12)
// head (dataInputC15, nitrousOxideMMSD20, entericFermentationC6)
// liveweight kg (dataInputC17, entericFermentationC8)
// crudeprotein 0-100 (dataInputC19)
// nitrogenretention 0-100% (dataInputC21)
// averageLengthOfStay (dataInputC16, nitrousOxideMMSD25)
// Dietary net energy concentration MJ/kg
// dietaryNetEnergyConcentration (dataInputC20, entericFermentationC9)

export function calculateScope1Atmospheric(
  stay: FeedlotStay,
  system: FeedlotSystem,
  context: ExecutionContext,
) {
  const { constants } = context;

  // (agriculturalSoilsD12)
  const systemEF = constants.FEEDLOT_MANURE_EF[system].EF;
  // (agriculturalSoilsE12)
  const systemFracGASM = constants.FEEDLOT_MANURE_EF[system].FracGASM;

  // (nitrousOxideMMSD5)
  const cudeProteinFraction = stay.crudeProtein / 100;

  // (nitrousOxideMMSK8)
  const nitrogenIntake = (stay.dailyIntake * cudeProteinFraction) / 6.25;

  // (nitrousOxideMMSD15)
  const nitrogenRetentionFraction = stay.nitrogenRetention / 100;

  // (nitrousOxideMMSK14)
  const nitrogenExcreted = nitrogenIntake * (1 - nitrogenRetentionFraction);

  // (nitrousOxideMMSK20, agriculturalSoilsD15)
  const annualNitrogenExcretion =
    stay.livestock * nitrogenExcreted * stay.stayAverageDuration * 10 ** -6;

  // (agriculturalSoilsD24)
  // const mnLeach = 0;

  // (agriculturalSoilsD26)
  const animalWasteAppliedToSoil =
    annualNitrogenExcretion * (1 - systemEF - systemFracGASM) -
    constants.FEEDLOT_MN_LEACH;

  // (agriculturalSoilsD51)
  const massOfAnimalWasteVolatised =
    (animalWasteAppliedToSoil +
      constants.FEEDLOT_UN_SOIL +
      constants.FEEDLOT_FN_SOIL) *
    constants.FEEDLOT_AG_SOILS;

  // (agriculturalSoilsD62)
  const animalWaste =
    massOfAnimalWasteVolatised *
    getFeedlotProductionSystemEF(system, context) *
    constants.GWP_FACTORSC15;

  // (agriculturalSoilsD68)
  const totalAmmoniaLossesCO2 = animalWaste;

  // WARNING: GWP_FACTORSC6 is different for feedlot than it is grains, etc
  // (agriculturalSoilsD69)
  const totalAmmoniaLossesGgCO2 =
    totalAmmoniaLossesCO2 * constants.GWP_FACTORSC6;

  // (agriculturalSoilsD36)
  const annualN2OProduction =
    animalWasteAppliedToSoil *
    constants.FEEDLOT_ANNUAL_N2O_EF *
    constants.GWP_FACTORSC15;

  const annualN2OGg = annualN2OProduction * constants.GWP_FACTORSC6;

  const annualN2OTonnes = annualN2OGg * 10 ** 3;

  // (agriculturalSoilsD70, dataSummaryC15)
  const totalAtmosphericTonnes = totalAmmoniaLossesGgCO2 * 10 ** 3;

  return {
    atmosphericDeposition: totalAtmosphericTonnes,
    manureAppliedToSoil: annualN2OTonnes,
  };
}
