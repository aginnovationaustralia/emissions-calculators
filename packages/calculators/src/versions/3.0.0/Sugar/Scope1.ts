import { ExecutionContext } from '../executionContext';
import { SugarCrop } from '../types/Sugar/sugar.input';
import {
  getFertiliserFractionRunoff,
  getResidueBurned,
  getResidueRemoved,
  getUanNConstant,
  getUreaNConstant,
} from './functions';

export function calculateScope1N2O(crop: SugarCrop, context: ExecutionContext) {
  const { constants } = context;

  // (fertiliserC15)
  const ureaNContent = crop.ureaApplication * getUreaNConstant(context);
  // (fertiliserC17)
  const ureaAmmoniumNContent =
    crop.ureaAmmoniumNitrate * getUanNConstant(context);
  // (fertiliserC22)
  const massOfFertiliser =
    crop.areaSown *
    (crop.nonUreaNitrogen + ureaNContent + ureaAmmoniumNContent) *
    10 ** -6;

  // Mass of synthetic fertiliser volatilised
  // (atmosphericDepositionC11)
  const fertiliserMassVolatilised = massOfFertiliser * constants.FRAC_GASF;

  // for determining fertiliserC48
  const rainfallKey = crop.rainfallAbove600
    ? 'RAINFALL_GT_600'
    : 'RAINFALL_LT_600';

  // (fertiliserC48)
  const productionSystemEF =
    constants.PRODUCTIONSYSTEM_EF[rainfallKey][crop.productionSystem];

  // (atmosphericDepositionC19)
  const totalN2OAtmospheric =
    fertiliserMassVolatilised * productionSystemEF * constants.GWP_FACTORSC15;
  // (atmosphericDepositionC24)
  const totalAtmosphericGgCO2 = totalN2OAtmospheric * constants.GWP_FACTORSC6;

  // (atmosphericDepositionC25)
  const totalAtmosphericTonnes = totalAtmosphericGgCO2 * 1000;

  // Fertiliser N2O

  // (fertiliserC50)
  const annualN2OEmissions =
    massOfFertiliser * productionSystemEF * constants.GWP_FACTORSC15;
  // (fertiliserC52)
  const totalFertiliserGgCO2 = annualN2OEmissions * constants.GWP_FACTORSC6;
  const totalFertiliserTonnes = totalFertiliserGgCO2 * 1000;

  // Leaching and runoff N2O

  // (cropResiduesC6)
  const annualProduction = (crop.averageCaneYield * crop.areaSown) / 1000;

  // (cropResiduesC7:C11)
  const {
    residueCropRatio,
    belowAboveResidueRatio,
    dryMatterContent,
    aboveGroundN,
    belowGroundN,
  } = constants.CROPRESIDUE['Sugar Cane'];

  const fractionBurnt = getResidueBurned(crop);

  // (cropResiduesC13, cropResiduesL67:L82)
  const fractionRemoved = getResidueRemoved(context);

  // mass of N in crop residue
  // (cropResiduesC28)
  const totalMassNReturnedToSoil =
    annualProduction *
      residueCropRatio *
      (1 - fractionBurnt - fractionRemoved) *
      dryMatterContent *
      aboveGroundN +
    annualProduction *
      residueCropRatio *
      belowAboveResidueRatio *
      dryMatterContent *
      belowGroundN;

  // leachingAndRunoff row 51 is all FERTILISER_FRACTION_RUNOFF for state

  // (leachingAndRunoffC21)
  const fertiliserFractionRunoff = getFertiliserFractionRunoff(context);

  // (leachingAndRunoffE11)
  const fracLeach = constants.LEACHING.FRACLEACH_FERTILISER_SOILS;

  // (leachingAndRunoffC20)
  const leachingZoneMultiplier = crop.rainfallAbove600 ? 1 : 0;

  // (leachingAndRunoffC23)
  const fertiliserRunoffGgN =
    massOfFertiliser *
    fertiliserFractionRunoff *
    fracLeach *
    leachingZoneMultiplier;

  // (leachingAndRunoffE14)
  const fracWet = 1;

  // (leachingAndRunoffC24)
  const residueN =
    totalMassNReturnedToSoil * fracWet * fracLeach * leachingZoneMultiplier;

  // (leachingAndRunoffC32)
  const annualN2OProduction =
    (fertiliserRunoffGgN + residueN) *
    constants.LEACHING.N2O_EF *
    constants.GWP_FACTORSC15;

  // (leachingAndRunoffC34)
  const totalLeachingGgCO2 = annualN2OProduction * constants.GWP_FACTORSC6;

  const totalLeachingTonnes = totalLeachingGgCO2 * 1000;

  // Crop residues

  const pastureType = 'Sugar Cane' as keyof typeof constants.PASTURE_ATTRIBUTES;

  // (cropResiduesC34)
  const fractionOfPastureRenewed =
    constants.PASTURE_ATTRIBUTES[pastureType]?.FRACRENEWED_INTENSIVE ?? 0;

  // (cropResiduesC35)
  const averageYield =
    constants.PASTURE_ATTRIBUTES[pastureType]?.AVERAGE_YIELD ?? 0;

  // (cropResiduesC36)
  const belowToAbovePastureResidueRatio =
    constants.PASTURE_ATTRIBUTES[pastureType]?.BELOW_ABOVE_RATIO ?? 0;

  // (cropResiduesC37)
  const nContentAboveGround =
    constants.PASTURE_ATTRIBUTES[pastureType]?.NCONTENT_ABOVEGROUND ?? 0;

  // (cropResiduesC38)
  const nContentBelowGround =
    constants.PASTURE_ATTRIBUTES[pastureType]?.NCONTENT_BELOWGROUND ?? 0;

  // (cropResiduesC39)
  const fractionOfPastureYieldRemoved =
    constants.PASTURE_ATTRIBUTES[pastureType]
      ?.NCONTENT_ABOVEGROUND_RESIDUE_REMOVED ?? 0;

  // (cropResiduesC51)
  const massOfNInPastureReturnedToSoil =
    crop.areaSown *
      fractionOfPastureRenewed *
      (averageYield / 1000) *
      (1 - fractionOfPastureYieldRemoved) *
      nContentAboveGround +
    crop.areaSown *
      fractionOfPastureRenewed *
      (averageYield / 1000) *
      belowToAbovePastureResidueRatio *
      nContentBelowGround;

  // (cropResiduesE56)
  const annualN2OProductionEF = constants.SUGAR_ANNUAL_N2O_PRODUCTION_EF;

  // (cropResiduesC59)
  const annualN2OProductionPasture =
    (totalMassNReturnedToSoil + massOfNInPastureReturnedToSoil) *
    annualN2OProductionEF *
    constants.GWP_FACTORSC15;

  // (cropResiduesC61)
  const cropResiduePastureGgCO2 =
    annualN2OProductionPasture * constants.GWP_FACTORSC6;

  // (dataSummary_B13)
  const cropResidueTonnes = cropResiduePastureGgCO2 * 1000;

  return {
    atmosphericDepositionN2O: totalAtmosphericTonnes,
    fertiliserN2O: totalFertiliserTonnes,
    leachingAndRunoffN2O: totalLeachingTonnes,
    cropResidueN2O: cropResidueTonnes,
  };
}
