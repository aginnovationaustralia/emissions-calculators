import { ExecutionContext } from '../executionContext';
import { HorticultureCrop } from '../types/Horticulture/horticulture.input';
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
  // (FertiliserC13)
  const totalMassFertiliser =
    horticulture.areaSown * nitrogenFertiliser * 10 ** -6;

  // (fertiliserC41)
  const ef = horticulture.rainfallAbove600
    ? constants.CROP.PRODUCTIONSYSTEM_EF.RAINFALL_GT_600.Horticulture
    : constants.CROP.PRODUCTIONSYSTEM_EF.RAINFALL_LT_600.Horticulture;

  // (FertiliserC43)
  const fertiliserN2O =
    totalMassFertiliser * ef * constants.COMMON.GWP_FACTORSC15;
  const fertiliserN2OG = fertiliserN2O * constants.COMMON.GWP_FACTORSC6;
  const fertiliserN2OTonnes = fertiliserN2OG * 1000;

  const finalFertiliser = horticulture.nitrificationInhibitorUsed
    ? fertiliserN2OTonnes * 0.5
    : fertiliserN2OTonnes;

  // crop residue

  // (Crop_ResiduesC6)
  const annualProduction =
    (horticulture.averageYield * horticulture.areaSown) / 1000;

  // (Crop_ResiduesC7)
  const { residueCropRatio } = constants.CROP.CROPRESIDUE[horticulture.type];

  // (Crop_ResiduesC8)
  const belowAboveRatio =
    constants.CROP.CROPRESIDUE[horticulture.type].belowAboveResidueRatio;

  // (Crop_ResiduesC9)
  const { dryMatterContent } = constants.CROP.CROPRESIDUE[horticulture.type];

  // (Crop_ResiduesC10)
  const { aboveGroundN } = constants.CROP.CROPRESIDUE[horticulture.type];

  // (Crop_ResiduesC11)
  const { belowGroundN } = constants.CROP.CROPRESIDUE[horticulture.type];

  // always 0 for horticulture
  // (cropResiduesK56, Crop_ResiduesC12)
  const { fractionBurnt } = constants.CROP.CROPRESIDUE[horticulture.type];

  // always 0 for horticulture
  // (cropResiduesL56, Crop_ResiduesC13)
  const { fractionRemoved } = constants.CROP.CROPRESIDUE[horticulture.type];

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
      belowAboveRatio *
      dryMatterContent *
      belowGroundN;

  // (Crop_ResiduesD33)

  // (Crop_ResiduesC36)
  const residueGgN2O =
    massOfNReturnedToSoil *
    constants.CROP.CROP_RESIDUE_N2O_EF *
    constants.COMMON.GWP_FACTORSC15;
  // (Crop_ResiduesC38)
  const residuesGgCO2 = residueGgN2O * constants.COMMON.GWP_FACTORSC6;

  // (Data_Summary_C13)
  const residueN2OTotal = residuesGgCO2 * 1000;

  // leeching

  // (Leaching_And_RunoffE11)
  const fracLeach = constants.COMMON.LEACHING.FRACLEACH_MMS;

  // (Leaching_And_RunoffE14)
  const fracWet = constants.COMMON.LEACHING.FRACWET;

  // (Leaching_And_RunoffC23)
  const fertiliserLeechingGgN = totalMassFertiliser * fracWet * fracLeach;

  // (Leaching_And_RunoffC24)
  const leechingResidueNGgN = massOfNReturnedToSoil * fracWet * fracLeach;

  // (Leaching_And_RunoffC32)
  const annualN2OLeeching =
    (fertiliserLeechingGgN + leechingResidueNGgN) *
    constants.COMMON.LEACHING.N2O_EF *
    constants.COMMON.GWP_FACTORSC15;

  // (Leaching_And_RunoffC34)
  const leechingGgCO2 = annualN2OLeeching * constants.COMMON.GWP_FACTORSC6;

  const leechingN2O = leechingGgCO2 * 1000;

  const finalLeaching = horticulture.nitrificationInhibitorUsed
    ? 0.5 * leechingN2O
    : leechingN2O;

  // atmospheric deposition

  // (Atmospheric_DepositionC12)
  const massOfFertiliserVolatilised =
    totalMassFertiliser * constants.COMMON.FRAC_GASF;

  // (Atmospheric_DepositionC20)
  const annualN2OAtmospheric =
    massOfFertiliserVolatilised * ef * constants.COMMON.GWP_FACTORSC15;
  // (Atmospheric_DepositionC25)
  const atmosphericGgCO2 =
    annualN2OAtmospheric * constants.COMMON.GWP_FACTORSC6;
  const atmosphericN2O = horticulture.ureaseInhibitorUsed
    ? 0
    : atmosphericGgCO2 * 1000;

  // field burning

  // (Crop_ResiduesC14)
  const fractionRemainingAtBurning =
    constants.CROP.CROPRESIDUE[horticulture.type].fractionOfResidueAtBurning;

  // (Field_BurningC10)
  const burningEfficiencyForResidue = constants.CROP.BURNING_EFFICIENCY_RESIDUE;

  // (Field_BurningC22)
  const massOfFuelBurnt =
    annualProduction *
    residueCropRatio *
    fractionRemainingAtBurning *
    dryMatterContent *
    burningEfficiencyForResidue *
    horticulture.fractionOfAnnualCropBurnt;

  // (Field_BurningC39)
  const burningN2O =
    massOfFuelBurnt *
    aboveGroundN *
    constants.CROP.BURNING_N2O_EF *
    constants.COMMON.GWP_FACTORSC15;

  // (Field_BurningC41)
  const burningGgCO2 = burningN2O * constants.COMMON.GWP_FACTORSC6;
  const burningN2OTonnes = burningGgCO2 * 1000;

  // (Crop_ResiduesC15)
  const { carbonMassFraction } = constants.CROP.CROPRESIDUE[horticulture.type];

  // (Field_BurningC29)
  const methaneTotal =
    massOfFuelBurnt *
    carbonMassFraction *
    constants.CROP.BURNING_METHANE_EF *
    constants.COMMON.GWP_FACTORSC14;
  // (Field_BurningC31)
  const methaneBurningGg = methaneTotal * constants.COMMON.GWP_FACTORSC5;
  const burningCH4 = methaneBurningGg * 1000;

  return {
    cropResiduesN2O: residueN2OTotal,
    fertiliserN2O: finalFertiliser,
    leechingN2O: finalLeaching,
    atmosphericN2O,
    burningN2O: burningN2OTonnes,
    burningCH4,
  };
}
