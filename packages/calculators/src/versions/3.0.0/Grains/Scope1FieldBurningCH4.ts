import { ExecutionContext } from '../executionContext';
import { GrainsCrop } from '../types/Grains/crop.input';

export function calculateScope1FieldBurning(crop: GrainsCrop, context: ExecutionContext) {
  const { constants } = context;

  // (cropResiduesC6)
  const annualProduction = (crop.averageGrainYield * crop.areaSown) / 1000;

  // (cropResiduesC7)
  const residueToCropRatio = constants.CROPRESIDUE[crop.type].residueCropRatio;

  // (cropResiduesC9)
  const { dryMatterContent } = constants.CROPRESIDUE[crop.type];

  // (cropResiduesC14)
  const fractionOfResidueAtBurn =
    constants.CROPRESIDUE[crop.type].fractionOfResidueAtBurning;

  // (cropResiduesC15)
  const { carbonMassFraction } = constants.CROPRESIDUE[crop.type];

  const nitrogenAboveGround = constants.CROPRESIDUE[crop.type].aboveGroundN;

  // (fieldBurningC22)
  const massOfFuelBurnt =
    annualProduction *
      residueToCropRatio *
      fractionOfResidueAtBurn *
      dryMatterContent *
      constants.BURNING_EFFICIENCY_RESIDUE *
      crop.fractionOfAnnualCropBurnt ?? 0;

  // (fieldBurningC29)
  const annualMethaneFromBurning =
    massOfFuelBurnt *
      carbonMassFraction *
      constants.BURNING_METHANE_EF *
      constants.GWP_FACTORSC14 ?? 0;

  // (fieldBurningC39)
  const annualN2OFromBurning =
    massOfFuelBurnt * nitrogenAboveGround * constants.BURNING_N2O_EF * constants.GWP_FACTORSC15;

  // (fieldBurningC31)
  const totalMethaneGgCO2 = annualMethaneFromBurning * constants.GWP_FACTORSC5;
  const totalFieldBurningCH4 = totalMethaneGgCO2 * 1000;

  const totalNitrousGgCO2 = annualN2OFromBurning * constants.GWP_FACTORSC6;
  const totalFieldBurningN2O = totalNitrousGgCO2 * 1000;

  return { CH4: totalFieldBurningCH4, N2O: totalFieldBurningN2O };
}
