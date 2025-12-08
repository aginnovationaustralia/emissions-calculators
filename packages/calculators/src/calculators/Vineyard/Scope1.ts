import { VineyardCrop } from '@/types/Vineyard/vineyard.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForVineyardCalculator } from './constants';

export function getNitrogenFertiliser(
  context: ExecutionContext<ConstantsForVineyardCalculator>,
  vineyard: VineyardCrop,
) {
  const { constants } = context;

  return (
    vineyard.ureaApplication * constants.COMMON.FERTILISER_CONTENT.UREA.N +
    vineyard.nonUreaNitrogen +
    vineyard.ureaAmmoniumNitrate * constants.COMMON.FERTILISER_CONTENT.UAN.N
  );
}

export function getFertiliserFractionRunoff(
  context: ExecutionContext<ConstantsForVineyardCalculator>,
) {
  const { constants } = context;

  return constants.CROP.FERTILISER_FRACTION_RUNOFF_STATIC;
}

export function calculateScope1N2O(
  vineyard: VineyardCrop,
  context: ExecutionContext<ConstantsForVineyardCalculator>,
) {
  const { constants } = context;
  const { PRODUCTIONSYSTEM_EF } = constants.CROP;

  const { irrigated, rainfallAbove600 } = vineyard;

  const nitrogenFertiliser = getNitrogenFertiliser(context, vineyard);

  // fertiliser N2O
  const totalMassFertiliser =
    vineyard.areaPlanted * nitrogenFertiliser * 10 ** -6;

  const productionSystemEfs = rainfallAbove600
    ? PRODUCTIONSYSTEM_EF.RAINFALL_GT_600
    : PRODUCTIONSYSTEM_EF.RAINFALL_LT_600;
  const ef = irrigated
    ? productionSystemEfs['Irrigated crop']
    : productionSystemEfs['Non-irrigated crop'];

  const fertiliserN2O =
    totalMassFertiliser * ef * constants.COMMON.GWP_FACTORSC15;
  const fertiliserN2OG = fertiliserN2O * constants.COMMON.GWP_FACTORSC6;
  const fertiliserN2OTonnes = fertiliserN2OG * 1000;

  // crop residue

  const annualProduction =
    (vineyard.averageYield * vineyard.areaPlanted) / 1000;

  // Use hops for vineyards
  const cropResidue = constants.CROP.CROPRESIDUE.Hops;

  const {
    residueCropRatio,
    belowAboveResidueRatio,
    dryMatterContent,
    aboveGroundN,
    belowGroundN,
  } = cropResidue;

  // always 0 for vineyard
  const fractionBurnt = 0;

  // always 0 for vineyard
  const fractionRemoved = 0;

  const massOfNReturnedToSoil =
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

  const residueN2OEF = constants.CROP.CROP_RESIDUE_N2O_EF;

  const residueGgN2O =
    massOfNReturnedToSoil * residueN2OEF * constants.COMMON.GWP_FACTORSC15;
  const residuesGgCO2 = residueGgN2O * constants.COMMON.GWP_FACTORSC6;

  const residueN2OTotal = residuesGgCO2 * 1000;

  // leeching

  const fractionOfNAvailableForRunoff = getFertiliserFractionRunoff(context);

  const fracLeach = constants.COMMON.LEACHING.FERT_N_FRACLEACH;

  const nonIrrigatedMultiplier = vineyard.rainfallAbove600 ? 1 : 0;
  const leechingZoneMultiplier = vineyard.irrigated
    ? 1
    : nonIrrigatedMultiplier;

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

  // atmospheric deposition

  const fracGASF = constants.COMMON.FRAC_GASF;

  const massOfFertiliserVolatilised = totalMassFertiliser * fracGASF;

  const annualN2OAtmospheric =
    massOfFertiliserVolatilised * ef * constants.COMMON.GWP_FACTORSC15;
  const atmosphericGgCO2 =
    annualN2OAtmospheric * constants.COMMON.GWP_FACTORSC6;
  const atmosphericN2O = atmosphericGgCO2 * 1000;

  return {
    cropResiduesN2O: residueN2OTotal,
    fertiliserN2O: fertiliserN2OTonnes,
    leechingN2O,
    atmosphericN2O,
  };
}
