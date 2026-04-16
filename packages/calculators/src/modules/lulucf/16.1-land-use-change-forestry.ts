import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { selectConstant } from '@/tools/constants';
import { br, num } from '@/tools/containers';
import { sum } from '@/tools/sum';
import { LULUCFInputTransformed } from './input';

export const calculate_16_1_1_2_ChangesInWoodyCarbonStocks = (
  input: LULUCFInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  /*
    CLUC,j,y = SUM ∆Ci,j,y * Cg,CO2 * -1
    ∆Ci,j,y = (∆Ct,i,j,y + ∆Cd,i,j,y) * ai,j,y
    ∆Ct,i,j,y = Ct,i,j,y- Ct,i,j,y-1
    ∆Cd,i,j,y = Cd,i,j,y- Cd,i,j,y-1
*/
  const { constants } = context;
  const { activities } = input;
  const CgCO2 = selectConstant(constants.COMMON, 'CG_CO2');

  const netChangeInActivities = activities.map((activity) => {
    const {
      carbonMassInTreesCurrentYear,
      carbonMassInTreesPreviousYear,
      carbonMassInDebrisCurrentYear,
      carbonMassInDebrisPreviousYear,
      activityArea,
    } = activity;

    const changeInTrees = carbonMassInTreesCurrentYear.minus(
      carbonMassInTreesPreviousYear,
    );

    const changeInDebris = carbonMassInDebrisCurrentYear.minus(
      carbonMassInDebrisPreviousYear,
    );

    const netChange = br(changeInTrees.plus(changeInDebris)).multiply(
      activityArea,
    );

    return netChange;
  });
  return sum(netChangeInActivities).multiply(CgCO2).multiply(num(-1));
};

export const calculate_16_1_1_4_BiomassBurning = (
  input: LULUCFInputTransformed,
  _context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  /*
  ELUC,g,j,y = SUM (Eg,i,j,y * ag,i,j,y)
  */
  const { activities } = input;

  const ghgFromBurnings = activities.map((activity) => {
    const { ghgMassFromBiomassBurningPerHectare, areaBurnt } = activity;

    return ghgMassFromBiomassBurningPerHectare.multiply(areaBurnt);
  });

  return sum(ghgFromBurnings);
};

export const calculate_16_1_1_5_SoilOrganicStockLosses = (
  input: LULUCFInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  /*
  SLUC,j=1-3,y = SUM ∆Si,j=1-3,y * Cg,CO2
  ∆Si,j=1-3,y = Or * ai,j=1-3,y
  */
  const { activities } = input;
  const CgCO2 = selectConstant(constants.COMMON, 'CG_CO2');

  const soilLosses = activities.map((activity) => {
    const { region, activityArea } = activity;

    const Or = selectConstant(
      constants.LULUCF,
      'ORGANIC_STOCK_LOSS_FACTORS',
      region,
    );

    return Or.multiply(activityArea);
  });

  return sum(soilLosses).multiply(CgCO2).multiply(num(-1));
};
