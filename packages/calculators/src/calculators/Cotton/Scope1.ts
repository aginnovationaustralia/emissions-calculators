import { CottonCrop } from '@/types/Cotton/cotton.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForCottonCalculator } from './constants';
import {
  getFertiliserFractionRunoff,
  getNitrogenFertiliser,
} from './functions';

export function calculateScope1N2O(
  cotton: CottonCrop,
  context: ExecutionContext<ConstantsForCottonCalculator>,
) {
  const { constants } = context;

  const nitrogenFertiliser = getNitrogenFertiliser(context, cotton);

  // fertiliser N2O
  const totalMassFertiliser = cotton.areaSown * nitrogenFertiliser * 10 ** -6;

  const ef = cotton.rainfallAbove600
    ? constants.CROP.PRODUCTIONSYSTEM_EF.RAINFALL_GT_600.Cotton
    : constants.CROP.PRODUCTIONSYSTEM_EF.RAINFALL_LT_600.Cotton;

  const fertiliserN2O =
    totalMassFertiliser * ef * constants.COMMON.GWP_FACTORSC15;
  const fertiliserN2OG = fertiliserN2O * constants.COMMON.GWP_FACTORSC6;
  const fertiliserN2OTonnes = fertiliserN2OG * 1000;

  const annualProduction = (cotton.averageCottonYield * cotton.areaSown) / 1000;

  const { residueCropRatio } = constants.CROP.CROPRESIDUE.Cotton;

  const belowAboveRatio =
    constants.CROP.CROPRESIDUE.Cotton.belowAboveResidueRatio;

  const { dryMatterContent } = constants.CROP.CROPRESIDUE.Cotton;

  const { aboveGroundN } = constants.CROP.CROPRESIDUE.Cotton;

  const { belowGroundN } = constants.CROP.CROPRESIDUE.Cotton;

  // always 0 for cotton
  const fractionBurnt = 0;

  // always 0 for cotton
  const { fractionRemoved } = constants.CROP.CROPRESIDUE.Cotton;

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

  const residueN2OEF = constants.CROP.CROP_RESIDUE_N2O_EF;

  const residueGgN2O =
    massOfNReturnedToSoil * residueN2OEF * constants.COMMON.GWP_FACTORSC15;
  const residuesGgCO2 = residueGgN2O * constants.COMMON.GWP_FACTORSC6;

  const residueN2OTotal = residuesGgCO2 * 1000;

  const fractionOfNAvailableForRunoff = getFertiliserFractionRunoff(context);

  const fracLeach = constants.COMMON.LEACHING.FERT_N_FRACLEACH;

  const leechingZoneMultiplier = cotton.rainfallAbove600 ? 1 : 0;

  const fertiliserLeechingGgN =
    totalMassFertiliser *
    fractionOfNAvailableForRunoff *
    fracLeach *
    leechingZoneMultiplier;

  const fracWet = constants.COMMON.LEACHING.FRACWET;

  const leechingResidueNGgN =
    massOfNReturnedToSoil * fracWet * fracLeach * leechingZoneMultiplier;

  const leechingN2OEF = constants.COMMON.LEACHING.N2O_EF;

  const annualN2OLeeching =
    (fertiliserLeechingGgN + leechingResidueNGgN) *
    leechingN2OEF *
    constants.COMMON.GWP_FACTORSC15;

  const leechingGgCO2 = annualN2OLeeching * constants.COMMON.GWP_FACTORSC6;

  const leechingN2O = leechingGgCO2 * 1000;

  const fracGASF = constants.COMMON.FRAC_GASF;

  const massOfFertiliserVolatilised = totalMassFertiliser * fracGASF;

  const annualN2OAtmospheric =
    massOfFertiliserVolatilised * ef * constants.COMMON.GWP_FACTORSC15;
  const atmosphericGgCO2 =
    annualN2OAtmospheric * constants.COMMON.GWP_FACTORSC6;
  const atmosphericN2O = atmosphericGgCO2 * 1000;

  const fractionRemainingAtBurning =
    constants.CROP.CROPRESIDUE.Cotton.fractionOfResidueAtBurning;

  const burningEfficiencyForResidue = constants.CROP.BURNING_EFFICIENCY_RESIDUE;

  const massOfFuelBurnt =
    annualProduction *
    residueCropRatio *
    fractionRemainingAtBurning *
    dryMatterContent *
    burningEfficiencyForResidue *
    0; // always 0 for cotton

  const burningN2OEF = constants.CROP.BURNING_N2O_EF;

  const burningN2O =
    massOfFuelBurnt *
    aboveGroundN *
    burningN2OEF *
    constants.COMMON.GWP_FACTORSC15;

  const burningGgCO2 = burningN2O * constants.COMMON.GWP_FACTORSC6;
  const burningN2OTonnes = burningGgCO2 * 1000;

  const { carbonMassFraction } = constants.CROP.CROPRESIDUE.Cotton;

  const methaneEF = constants.CROP.BURNING_METHANE_EF;

  const methaneTotal =
    massOfFuelBurnt *
    carbonMassFraction *
    methaneEF *
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
