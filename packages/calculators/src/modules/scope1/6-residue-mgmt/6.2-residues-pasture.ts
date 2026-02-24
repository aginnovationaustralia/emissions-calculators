import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import {
  isPastureType,
  PastureType,
} from '@/calculators/Grains/constants/enums';
import { ExecutionContext } from '@/calculators/Grains/constants/executionContext';
import { BaseGrainsCropTransformed } from '@/calculators/Grains/types/base-crop.input';
import { selectConstant } from '@/tools/constants';
import { oneMinus, tenToPowMinus3, zeroN2O } from '@/tools/sentinels';
import { massPerMass, realNumber } from '@/tools/units';
import { CropResidueInputTransformed } from './crop-residue.input';

export const calculateMassNPastureAppliedToSoil = (
  crop: CropResidueInputTransformed & BaseGrainsCropTransformed,
  pastureType: PastureType,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;

  const ap = crop.areaSown;
  const yp = crop.averageYield;
  const ncagp = selectConstant(
    constants.CROP,
    (value) => massPerMass('N', 'DryMatter', value),
    'PASTURERESIDUE',
    pastureType,
    'aboveGroundN',
  );
  const rbgp = selectConstant(
    constants.CROP,
    (value) => realNumber(value),
    'PASTURERESIDUE',
    pastureType,
    'belowAboveResidueRatio',
  );
  const ncbgp = selectConstant(
    constants.CROP,
    (value) => massPerMass('N', 'DryMatter', value),
    'PASTURERESIDUE',
    pastureType,
    'belowGroundN',
  );
  const ffodp = selectConstant(
    constants.CROP,
    (value) => realNumber(value),
    'PASTURERESIDUE',
    pastureType,
    'fractionRemoved',
  );

  const mpAboveGround = yp
    .multiply(tenToPowMinus3)
    .multiply(ap)
    .multiply(oneMinus(ffodp))
    .multiply(ncagp);
  const mpBelowGround = yp
    .multiply(tenToPowMinus3)
    .multiply(ap)
    .multiply(rbgp)
    .multiply(ncbgp);
  const mp = mpAboveGround.plus(mpBelowGround);

  return mp;
};

export const calculate62PastureResidueN2O = (
  crop: CropResidueInputTransformed & BaseGrainsCropTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;

  // REVISIT: This type is accepting crop and pasture types. Is it correct to merge both together? The input shape might be more obviously distinct as we add other calculators
  if (!isPastureType(crop.type)) {
    return zeroN2O;
  }

  /* pastureResidueN2O
    6.2.1.1 Method 1 -- Pasture Residue N2O Emissions
    (1) Nitrous oxide emissions from the return of pasture residues from all pasture types p
    to the soil, EN2O (t N2O), are calculated as:
    EN2O = SUMp (Mp * EF Ni * CN2O * 10^-3)
    Where Mp = the mass of nitrogen in pasture p residues returned to the soil (kg N)
    EF Ni = emission factor for crop residues returned to the soil in climate zone i (kg N2O-N/ kg N)
    CN2O = factor to convert elemental mass of nitrous oxide to molecular mass (dimensionless)
    (2) Mass of nitrogen in pasture residues returned to the soil, Mp (kg N), is calculated as:
    Mp = (Ap * (Y p * 10^-3) * (1 - FFODp) * NCAGp)
      + (Ap * (Y p * 10^-3) * RBGp * NCBGp)
    Where Ap = area of pasture renewed or removed (ha)
    Y p = average yield of pasture crop (t DM/ha)
    NCAGp = N content of above-ground pasture residue (kg N/kg DM)
    RBGp = below-ground residue to above-ground residue ratio for pasture crop
    NCBGp = N content of below-ground pasture crop residue (kg N/kg DM)
    FFODp = fraction of pasture yield that is removed
  */

  const mp = calculateMassNPastureAppliedToSoil(crop, crop.type, context);

  const efni = selectConstant(
    constants.CROP,
    (value) => massPerMass('N2O', 'N', value),
    'EF_RESIDUES_RETURNED_TO_SOIL',
    crop.rainfallAbove600,
  );
  const cn2o = selectConstant(
    constants.COMMON,
    (value) => realNumber(value),
    'GWP_FACTORSC15',
  );

  const pastureResidueN2O = mp.multiply(efni).multiply(cn2o);

  return pastureResidueN2O;
};
