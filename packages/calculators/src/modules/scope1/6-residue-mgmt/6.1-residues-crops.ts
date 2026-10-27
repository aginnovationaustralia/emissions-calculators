import { ExecutionContext } from '@/calculators/executionContext';
import { HasClimateZoneInputTransformed } from '@/calculators/types/has-climate-zone.input';
import { HasStateInputTransformed } from '@/calculators/types/has-state.input';
import { selectConstant } from '@/tools/constants';
import { captureMethod1Or2Value } from '@/tools/multi';
import { one, zero, zeroN2O } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { ConstantsForResidueManagement, HasCropConstants } from './constants';
import {
  HasCropOrPastureResidueInputTransformed,
  HasCropResidueInputTransformed,
  isBurnableCropResidueInput,
  isPastureResidueInput,
  residueIsByMass,
} from './crop-residue.input';

export const calculateMassNCropAppliedToSoil = (
  activity: HasCropResidueInputTransformed & HasStateInputTransformed,
  constants: HasCropConstants,
) => {
  const { crop } = activity;
  const { residues } = crop;
  const ncbgc = selectConstant(
    constants.CROP,
    'CROPRESIDUE',
    crop.type,
    'belowGroundN',
  );
  const ncagc = selectConstant(
    constants.CROP,
    'CROPRESIDUE',
    crop.type,
    'aboveGroundN',
  );
  const dmc = selectConstant(
    constants.CROP,
    'CROPRESIDUE',
    crop.type,
    'dryMatterContent',
  );
  const ragc = selectConstant(
    constants.CROP,
    'CROPRESIDUE',
    crop.type,
    'residueCropRatio',
  );

  // Crops that can't be burnt have no burnt fraction (see BurnableCropTypes)
  const fc = isBurnableCropResidueInput(crop)
    ? crop.fractionOfAnnualCropBurnt
    : zero;
  const ffodc = captureMethod1Or2Value(
    selectConstant(
      constants.CROP,
      'FRACTION_CROP_RESIDUE_REMOVED',
      crop.type,
      activity.state,
    ),
    residues.calculationMethod === '2'
      ? residueIsByMass(residues)
        ? residues.massCropResidueRemoved.divide(
            crop.totalYieldKg.multiply(ragc).reference('6.1.1.2 (1)'),
          )
        : residues.fractionCropResidueRemoved
      : undefined,
  ).named('FFODc');

  const pc = crop.totalYieldKg;
  const rbgc = selectConstant(
    constants.CROP,
    'CROPRESIDUE',
    crop.type,
    'belowAboveResidueRatio',
  );

  /**
   *  Mc = (Pc * RAGc * (1 - F c- FFODc) * DMc * NCAGc) +
   * (P c * RAGc * RBGc * DMc * NCBGc) (kg N)
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

  const mc = sum([aboveGroundNitrogen, belowGroundNitrogen], {
    name: 'Mc',
    references: ['6.1.1.1 (2)'],
  });

  return mc;
};

export const calculate61CropResidueN2O = (
  activity: HasCropOrPastureResidueInputTransformed &
    HasClimateZoneInputTransformed &
    HasStateInputTransformed,
  context: ExecutionContext<ConstantsForResidueManagement>,
) => {
  const { constants } = context;

  if (isPastureResidueInput(activity)) {
    return zeroN2O;
  }
  /* cropResidueN2O
      6.1.1.1
      E = sum (Mc * EF Ni) * CN2O * 10^-3 (t N2O)
      Mc = mass of nitrogen in crop c residues returned to the soil (kg N)
      EF Ni = emission factor for crop residues returned to the soil in climate zone i (kg N2O-N/ kg N)
      CN2O = factor to convert elemental mass of nitrous oxide to molecular mass (dimensionless)
      
      Mc = (Pc * RAGc * (1 - Fc - FFODc) * DMc * NCAGc) + (P c * RAGc * RBGc * DMc * NCBGc) (kg N)
      P c = annual production of crop c (kg)
      RAGc = residue to crop ratio for crop c (dimensionless)
      RBGc = below ground-residue to above ground residue ratio for crop c (dimensionless)
      F c = fraction of crop residue that is burnt for crop c (dimensionless)
      FFODc = fraction of the crop residue that is removed for crop c (dimensionless)
      DMc = dry matter content of crop c (kg dry weight/kg crop residue)
      NCAGc = nitrogen content of above-ground crop residue of crop c (kg N/kg DM)
      NCBGc = nitrogen content of below-ground crop residue of crop c (kg N/kg DM)
  */

  const mc = calculateMassNCropAppliedToSoil(activity, constants);

  const efni = selectConstant(
    constants.CROP,
    'EF_RESIDUES_RETURNED_TO_SOIL',
    activity.climateZone,
  );
  const cn2o = selectConstant(constants.COMMON, 'ELEMENTAL_TO_MOLECULAR_N2O');

  const cropResidueN2O = mc
    .multiply(efni)
    .multiply(cn2o)
    .reference('6.1.1.1 (1)');

  return cropResidueN2O;
};
