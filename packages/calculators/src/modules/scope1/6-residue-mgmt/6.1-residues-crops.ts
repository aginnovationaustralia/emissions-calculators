import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { CropType, isPastureType } from '@/calculators/Grains/constants/enums';
import { ExecutionContext } from '@/calculators/Grains/constants/executionContext';
import { BaseGrainsCropTransformed } from '@/calculators/Grains/types/base-crop.input';
import { selectConstant } from '@/tools/constants';
import { one, zeroN2O } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { CropResidueInputTransformed } from './crop-residue.input';

export const calculateMassNCropAppliedToSoil = (
  crop: CropResidueInputTransformed & BaseGrainsCropTransformed,
  cropType: CropType,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;

  const ncbgc = selectConstant(
    constants.CROP,
    'CROPRESIDUE',
    cropType,
    'belowGroundN',
  );
  const ncagc = selectConstant(
    constants.CROP,
    'CROPRESIDUE',
    cropType,
    'aboveGroundN',
  );
  const dmc = selectConstant(
    constants.CROP,
    'CROPRESIDUE',
    cropType,
    'dryMatterContent',
  );
  const fc = crop.fractionOfAnnualCropBurnt;
  const ffodc =
    crop.cropResidues.calculationMethod === '1'
      ? selectConstant(
          constants.CROP,
          'FRACTION_CROP_RESIDUE_REMOVED',
          cropType,
          crop.state,
        )
      : crop.cropResidues.fractionCropResidueRemoved;

  const pc = crop.averageYield.multiply(crop.areaSown, { name: 'Pc' });
  const ragc = selectConstant(
    constants.CROP,
    'CROPRESIDUE',
    cropType,
    'residueCropRatio',
  );
  const rbgc = selectConstant(
    constants.CROP,
    'CROPRESIDUE',
    cropType,
    'belowAboveResidueRatio',
  );

  /*  448 | Mc =
                    (P c * RAGc * (1 - F c- FFODc) * DMc * NCAGc)
                      + 
                    (P c * RAGc * RBGc * DMc * NCBGc) (kg N)
      */
  const aboveGroundNitrogen = pc
    .multiply(ragc)
    .multiply(one.minus(fc).minus(ffodc))
    .multiply(dmc)
    .multiply(ncagc);

  const belowGroundNitrogen = pc
    .multiply(ragc)
    .multiply(rbgc)
    .multiply(dmc)
    .multiply(ncbgc);

  const mc = sum([aboveGroundNitrogen, belowGroundNitrogen], { name: 'Mc' });

  return mc;
};

export const calculate61CropResidueN2O = (
  crop: CropResidueInputTransformed & BaseGrainsCropTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;

  // REVISIT: This pattern means we generate 2 separate output keys for crops and pastures. One
  // will always be zero, the other will have a result. We could decide to combine 6.1 and 6.2
  // into a single output key
  if (isPastureType(crop.type)) {
    return zeroN2O;
  }
  /* cropResidueN2O
      6.1.1.1
      441 | E = sum (Mc * EF Ni * CN2O * 10^-3) (t N2O)
      Mc = mass of nitrogen in crop c residues returned to the soil (kg N)
      EF Ni = emission factor for crop residues returned to the soil in climate zone i (kg N2O-N/ kg N)
      CN2O = factor to convert elemental mass of nitrous oxide to molecular mass (dimensionless)
      448 | Mc = (P c * RAGc * (1 - F c- FFODc) * DMc * NCAGc) + (P c * RAGc * RBGc * DMc * NCBGc) (kg N)
      P c = annual production of crop c (kg)
      RAGc = residue to crop ratio for crop c (dimensionless)
      RBGc = below ground-residue to above ground residue ratio for crop c (dimensionless)
      F c = fraction of crop residue that is burnt for crop c (dimensionless)
      FFODc = fraction of the crop residue that is removed for crop c (dimensionless)
      DMc = dry matter content of crop c (kg dry weight/kg crop residue)
      NCAGc = nitrogen content of above-ground crop residue of crop c (kg N/kg DM)
      NCBGc = nitrogen content of below-ground crop residue of crop c (kg N/kg DM)
  */

  const mc = calculateMassNCropAppliedToSoil(crop, crop.type, context);

  const efni = selectConstant(
    constants.CROP,
    'EF_RESIDUES_RETURNED_TO_SOIL',
    crop.rainfallAbove600,
  );
  const cn2o = selectConstant(constants.COMMON, 'GWP_FACTORSC15');

  // 441 | E = sum (Mc * EF Ni * CN2O * 10^-3) (t N2O)
  const cropResidueN2O = mc.multiply(efni).multiply(cn2o);

  return cropResidueN2O;
};
