import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { selectConstant } from '@/tools/constants';
import { minus } from '@/tools/minus';
import { RootContainer } from '@/tools/origins';
import { one } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { mass, massPerMass, realNumber } from '@/tools/units';
import Decimal from 'decimal.js-light';
import { CropResidueInputTransformed } from './crop-residue.input';

const calculateCropResidueN2O = (
  crop: CropResidueInputTransformed,
  constants: ConstantsForGrainsCalculator,
) => {
  /* cropResidueN2O
    6.1.1.1
    441 | 𝐸 = ∑ (𝑀𝑐 × 𝐸𝐹 𝑁𝑖 × 𝐶𝑁2𝑂 × 10−3) (t N2O)
    𝑀𝑐 = mass of nitrogen in crop c residues returned to the soil (kg N)
    𝐸𝐹 𝑁𝑖 = emission factor for crop residues returned to the soil in climate zone i (kg N2O-N/ kg N)
    𝐶𝑁2𝑂 = factor to convert elemental mass of nitrous oxide to molecular mass (dimensionless)
    448 | 𝑀𝑐 = (𝑃 𝑐 × 𝑅𝐴𝐺𝑐 × (1 − 𝐹 𝑐− 𝐹𝐹𝑂𝐷𝑐) × 𝐷𝑀𝑐 × 𝑁𝐶𝐴𝐺𝑐) + (𝑃 𝑐 × 𝑅𝐴𝐺𝑐 × 𝑅𝐵𝐺𝑐 × 𝐷𝑀𝑐 × 𝑁𝐶𝐵𝐺𝑐) (kg N)
    𝑃 𝑐 = annual production of crop c (kg)
    𝑅𝐴𝐺𝑐 = residue to crop ratio for crop c (dimensionless)
    𝑅𝐵𝐺𝑐 = below ground-residue to above ground residue ratio for crop c
    (dimensionless)
    𝐹 𝑐 = fraction of crop residue that is burnt for crop c (dimensionless)
    𝐹𝐹𝑂𝐷𝑐 = fraction of the crop residue that is removed for crop c
    (dimensionless)
    𝐷𝑀𝑐 = dry matter content of crop c (kg dry weight/kg crop residue)
    𝑁𝐶𝐴𝐺𝑐 = nitrogen content of above-ground crop residue of crop c (kg N/kg DM)
    𝑁𝐶𝐵𝐺𝑐 = nitrogen content of below-ground crop residue of crop c (kg N/kg
    DM)
    */
  const ncbgc = selectConstant(
    constants.CROP,
    (value) => massPerMass('N', 'DryMatter', new Decimal(value)),
    'CROPRESIDUE',
    crop.type,
    'belowGroundN',
  );
  const ncagc = selectConstant(
    constants.CROP,
    (value) => massPerMass('N', 'DryMatter', new Decimal(value)),
    'CROPRESIDUE',
    crop.type,
    'aboveGroundN',
  );
  const dmc = selectConstant(
    constants.CROP,
    (value) => massPerMass('DryMatter', 'CropResidue', new Decimal(value)),
    'CROPRESIDUE',
    crop.type,
    'dryMatterContent',
  );
  const fc = selectConstant(
    constants.CROP,
    (value) => realNumber(new Decimal(value)),
    'CROPRESIDUE',
    crop.type,
    'fractionBurnt',
  );
  const ffodc = selectConstant(
    constants.CROP,
    (value) => realNumber(new Decimal(value)),
    'CROPRESIDUE',
    crop.type,
    'fractionRemoved',
  );

  const pc = crop.averageGrainYield.multiply(crop.areaSown, { name: 'Pc' });
  const ragc = selectConstant(
    constants.CROP,
    (value) => massPerMass('CropResidue', 'Yield', new Decimal(value)),
    'CROPRESIDUE',
    crop.type,
    'residueCropRatio',
  );
  const rbgc = selectConstant(
    constants.CROP,
    (value) => realNumber(new Decimal(value)),
    'CROPRESIDUE',
    crop.type,
    'belowAboveResidueRatio',
  );

  /*  448 | 𝑀𝑐 =
                  (𝑃 𝑐 × 𝑅𝐴𝐺𝑐 × (1 − 𝐹 𝑐− 𝐹𝐹𝑂𝐷𝑐) × 𝐷𝑀𝑐 × 𝑁𝐶𝐴𝐺𝑐)
                    + 
                  (𝑃 𝑐 × 𝑅𝐴𝐺𝑐 × 𝑅𝐵𝐺𝑐 × 𝐷𝑀𝑐 × 𝑁𝐶𝐵𝐺𝑐) (kg N)
    */
  const aboveGroundNitrogen = pc
    .multiply(ragc)
    .multiply(sum([one, minus(fc), minus(ffodc)]))
    .multiply(dmc)
    .multiply(ncagc);

  const belowGroundNitrogen = pc
    .multiply(ragc)
    .multiply(rbgc)
    .multiply(dmc)
    .multiply(ncbgc);

  const mc = sum([aboveGroundNitrogen, belowGroundNitrogen], { name: 'Mc' });

  const efni = selectConstant(
    constants.CROP,
    (value) => massPerMass('N2O', 'N', new Decimal(value)),
    'EF_RESIDUES_RETURNED_TO_SOIL',
    crop.rainfallAbove600,
  );
  const cn2o = selectConstant(
    constants.COMMON,
    (value) => realNumber(new Decimal(value)),
    'GWP_FACTORSC15',
  );

  // 441 | 𝐸 = ∑ (𝑀𝑐 × 𝐸𝐹 𝑁𝑖 × 𝐶𝑁2𝑂 × 10−3) (t N2O)
  const cropResidueN2O = mc.multiply(efni).multiply(cn2o);

  return cropResidueN2O;
};

