import { GrainsCrop } from '@/types/Grains/crop.input';
import { CropType } from '@/types/enums';
import { ExecutionContext } from '../executionContext';
import { ConstantsForGrainsCalculator } from './constants';
import {
  getAnnualN2OProductionEF,
  getCropResidueFractionRemoved,
  getFertiliserFractionRunoff,
  getUanNConstant,
  getUreaNConstant,
} from './functions';

export function calculateScope1N2O(
  crop: GrainsCrop,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { constants } = context;

  const ureaNContent = crop.ureaApplication * getUreaNConstant(context);
  const ureaAmmoniumNContent =
    crop.ureaAmmoniumNitrate * getUanNConstant(context);
  const massOfFertiliser =
    crop.areaSown *
    (crop.nonUreaNitrogen + ureaNContent + ureaAmmoniumNContent) *
    10 ** -6;

  const fracGASF = constants.COMMON.FRAC_GASF;

  // Mass of synthetic fertiliser volatilised
  const fertiliserMassVolatilised = massOfFertiliser * fracGASF;

  // for determining fertiliserC48
  const rainfallKey = crop.rainfallAbove600
    ? 'RAINFALL_GT_600'
    : 'RAINFALL_LT_600';

  const productionSystemEF =
    constants.CROP.PRODUCTIONSYSTEM_EF[rainfallKey][crop.productionSystem];

  const totalN2OAtmospheric =
    fertiliserMassVolatilised *
    productionSystemEF *
    constants.COMMON.GWP_FACTORSC15;
  const totalAtmosphericGgCO2 =
    totalN2OAtmospheric * constants.COMMON.GWP_FACTORSC6;

  const totalAtmosphericTonnes = totalAtmosphericGgCO2 * 1000;

  // Fertiliser N2O

  const annualN2OEmissions =
    massOfFertiliser * productionSystemEF * constants.COMMON.GWP_FACTORSC15;
  const totalFertiliserGgCO2 =
    annualN2OEmissions * constants.COMMON.GWP_FACTORSC6;
  const totalFertiliserTonnes = totalFertiliserGgCO2 * 1000;

  // Leaching and runoff N2O

  const annualProduction = (crop.averageGrainYield * crop.areaSown) / 1000;

  const {
    residueCropRatio,
    belowAboveResidueRatio,
    dryMatterContent,
    aboveGroundN,
    belowGroundN,
  } = constants.CROP.CROPRESIDUE[crop.type];

  const burnt0: CropType[] = [
    'Tuber and Roots',
    'Cotton',
    'Hops',
    'Forage Crops',
    'Lucerne',
    'Other legume',
    'Annual grass',
    'Grass clover mixture',
    'Perennial pasture',
  ];

  const intermediaryBurnt = burnt0.includes(crop.type)
    ? 0
    : constants.CROP.CROPRESIDUE_PROPORTIONBURNT[crop.state].burnt;

  const fractionBurnt =
    crop.type === 'Sugar Cane'
      ? constants.CROP.CROPRESIDUE_FRACTIONSUGARCANEBURNT[crop.state].burnt
      : intermediaryBurnt;

  const fractionRemoved = getCropResidueFractionRemoved(
    context,
    crop.type,
    crop.state,
  );

  // mass of N in crop residue
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

  const fertiliserFractionRunoff = getFertiliserFractionRunoff(context);

  const fracLeach = constants.COMMON.LEACHING.FRACLEACH_MMS;

  const leachingZoneMultiplier = crop.rainfallAbove600 ? 1 : 0;

  const fertiliserRunoffGgN =
    massOfFertiliser *
    fertiliserFractionRunoff *
    fracLeach *
    leachingZoneMultiplier;

  const fracWet = constants.COMMON.LEACHING.FRACWET;

  const residueN =
    totalMassNReturnedToSoil * fracWet * fracLeach * leachingZoneMultiplier;

  const leachingN2OProductionEF = constants.COMMON.LEACHING.N2O_EF;

  const annualN2OProduction =
    (fertiliserRunoffGgN + residueN) *
    leachingN2OProductionEF *
    constants.COMMON.GWP_FACTORSC15;

  const totalLeachingGgCO2 =
    annualN2OProduction * constants.COMMON.GWP_FACTORSC6;

  const totalLeachingTonnes = totalLeachingGgCO2 * 1000;

  // Crop residues

  const pastureType =
    crop.type as keyof typeof constants.CROP.PASTURE_ATTRIBUTES;

  const fractionOfPastureRenewed =
    constants.CROP.PASTURE_ATTRIBUTES[pastureType]?.FRACRENEWED_INTENSIVE ?? 0;

  const averageYield =
    constants.CROP.PASTURE_ATTRIBUTES[pastureType]?.AVERAGE_YIELD ?? 0;

  const belowToAbovePastureResidueRatio =
    constants.CROP.PASTURE_ATTRIBUTES[pastureType]?.BELOW_ABOVE_RATIO ?? 0;

  const nContentAboveGround =
    constants.CROP.PASTURE_ATTRIBUTES[pastureType]?.NCONTENT_ABOVEGROUND ?? 0;

  const nContentBelowGround =
    constants.CROP.PASTURE_ATTRIBUTES[pastureType]?.NCONTENT_BELOWGROUND ?? 0;

  const fractionOfPastureYieldRemoved =
    constants.CROP.PASTURE_ATTRIBUTES[pastureType]
      ?.NCONTENT_ABOVEGROUND_RESIDUE_REMOVED ?? 0;

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

  const annualN2OProductionEF = getAnnualN2OProductionEF(context);

  const annualN2OProductionPasture =
    (totalMassNReturnedToSoil + massOfNInPastureReturnedToSoil) *
    annualN2OProductionEF *
    constants.COMMON.GWP_FACTORSC15;

  const cropResiduePastureGgCO2 =
    annualN2OProductionPasture * constants.COMMON.GWP_FACTORSC6;

  const cropResidueTonnes = cropResiduePastureGgCO2 * 1000;

  return {
    atmosphericDepositionN2O: totalAtmosphericTonnes,
    fertiliserN2O: totalFertiliserTonnes,
    leachingAndRunoffN2O: totalLeachingTonnes,
    cropResidueN2O: cropResidueTonnes,
  };
}
