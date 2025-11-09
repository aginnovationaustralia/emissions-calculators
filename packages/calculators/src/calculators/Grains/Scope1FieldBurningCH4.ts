import { GrainsCrop } from '@/types/Grains/crop.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForGrainsCalculator } from './constants';

export function calculateScope1FieldBurning(
  crop: GrainsCrop,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { constants } = context;

  // (cropResiduesC6)
  const annualProduction = (crop.averageGrainYield * crop.areaSown) / 1000;

  // (cropResiduesC7)
  const residueToCropRatio =
    constants.CROP.CROPRESIDUE[crop.type].residueCropRatio;

  // (cropResiduesC9)
  const { dryMatterContent } = constants.CROP.CROPRESIDUE[crop.type];

  // (cropResiduesC14)
  const fractionOfResidueAtBurn =
    constants.CROP.CROPRESIDUE[crop.type].fractionOfResidueAtBurning;

  // (cropResiduesC15)
  const { carbonMassFraction } = constants.CROP.CROPRESIDUE[crop.type];

  const nitrogenAboveGround =
    constants.CROP.CROPRESIDUE[crop.type].aboveGroundN;

  // (fieldBurningC22)
  const massOfFuelBurnt =
    annualProduction *
    residueToCropRatio *
    fractionOfResidueAtBurn *
    dryMatterContent *
    constants.CROP.BURNING_EFFICIENCY_RESIDUE *
    crop.fractionOfAnnualCropBurnt;

  // (fieldBurningC29)
  const annualMethaneFromBurning =
    massOfFuelBurnt *
    carbonMassFraction *
    constants.CROP.BURNING_METHANE_EF *
    constants.COMMON.GWP_FACTORSC14;

  // (fieldBurningC39)
  const annualN2OFromBurning =
    massOfFuelBurnt *
    nitrogenAboveGround *
    constants.CROP.BURNING_N2O_EF *
    constants.COMMON.GWP_FACTORSC15;

  // (fieldBurningC31)
  const totalMethaneGgCO2 =
    annualMethaneFromBurning * constants.COMMON.GWP_FACTORSC5;
  const totalFieldBurningCH4 = totalMethaneGgCO2 * 1000;

  const totalNitrousGgCO2 =
    annualN2OFromBurning * constants.COMMON.GWP_FACTORSC6;
  const totalFieldBurningN2O = totalNitrousGgCO2 * 1000;

  return { CH4: totalFieldBurningCH4, N2O: totalFieldBurningN2O };
}
