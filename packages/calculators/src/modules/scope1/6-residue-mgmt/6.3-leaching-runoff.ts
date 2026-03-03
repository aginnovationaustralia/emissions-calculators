import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { isPastureType } from '@/calculators/Grains/constants/enums';
import { ExecutionContext } from '@/calculators/Grains/constants/executionContext';
import { BaseGrainsCropTransformed } from '@/calculators/Grains/types/base-crop.input';
import { selectConstant } from '@/tools/constants';
import { one, zero } from '@/tools/sentinels';
import { calculateMassNCropAppliedToSoil } from './6.1-residues-crops';
import { calculateMassNPastureAppliedToSoil } from './6.2-residues-pasture';
import { CropResidueInputTransformed } from './crop-residue.input';

export const calculate63ResidueLeachingAndRunoffN2O = (
  crop: CropResidueInputTransformed & BaseGrainsCropTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  /*
    6.3.1.1 Method 1 -- Residue Leaching and Runoff N2O
    (1) Nitrous oxide leaching and runoff emissions from crop and pasture residues returned
    to the soil, across all crop residues c and pasture residues p, EN2O (t N2O), is
    calculated as:
    EN2O = SUMc SUMp (Mleach,cp * EF leach * CN2O * 10^-3)
    Where Mleach,cp = mass of nitrogen lost through leaching and runoff from the crop residue c or pasture residue p (kg N)
    EF leach= emission factor for leaching and runoff (kg N2O-N / kg N)
    CN2O = factor to convert elemental mass of nitrous oxide to molecular mass (dimensionless)
    (2) Mass of nitrogen lost through leaching and runoff, Mleach,cp (kg N), is calculated as:
    Mleach,cp = Mcp * FracWET j * FracLEACH
    Where Mcp = mass of nitrogen in crop residues c or pasture residues p applied to soils (kg N) (refer to Sections 6.1 and 6.2 for the calculation of this value for crops and pastures respectively)
    FracWET j = fraction of N that is available for leaching and runoff from production system j (dimensionless)
    FracLEACH = fraction of N that is lost through leaching and runoff (dimensionless)
  */
  const mcp = isPastureType(crop.type)
    ? calculateMassNPastureAppliedToSoil(crop, crop.type, context)
    : calculateMassNCropAppliedToSoil(crop, crop.type, context);

  const fracWetj = crop.isInLeachingZone ? one : zero;

  const fracLeach = selectConstant(
    constants.CROP,
    'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF',
  );

  const mleachCp = mcp.multiply(fracWetj).multiply(fracLeach);

  const efLeach = selectConstant(constants.CROP, 'EF_N2O_LEACHING_AND_RUNOFF');

  const cn2o = selectConstant(constants.COMMON, 'GWP_FACTORSC15');

  return mleachCp.multiply(efLeach).multiply(cn2o, {
    name: 'En2o',
    references: [`6.3.1.1 (554)`],
  });
};
