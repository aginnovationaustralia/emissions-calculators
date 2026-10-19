import { ExecutionContext } from '@/calculators/executionContext';
import { selectConstant } from '@/tools/constants';
import { zeroCH4, zeroN2O } from '@/tools/sentinels';
import { ConstantsForResidueManagement } from './constants';
import {
  CropResidueInputTransformed,
  HasCropOrPastureResidueInputTransformed,
  HasCropResidueInputTransformed,
  isPastureResidueInput,
} from './crop-residue.input';

const calculateCropBurnt = (
  crop: CropResidueInputTransformed,
  constants: ConstantsForResidueManagement,
) => {
  const pc = crop.totalYieldKg;
  const ragc = selectConstant(
    constants.CROP,
    'CROPRESIDUE',
    crop.type,
    'residueCropRatio',
  );
  const sc = selectConstant(
    constants.CROP,
    'CROPRESIDUE',
    crop.type,
    'fractionOfResidueAtBurning',
  );
  const dmc = selectConstant(
    constants.CROP,
    'CROPRESIDUE',
    crop.type,
    'dryMatterContent',
  );
  const zc = selectConstant(
    constants.CROP,
    'CROPRESIDUE',
    crop.type,
    'fractionBurnt',
  );
  const fc = crop.fractionOfAnnualCropBurnt;

  const mburnc = pc
    .multiply(ragc)
    .multiply(sc)
    .multiply(dmc)
    .multiply(zc)
    .multiply(fc, { name: 'Mburnc', references: [`6.4.1.1 (3)`] });

  return mburnc;
};

export const calculateFieldBurningN2O = (
  activity: HasCropResidueInputTransformed,
  context: ExecutionContext<ConstantsForResidueManagement>,
) => {
  const { constants } = context;
  /*
    (2) Nitrous oxide emissions from the burning of crop residue EN2O (t N2O), are calculated
    as:
    EN2O = sum (Mburn,c * NCAGc * EF N2O * CN2O * 10^-3)
      Where NCAGc = nitrogen content in the above-ground residue of crop type c (as
    defined in Section 6.1)
    EF N2O= emission factor for nitrous oxide from burning of crop residues (kg
    N2O/kg N2O burnt)
    CN2O = factor to convert elemental mass of nitrous oxide to molecular mass
    (dimensionless)
    */

  const { crop } = activity;

  const mburnc = calculateCropBurnt(crop, constants);

  const ncagc = selectConstant(
    constants.CROP,
    'CROPRESIDUE',
    crop.type,
    'aboveGroundN',
  );
  const efn2o = selectConstant(constants.CROP, 'BURNING_N2O_EF');
  const cn2o = selectConstant(constants.COMMON, 'ELEMENTAL_TO_MOLECULAR_N2O');

  const fieldBurningN2O = mburnc
    .multiply(ncagc)
    .multiply(efn2o)
    .multiply(cn2o)
    .reference('6.4.1.1 (2)');

  return fieldBurningN2O;
};

export const calculateFieldBurningCH4 = (
  activity: HasCropResidueInputTransformed,
  context: ExecutionContext<ConstantsForResidueManagement>,
) => {
  const { constants } = context;
  /*
    6.4.1.1 Method 1 -- Burning of Crop Residues CH4 and N2O
  (1) Methane emissions from the burning of crop residues ECH4 (t CH4), are calculated as ECH4 = sum (Mburn,c * CCc * EF CH4 * CCH4 * 10^-3)
  c
  Where Mburn,c = mass of residue burnt for crop type c (kg)
  CCc = carbon mass fraction in the residues of crop type c (dimensionless)
  EF CH4= emission factor for methane from burning of crop residues (kg CH4/kg
  residue burnt)
  CCH4 = factor to convert elemental mass of methane to molecular mass
  (dimensionless)

  Mburn,c = Pc * RAGc * Sc * DMc * Zc * Fc
  */

  const { crop } = activity;

  const mburnc = calculateCropBurnt(crop, constants);

  const ccc = selectConstant(
    constants.CROP,
    'CROPRESIDUE',
    crop.type,
    'carbonMassFraction',
  );

  const efch4 = selectConstant(constants.CROP, 'BURNING_METHANE_EF');
  const cch4 = selectConstant(constants.COMMON, 'ELEMENTAL_TO_MOLECULAR_CH4');

  const fieldBurningCH4 = mburnc
    .multiply(ccc)
    .multiply(cch4)
    .multiply(efch4)
    .reference('6.4.1.1 (1)');

  return fieldBurningCH4;
};

export const calculate64FieldBurning = (
  crop: HasCropOrPastureResidueInputTransformed,
  context: ExecutionContext<ConstantsForResidueManagement>,
) => {
  return isPastureResidueInput(crop)
    ? {
        fieldBurningN2O: zeroN2O,
        fieldBurningCH4: zeroCH4,
      }
    : {
        fieldBurningN2O: calculateFieldBurningN2O(crop, context),
        fieldBurningCH4: calculateFieldBurningCH4(crop, context),
      };
};
