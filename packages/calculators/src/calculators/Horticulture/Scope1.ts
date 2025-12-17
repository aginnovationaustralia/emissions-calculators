import { HorticultureCrop } from '@/types/Horticulture/horticulture.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForHorticultureCalculator } from './constants';
import { getUanNConstant } from './functions';

export function calculateScope1N2O(
  horticulture: HorticultureCrop,
  context: ExecutionContext<ConstantsForHorticultureCalculator>,
) {
  const { constants } = context;

  const nitrogenFertiliser =
    horticulture.ureaApplication * constants.COMMON.FERTILISER_CONTENT.UREA.N +
    horticulture.nonUreaNitrogen +
    horticulture.ureaAmmoniumNitrate * getUanNConstant(context);

  // fertiliser N2O
  const totalMassFertiliser =
    horticulture.areaSown * nitrogenFertiliser * 10 ** -6;

  const ef = horticulture.rainfallAbove600
    ? constants.CROP.PRODUCTIONSYSTEM_EF.RAINFALL_GT_600.Horticulture
    : constants.CROP.PRODUCTIONSYSTEM_EF.RAINFALL_LT_600.Horticulture;

  const fertiliserN2O =
    totalMassFertiliser * ef * constants.COMMON.GWP_FACTORSC15;
  const fertiliserN2OG = fertiliserN2O * constants.COMMON.GWP_FACTORSC6;
  const fertiliserN2OTonnes = fertiliserN2OG * 1000;

  // crop residue

  const annualProduction =
    (horticulture.averageYield * horticulture.areaSown) / 1000;

  const { residueCropRatio } = constants.CROP.CROPRESIDUE[horticulture.type];

  const belowAboveRatio =
    constants.CROP.CROPRESIDUE[horticulture.type].belowAboveResidueRatio;

  const { dryMatterContent } = constants.CROP.CROPRESIDUE[horticulture.type];

  const { aboveGroundN } = constants.CROP.CROPRESIDUE[horticulture.type];

  const { belowGroundN } = constants.CROP.CROPRESIDUE[horticulture.type];

  // always 0 for horticulture
  const { fractionBurnt } = constants.CROP.CROPRESIDUE[horticulture.type];

  // always 0 for horticulture
  const { fractionRemoved } = constants.CROP.CROPRESIDUE[horticulture.type];

  const massOfNReturnedToSoil =
    annualProduction *
      residueCropRatio *
      (1 - fractionBurnt - fractionRemoved) *
      dryMatterContent *
      aboveGroundN +
    annualProduction *
      residueCropRatio *
      belowAboveRatio *
      dryMatterContent *
      belowGroundN;

  const residueGgN2O =
    massOfNReturnedToSoil *
    constants.CROP.CROP_RESIDUE_N2O_EF *
    constants.COMMON.GWP_FACTORSC15;
  const residuesGgCO2 = residueGgN2O * constants.COMMON.GWP_FACTORSC6;

  const residueN2OTotal = residuesGgCO2 * 1000;

  // leeching

  const fracLeach = constants.COMMON.LEACHING.FRACLEACH_MMS;

  const fracWet = constants.COMMON.LEACHING.FRACWET;

  const fertiliserLeechingGgN = totalMassFertiliser * fracWet * fracLeach;

  const leechingResidueNGgN = massOfNReturnedToSoil * fracWet * fracLeach;

  const annualN2OLeeching =
    (fertiliserLeechingGgN + leechingResidueNGgN) *
    constants.COMMON.LEACHING.N2O_EF *
    constants.COMMON.GWP_FACTORSC15;

  const leechingGgCO2 = annualN2OLeeching * constants.COMMON.GWP_FACTORSC6;

  const leechingN2O = leechingGgCO2 * 1000;

  // atmospheric deposition

  const massOfFertiliserVolatilised =
    totalMassFertiliser * constants.COMMON.FRAC_GASF;

  const annualN2OAtmospheric =
    massOfFertiliserVolatilised * ef * constants.COMMON.GWP_FACTORSC15;
  const atmosphericGgCO2 =
    annualN2OAtmospheric * constants.COMMON.GWP_FACTORSC6;
  const atmosphericN2O = atmosphericGgCO2 * 1000;

  // field burning

  const fractionRemainingAtBurning =
    constants.CROP.CROPRESIDUE[horticulture.type].fractionOfResidueAtBurning;

  const burningEfficiencyForResidue = constants.CROP.BURNING_EFFICIENCY_RESIDUE;

  const massOfFuelBurnt =
    annualProduction *
    residueCropRatio *
    fractionRemainingAtBurning *
    dryMatterContent *
    burningEfficiencyForResidue *
    horticulture.fractionOfAnnualCropBurnt;

  const burningN2O =
    massOfFuelBurnt *
    aboveGroundN *
    constants.CROP.BURNING_N2O_EF *
    constants.COMMON.GWP_FACTORSC15;

  const burningGgCO2 = burningN2O * constants.COMMON.GWP_FACTORSC6;
  const burningN2OTonnes = burningGgCO2 * 1000;

  const { carbonMassFraction } = constants.CROP.CROPRESIDUE[horticulture.type];

  const methaneTotal =
    massOfFuelBurnt *
    carbonMassFraction *
    constants.CROP.BURNING_METHANE_EF *
    constants.COMMON.GWP_FACTORSC14;
  const methaneBurningGg = methaneTotal * constants.COMMON.GWP_FACTORSC5;
  const burningCH4 = methaneBurningGg * 1000;

  return {
    cropResiduesN2O: residueN2OTotal,
    fertiliserN2O: fertiliserN2OTonnes,
    leechingN2O,
    atmosphericN2O,
    burningN2O: burningN2OTonnes,
    burningCH4,
  };
}