const calculateFieldBurningN2O = (
  input: CropResidueInputTransformed,
  constants: ConstantsForGrainsCalculator,
) => {
  /*
  (2) Nitrous oxide emissions from the burning of crop residue 𝐸𝑁2𝑂 (t N2O), are calculated
  as:
  𝐸𝑁2𝑂 = ∑ (𝑀𝑏𝑢𝑟𝑛,𝑐 × 𝑁𝐶𝐴𝐺𝑐 × 𝐸𝐹 𝑁2𝑂 × 𝐶𝑁2𝑂 × 10−3)
    Where 𝑁𝐶𝐴𝐺𝑐 = nitrogen content in the above-ground residue of crop type c (as
  defined in Section 6.1)
  𝐸𝐹 𝑁2𝑂= emission factor for nitrous oxide from burning of crop residues (kg
  N2O/kg N2O burnt)
  𝐶𝑁2𝑂 = factor to convert elemental mass of nitrous oxide to molecular mass
  (dimensionless)
  */
  const mburnc = input.fractionOfAnnualCropBurnt
    .multiply(input.averageGrainYield)
    .multiply(input.areaSown, { name: 'Mburnc' });

  const ncagc = selectConstant(
    constants.CROP,
    (value) => massPerMass('N', 'DryMatter', new Decimal(value)),
    'CROPRESIDUE',
    input.type,
    'aboveGroundN',
  );
  const efn2o = selectConstant(
    constants.CROP,
    (value) => realNumber(value),
    'BURNING_N2O_EF',
  );
  const cn2o = selectConstant(
    constants.COMMON,
    (value) => realNumber(new Decimal(value)),
    'GWP_FACTORSC15',
  );

  const fieldBurningN2O = mburnc.multiply(ncagc).multiply(efn2o).multiply(cn2o);

  return fieldBurningN2O;
};

export const calculateScope1ResidueManagement = (
  crop: CropResidueInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;

  const zeroCH4 = new RootContainer(mass('CH4', new Decimal(0)), {
    name: 'zero',
    valueType: 'constant',
  });
  const fieldBurningCH4 = zeroCH4;

  return {
    cropResidueN2O: calculateCropResidueN2O(crop, constants),
    fieldBurningN2O: calculateFieldBurningN2O(crop, constants),
    fieldBurningCH4,
  };
};
