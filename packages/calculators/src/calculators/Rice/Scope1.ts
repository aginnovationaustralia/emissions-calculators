import { RiceCrop } from '@/types/Rice/rice.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForRiceCalculator } from './constants';
import {
  getFertiliserFractionRunoff,
  getNitrogenFertiliser,
} from './functions';

export function calculateScope1N2O(
  rice: RiceCrop,
  context: ExecutionContext<ConstantsForRiceCalculator>,
) {
  const { constants } = context;

  const nitrogenFertiliser = getNitrogenFertiliser(context, rice);

  // fertiliser N2O
  // (Fertiliser was C13 now D24)
  const totalMassFertiliser = rice.areaSown * nitrogenFertiliser * 10 ** -6;

  // (fertiliserC41)
  // NOTE: Rice is always irrigated
  // 'Data input - crops' sheet enforces > 600mm and irrigated production system
  const ef =
    constants.CROP.PRODUCTIONSYSTEM_EF.RAINFALL_GT_600['Irrigated crop'];

  // (Fertiliser was C43 now C48)
  const fertiliserN2O =
    totalMassFertiliser * ef * constants.COMMON.GWP_FACTORSC15;
  // Fertiliser C50
  const fertiliserN2OG = fertiliserN2O * constants.COMMON.GWP_FACTORSC6;
  const fertiliserN2OTonnes = fertiliserN2OG * 1000;

  // crop residue

  // (Crop_ResiduesC6)
  const annualProduction = (rice.averageRiceYield * rice.areaSown) / 1000;

  // (Crop_ResiduesC7)
  const { residueCropRatio } = constants.CROP.CROPRESIDUE.Rice;

  // (Crop_ResiduesC8)
  const belowAboveRatio =
    constants.CROP.CROPRESIDUE.Rice.belowAboveResidueRatio;

  // (Crop_ResiduesC9)
  const { dryMatterContent } = constants.CROP.CROPRESIDUE.Rice;

  // (Crop_ResiduesC10)
  const { aboveGroundN } = constants.CROP.CROPRESIDUE.Rice;

  // (Crop_ResiduesC11)
  const { belowGroundN } = constants.CROP.CROPRESIDUE.Rice;

  // always 0 for rice
  // (cropResiduesK56, Crop_ResiduesC12)
  const fractionBurnt = rice.fractionOfAnnualCropBurnt;

  // always 0 for rice
  // (cropResiduesL56, Crop_ResiduesC13)
  const { fractionRemoved } = constants.CROP.CROPRESIDUE.Rice;

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
  const residueN2OEF = constants.CROP.CROP_RESIDUE_N2O_EF;

  // (Crop_ResiduesC40)
  const residueGgN2O =
    massOfNReturnedToSoil * residueN2OEF * constants.COMMON.GWP_FACTORSC15;
  // (Crop_ResiduesC41)
  const residuesGgCO2 = residueGgN2O * constants.COMMON.GWP_FACTORSC6;

  // (Data_Summary_C13)
  const residueN2OTotal = residuesGgCO2 * 1000;

  // leeching

  // (Leaching_And_RunoffC21)
  const fractionOfNAvailableForRunoff = getFertiliserFractionRunoff(context);

  // (Leaching_And_RunoffE11)
  const fracLeach = constants.COMMON.LEACHING.FERT_N_FRACLEACH;

  // (Leaching_And_RunoffC20)
  const leechingZoneMultiplier = 1; // Rice is always > 600mm rainfall

  // (Leaching_And_RunoffC23)
  const fertiliserLeechingGgN =
    totalMassFertiliser *
    fractionOfNAvailableForRunoff *
    fracLeach *
    leechingZoneMultiplier;

  // (Leaching_And_RunoffE14)
  const fracWet = constants.COMMON.LEACHING.FRACWET;

  // (Leaching_And_RunoffC24)
  const leechingResidueNGgN =
    massOfNReturnedToSoil * fracWet * fracLeach * leechingZoneMultiplier;

  // (Leaching_And_RunoffE29)
  const leechingN2OEF = constants.COMMON.LEACHING.N2O_EF;

  // (Leaching_And_RunoffC32)
  const annualN2OLeeching =
    (fertiliserLeechingGgN + leechingResidueNGgN) *
    leechingN2OEF *
    constants.COMMON.GWP_FACTORSC15;

  // (Leaching_And_RunoffC34)
  const leechingGgCO2 = annualN2OLeeching * constants.COMMON.GWP_FACTORSC6;

  const leechingN2O = leechingGgCO2 * 1000;

  // atmospheric deposition

  // (Atmospheric_DepositionD10)
  const fracGASF = constants.COMMON.FRAC_GASF;

  // (Atmospheric_DepositionC12)
  const massOfFertiliserVolatilised = totalMassFertiliser * fracGASF;

  // (Atmospheric_DepositionC20)
  const annualN2OAtmospheric =
    massOfFertiliserVolatilised * ef * constants.COMMON.GWP_FACTORSC15;
  // (Atmospheric_DepositionC25)
  const atmosphericGgCO2 =
    annualN2OAtmospheric * constants.COMMON.GWP_FACTORSC6;
  const atmosphericN2O = atmosphericGgCO2 * 1000;

  // field burning

  // (Crop_ResiduesC14)
  const fractionRemainingAtBurning =
    constants.CROP.CROPRESIDUE.Rice.fractionOfResidueAtBurning;

  // (Field_BurningC10)
  const burningEfficiencyForResidue = constants.CROP.BURNING_EFFICIENCY_RESIDUE;

  // (Field_BurningC22)
  const massOfFuelBurnt =
    annualProduction *
    residueCropRatio *
    fractionRemainingAtBurning *
    dryMatterContent *
    burningEfficiencyForResidue *
    rice.fractionOfAnnualCropBurnt;

  // (Field_BurningD36)
  const burningN2OEF = constants.CROP.BURNING_N2O_EF;

  // (Field_BurningC39)
  const burningN2O =
    massOfFuelBurnt *
    aboveGroundN *
    burningN2OEF *
    constants.COMMON.GWP_FACTORSC15;

  // (Field_BurningC41)
  const burningGgCO2 = burningN2O * constants.COMMON.GWP_FACTORSC6;
  const burningN2OTonnes = burningGgCO2 * 1000;

  // (Crop_ResiduesC15)
  const { carbonMassFraction } = constants.CROP.CROPRESIDUE.Rice;

  // (Field_BurningE26)
  const methaneEF = constants.CROP.BURNING_METHANE_EF;

  // (Field_BurningC29)
  const methaneTotal =
    massOfFuelBurnt *
    carbonMassFraction *
    methaneEF *
    constants.COMMON.GWP_FACTORSC14;
  // (Field_BurningC31)
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
