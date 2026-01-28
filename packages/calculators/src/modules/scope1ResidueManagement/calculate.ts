import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { selectConstant } from '@/tools/constants';
import { minus } from '@/tools/minus';
import { RootContainer } from '@/tools/origins';
import { one } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { mass, massPerMass, realNumber } from '@/tools/units';
import { GrainsCropTransformed } from '@/types/Grains/crop.input';
import Decimal from 'decimal.js-light';

export const calculateScope1ResidueManagement = (
  crop: GrainsCropTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;

  const zeroCH4 = new RootContainer(mass('CH4', new Decimal(0)), {
    name: 'zero',
    valueType: 'constant',
  });
  const zeroN2O = new RootContainer(mass('N2O', new Decimal(0)), {
    name: 'zero',
    valueType: 'constant',
  });
  const fieldBurningN2O = zeroN2O;
  const fieldBurningCH4 = zeroCH4;

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

  return {
    cropResidueN2O,
    fieldBurningN2O,
    fieldBurningCH4,
  };
};
