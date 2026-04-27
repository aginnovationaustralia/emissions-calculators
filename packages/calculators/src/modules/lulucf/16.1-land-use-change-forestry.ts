import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { selectConstant } from '@/tools/constants';
import { br, num } from '@/tools/containers';
import { zeroCO2e } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { LULUCFInputTransformed } from './input';
import {
  isForestryActivity,
  isLandClearingActivity,
} from './land-use-change-activity-input';

export const calculate_16_1_1_2_ChangesInWoodyCarbonStocks = (
  input: LULUCFInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  /*
    CLUC,j,y = SUM ∆Ci,j,y * Cg,CO2 * -1
    ∆Ci,j,y = (∆Ct,i,j,y + ∆Cd,i,j,y) * ai,j,y
    ∆Ct,i,j,y = Ct,i,j,y - Ct,i,j,y-1
    ∆Cd,i,j,y = Cd,i,j,y - Cd,i,j,y-1
*/
  const { constants } = context;
  const { activities } = input;

  if (!activities) {
    return zeroCO2e.named('CLUC,j,y');
  }

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
  return sum(netChangeInActivities)
    .multiply(CgCO2)
    .multiply(num(-1))
    .named('CLUC,j,y');
};

export const calculate_16_1_1_4_BiomassBurningCH4 = (
  input: LULUCFInputTransformed,
  _context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  /*
  ELUC,g,j,y = SUM (Eg,i,j,y * ag,i,j,y)
  */
  const { activities } = input;

  if (!activities) {
    return zeroCO2e.named('ELUC,g=ch4,j,y');
  }

  const ch4FromBurnings = activities
    .filter(isLandClearingActivity)
    .map((activity) => {
      const { massCH4FromBiomassBurningPerHectare, areaBurnt } = activity;

      return massCH4FromBiomassBurningPerHectare.multiply(areaBurnt);
    });

  return sum(ch4FromBurnings).named('ELUC,g=ch4,j,y');
};

export const calculate_16_1_1_4_BiomassBurningN2O = (
  input: LULUCFInputTransformed,
  _context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  /*
  ELUC,g,j,y = SUM (Eg,i,j,y * ag,i,j,y)
  */
  const { activities } = input;

  if (!activities) {
    return zeroCO2e.named('ELUC,g=n2o,j,y');
  }

  const n2oFromBurnings = activities
    .filter(isLandClearingActivity)
    .map((activity) => {
      const { massN2OFromBiomassBurningPerHectare, areaBurnt } = activity;

      return massN2OFromBiomassBurningPerHectare.multiply(areaBurnt);
    });

  return sum(n2oFromBurnings).named('ELUC,g=n2o,j,y');
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

  if (!activities) {
    return zeroCO2e.named('SLUC,j=1-3,y');
  }

  const CgCO2 = selectConstant(constants.COMMON, 'CG_CO2');

  const soilLosses = activities
    .filter(isLandClearingActivity)
    .map((activity) => {
      const { region, activityArea } = activity;

      const Or = selectConstant(
        constants.LULUCF,
        'ORGANIC_STOCK_LOSS_FACTORS',
        region,
      );

      return Or.multiply(activityArea);
    });

  return sum(soilLosses)
    .multiply(CgCO2)
    .multiply(num(-1))
    .named('SLUC,j=1-3,y');
};

export const calculate_16_1_1_7_HarvestedWoodProducts = (
  input: LULUCFInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  /*
  CHWP,j=6-7,y = SUM (Cp,i,j=6-7,y * ai,j=6-7,y) * Cg,CO2 * -1
  */
  const { constants } = context;
  const { activities } = input;

  if (!activities) {
    return zeroCO2e.named('CHWP,j=6-7,y');
  }

  const CgCO2 = selectConstant(constants.COMMON, 'CG_CO2');
  const harvestedWoodEmissions = activities
    .filter(isForestryActivity)
    .map((activity) => {
      const { carbonMassOfWoodProductsHarvestedPerHectare, activityArea } =
        activity;

      return carbonMassOfWoodProductsHarvestedPerHectare.multiply(activityArea);
    });

  return sum(harvestedWoodEmissions)
    .multiply(CgCO2)
    .multiply(num(-1))
    .named('CHWP,j=6-7,y');
};
