import { ExecutionContext } from '../executionContext';
import { VineyardCrop } from '../types/Vineyard/vineyard.input';

export function getNitrogenFertiliser(
  context: ExecutionContext,
  vineyard: VineyardCrop,
) {
  const { constants } = context;

  return (
    vineyard.ureaApplication * constants.FERTILISER_CONTENT.UREA.N +
    vineyard.nonUreaNitrogen +
    vineyard.ureaAmmoniumNitrate * constants.FERTILISER_CONTENT.UAN.N
  );
}

export function getFertiliserFractionRunoff(context: ExecutionContext) {
  const { constants } = context;

  return constants.FERTILISER_FRACTION_RUNOFF_STATIC;
}

export function calculateScope1N2O(
  vineyard: VineyardCrop,
  context: ExecutionContext,
) {
  const { constants } = context;
  const { PRODUCTIONSYSTEM_EF } = constants;

  const { irrigated, rainfallAbove600 } = vineyard;

  const nitrogenFertiliser = getNitrogenFertiliser(context, vineyard);

  // fertiliser N2O
  // Fertiliser C24
  const totalMassFertiliser =
    vineyard.areaPlanted * nitrogenFertiliser * 10 ** -6;

  const productionSystemEfs = rainfallAbove600
    ? PRODUCTIONSYSTEM_EF.RAINFALL_GT_600
    : PRODUCTIONSYSTEM_EF.RAINFALL_LT_600;
  // (fertiliserD32)
  const ef = irrigated
    ? productionSystemEfs['Irrigated crop']
    : productionSystemEfs['Non-irrigated crop'];

  // (Fertiliser was C37)
  const fertiliserN2O = totalMassFertiliser * ef * constants.GWP_FACTORSC15;
  // Fertiliser C39
  const fertiliserN2OG = fertiliserN2O * constants.GWP_FACTORSC6;
  const fertiliserN2OTonnes = fertiliserN2OG * 1000;

  // crop residue

  // (Crop_ResiduesC6)
  const annualProduction =
    (vineyard.averageYield * vineyard.areaPlanted) / 1000;

  // Use hops for vineyards
  const cropResidue = constants.CROPRESIDUE.Hops;

  // (Crop_ResiduesC7)
  const {
    residueCropRatio,
    belowAboveResidueRatio,
    dryMatterContent,
    aboveGroundN,
    belowGroundN,
  } = cropResidue;

  // always 0 for vineyard
  // (cropResiduesK56, Crop_ResiduesC12)
  const fractionBurnt = 0;

  // always 0 for vineyard
  // (cropResiduesL56, Crop_ResiduesC13)
  const fractionRemoved = 0;

  // ElectricityC2 is state

  // (Crop_ResiduesC30)
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

  // (Crop_ResiduesD33)
  const residueN2OEF = constants.CROP_RESIDUE_N2O_EF;

  // (Crop_ResiduesC33)
  const residueGgN2O =
    massOfNReturnedToSoil * residueN2OEF * constants.GWP_FACTORSC15;
  // (Crop_ResiduesC36)
  const residuesGgCO2 = residueGgN2O * constants.GWP_FACTORSC6;

  // (Crop residues C37)
  const residueN2OTotal = residuesGgCO2 * 1000;

  // leeching

  // (Leaching_And_RunoffC21)
  const fractionOfNAvailableForRunoff = getFertiliserFractionRunoff(context);

  // (Leaching_And_RunoffE11)
  const fracLeach = constants.LEACHING.FERT_N_FRACLEACH;

  const nonIrrigatedMultiplier = vineyard.rainfallAbove600 ? 1 : 0;
  // (Leaching_And_RunoffC20)
  const leechingZoneMultiplier = vineyard.irrigated
    ? 1
    : nonIrrigatedMultiplier;

  // (Leaching_And_RunoffC22)
  const fertiliserLeechingGgN =
    totalMassFertiliser *
    fractionOfNAvailableForRunoff *
    fracLeach *
    leechingZoneMultiplier;

  // (Leaching_And_RunoffE14)
  const fracWet = constants.LEACHING.FRACWET;

  // (Leaching_And_RunoffC23)
  const leechingResidueNGgN =
    massOfNReturnedToSoil * fracWet * fracLeach * leechingZoneMultiplier;

  // (Leaching_And_RunoffE29)
  const leechingN2OEF = constants.LEACHING.N2O_EF;

  // (Leaching_And_RunoffC32)
  const annualN2OLeeching =
    (fertiliserLeechingGgN + leechingResidueNGgN) *
    leechingN2OEF *
    constants.GWP_FACTORSC15;

  // (Leaching_And_RunoffC33)
  const leechingGgCO2 = annualN2OLeeching * constants.GWP_FACTORSC6;

  // (Leaching_And_RunoffC35)
  const leechingN2O = leechingGgCO2 * 1000;

  // atmospheric deposition

  // (Atmospheric_DepositionD10)
  const fracGASF = constants.FRAC_GASF;

  // (Atmospheric_DepositionC12)
  const massOfFertiliserVolatilised = totalMassFertiliser * fracGASF;

  // (Atmospheric_DepositionC28)
  const annualN2OAtmospheric =
    massOfFertiliserVolatilised * ef * constants.GWP_FACTORSC15;
  // (Atmospheric_DepositionC22)
  const atmosphericGgCO2 = annualN2OAtmospheric * constants.GWP_FACTORSC6;
  const atmosphericN2O = atmosphericGgCO2 * 1000;

  return {
    cropResiduesN2O: residueN2OTotal,
    fertiliserN2O: fertiliserN2OTonnes,
    leechingN2O,
    atmosphericN2O,
  };
}
