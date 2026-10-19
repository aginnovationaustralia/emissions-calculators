import { ExecutionContext } from '@/calculators/executionContext';
import { HasClimateZoneInputTransformed } from '@/calculators/types/has-climate-zone.input';
import { selectConstant } from '@/tools/constants';
import { oneMinus, zeroN2O } from '@/tools/sentinels';
import { ConstantsForResidueManagement, HasCropConstants } from './constants';
import {
  getAverageYieldForPasture,
  HasCropOrPastureResidueInputTransformed,
  isPastureResidueInput,
  PastureResidueInputTransformed,
} from './crop-residue.input';

export const calculateMassNPastureAppliedToSoil = (
  pasture: PastureResidueInputTransformed,
  constants: HasCropConstants,
) => {
  const ap = pasture.areaManaged;
  const yp = getAverageYieldForPasture(pasture, constants);

  const ncagp = selectConstant(
    constants.CROP,
    'PASTURERESIDUE',
    pasture.type,
    'aboveGroundN',
  ).named('NCAGp');
  const rbgp = selectConstant(
    constants.CROP,
    'PASTURERESIDUE',
    pasture.type,
    'belowAboveResidueRatio',
  ).named('RBGp');
  const ncbgp = selectConstant(
    constants.CROP,
    'PASTURERESIDUE',
    pasture.type,
    'belowGroundN',
  ).named('NCBGp');
  const ffodp = selectConstant(
    constants.CROP,
    'PASTURERESIDUE',
    pasture.type,
    'fractionRemoved',
  ).named('FFODp');

  /**
   * Ap * (Yp * 10^3)
   *
   * NOTE: We've already converted the yield to kg per m^2 (and area to m^2), so we don't
   * need to convert it again by multiplying by a power of 10
   */
  const totalYield = yp.multiply(ap);

  /**
   * (Ap * (Yp * 10^3) * (1 - FFODp) * NCAGp)
   */
  const mpAboveGround = totalYield.multiply(oneMinus(ffodp)).multiply(ncagp);
  /**
   * (Ap * (Yp * 10^3) * RBGp * NCBGp)
   */
  const mpBelowGround = totalYield.multiply(rbgp).multiply(ncbgp);

  /**
   * Mp = (Ap * (Yp * 10^3) * (1 - FFODp) * NCAGp) + (Ap * (Yp * 10^3) * RBGp * NCBGp)
   */
  return mpAboveGround.plus(mpBelowGround).named('Mp').reference('6.2.1.1 (2)');
};

export const calculate62PastureResidueN2O = (
  activity: HasCropOrPastureResidueInputTransformed &
    HasClimateZoneInputTransformed,
  context: ExecutionContext<ConstantsForResidueManagement>,
) => {
  const { constants } = context;
  /**
   * En2o = SUMp (Mp * EFni) * Cn2o * 10^-3
   */

  if (!isPastureResidueInput(activity)) {
    return zeroN2O;
  }

  const { pasture } = activity;

  const mp = calculateMassNPastureAppliedToSoil(pasture, constants);

  const efni = selectConstant(
    constants.CROP,
    'EF_RESIDUES_RETURNED_TO_SOIL',
    activity.climateZone,
  ).named('EFni');
  const cn2o = selectConstant(constants.COMMON, 'ELEMENTAL_TO_MOLECULAR_N2O');

  const pastureResidueN2O = mp
    .multiply(efni)
    .multiply(cn2o)
    .named('En2o')
    .reference('6.2.1.1 (1)');

  return pastureResidueN2O;
};
