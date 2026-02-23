import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { isPastureType } from '@/calculators/Grains/constants/enums';
import { ExecutionContext } from '@/calculators/Grains/constants/executionContext';
import { BaseGrainsCropTransformed } from '@/calculators/Grains/types/base-crop.input';
import { selectConstant } from '@/tools/constants';
import { zeroCH4, zeroN2O } from '@/tools/sentinels';
import { massPerMass, realNumber } from '@/tools/units';
import Decimal from 'decimal.js-light';
import { CropResidueInputTransformed } from './crop-residue.input';

const calculateFieldBurningN2O = (
  input: CropResidueInputTransformed & BaseGrainsCropTransformed,
  constants: ConstantsForGrainsCalculator,
) => {
  if (isPastureType(input.type)) {
    return zeroN2O;
  }
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
  const pc = input.averageYield.multiply(input.areaSown, { name: 'Pc' });
  const ragc = selectConstant(
    constants.CROP,
    (value) => massPerMass('CropResidue', 'DryMatter', new Decimal(value)),
    'CROPRESIDUE',
    input.type,
    'residueCropRatio',
  );
  const sc = selectConstant(
    constants.CROP,
    (value) => massPerMass('N', 'CropResidue', new Decimal(value)),
    'CROPRESIDUE',
    input.type,
    'fractionOfResidueAtBurning',
  );
  // TODO: I believe this is a new constant
  const zc = selectConstant(
    constants.CROP,
    (value) => realNumber(new Decimal(value)),
    'CROPRESIDUE',
    input.type,
    'fractionBurnt',
  );
  const fc = selectConstant(
    constants.CROP,
    (value) => realNumber(new Decimal(value)),
    'FRACTION_CROP_RESIDUE_REMOVED',
    input.type,
    input.state,
  );
  const mburnc = input.fractionOfAnnualCropBurnt
    .multiply(pc)
    .multiply(ragc)
    .multiply(sc)
    .multiply(zc)
    .multiply(fc, { name: 'Mburnc' });

  const dmc = selectConstant(
    constants.CROP,
    (value) => massPerMass('DryMatter', 'CropResidue', new Decimal(value)),
    'CROPRESIDUE',
    input.type,
    'dryMatterContent',
  );
  const ncagc = selectConstant(
    constants.CROP,
    (value) => massPerMass('N', 'DryMatter', new Decimal(value)),
    'CROPRESIDUE',
    input.type,
    'aboveGroundN',
  );
  const efn2o = selectConstant(
    constants.CROP,
    (value) => massPerMass('N2O', 'N', new Decimal(value)),
    'BURNING_N2O_EF',
  );
  const cn2o = selectConstant(
    constants.COMMON,
    (value) => realNumber(new Decimal(value)),
    'GWP_FACTORSC15',
  );

  const fieldBurningN2O = mburnc
    .multiply(dmc)
    // @ts-expect-error - question on the units
    .multiply(ncagc)
    .multiply(efn2o)
    .multiply(cn2o);

  return fieldBurningN2O;
};

const calculateFieldBurningCH4 = (
  input: CropResidueInputTransformed & BaseGrainsCropTransformed,
  constants: ConstantsForGrainsCalculator,
) => {
  if (isPastureType(input.type)) {
    return zeroCH4;
  }
  /*
    6.4.1.1 Method 1 -- Burning of Crop Residues CH4 and N2O
  (1) Methane emissions from the burning of crop residues ECH4 (t CH4), are calculated asECH4 = sum (Mburn,c * CCc * EF CH4 * CCH4 * 10^-3)
  c
  Where Mburn,c = mass of residue burnt for crop type c (kg)
  CCc = carbon mass fraction in the residues of crop type c (dimensionless)
  EF CH4= emission factor for methane from burning of crop residues (kg CH4/kg
  residue burnt)
  CCH4 = factor to convert elemental mass of methane to molecular mass
  (dimensionless)
  */
  const pc = input.averageYield.multiply(input.areaSown, { name: 'Pc' });
  const ragc = selectConstant(
    constants.CROP,
    (value) => massPerMass('CropResidue', 'DryMatter', value),
    'CROPRESIDUE',
    input.type,
    'residueCropRatio',
  );
  const mburnc = input.fractionOfAnnualCropBurnt
    .multiply(pc)
    .multiply(ragc, { name: 'Mburnc' });

  const ccc = selectConstant(
    constants.CROP,
    (value) => realNumber(new Decimal(value)),
    'CROPRESIDUE',
    input.type,
    'carbonMassFraction',
  );
  const efch4 = selectConstant(
    constants.CROP,
    (value) => massPerMass('CH4', 'CropResidue', new Decimal(value)),
    'BURNING_METHANE_EF',
  );
  const cch4 = selectConstant(
    constants.COMMON,
    (value) => realNumber(new Decimal(value)),
    'GWP_FACTORSC14',
  );

  const fieldBurningCH4 = mburnc.multiply(ccc).multiply(efch4).multiply(cch4);

  return fieldBurningCH4;
};

export const calculate64FieldBurning = (
  crop: CropResidueInputTransformed & BaseGrainsCropTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;

  return {
    fieldBurningN2O: calculateFieldBurningN2O(crop, constants),
    fieldBurningCH4: calculateFieldBurningCH4(crop, constants),
  };
};
