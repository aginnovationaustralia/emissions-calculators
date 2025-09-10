import { ExecutionContext } from '../executionContext';
import { SugarCrop } from '../types/Sugar/sugar.input';

export function calculateScope1FieldBurning(crop: SugarCrop, context: ExecutionContext) {
  const { constants } = context;

  // (cropResiduesC6)
  const annualProduction = (crop.averageCaneYield * crop.areaSown) / 1000;

  // (cropResiduesC7)
  const residueToCropRatio = constants.CROPRESIDUE['Sugar Cane'].residueCropRatio;

  // (constants.cropResiduesC9)
  const { dryMatterContent } = constants.CROPRESIDUE['Sugar Cane'];

  // (constants.cropResiduesC14)
  const fractionOfResidueAtBurn =
    constants.CROPRESIDUE['Sugar Cane'].fractionOfResidueAtBurning;

  // (constants.cropResiduesC15)
  const { carbonMassFraction } = constants.CROPRESIDUE['Sugar Cane'];

  const nitrogenAboveGround = constants.CROPRESIDUE['Sugar Cane'].aboveGroundN;

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
