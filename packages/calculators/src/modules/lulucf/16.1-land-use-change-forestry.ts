import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { selectConstant } from '@/tools/constants';
import { br, num, root } from '@/tools/containers';
import { zeroCH4, zeroN2O } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { mass } from '@/tools/units';
import { LULUCFParentInputTransformed } from './input';
import {
  isForestryActivity,
  isLandClearingActivity,
} from './land-use-change-activity-input';

export const calculate_16_1_1_2_ChangesInWoodyCarbonStocks = (
  input: LULUCFParentInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  /*
    CLUC,j,y = SUM ∆Ci,j,y * Cg,CO2 * -1
    ∆Ci,j,y = (∆Ct,i,j,y + ∆Cd,i,j,y) * ai,j,y
    ∆Ct,i,j,y = Ct,i,j,y - Ct,i,j,y-1
    ∆Cd,i,j,y = Cd,i,j,y - Cd,i,j,y-1
*/
  const { constants } = context;
  const activities = input.landUse?.activities;

  if (!activities) {
    return root(mass('CO2', 0)).named('CLUC,j,y');
  }

  const CgCO2 = selectConstant(constants.COMMON, 'CG_CO2');

  const netChangeInActivities = activities.map((activity) => {
    const {
      carbonMassInTreesCurrentYear,
      carbonMassInTreesPreviousYear,
      carbonMassInDebrisCurrentYear,
      carbonMassInDebrisPreviousYear,
      activityAreaHectares,
    } = activity;

    const changeInTrees = carbonMassInTreesCurrentYear.minus(
      carbonMassInTreesPreviousYear,
    );

    const changeInDebris = carbonMassInDebrisCurrentYear.minus(
      carbonMassInDebrisPreviousYear,
    );

    const netChange = br(changeInTrees.plus(changeInDebris)).multiply(
      activityAreaHectares,
    );

    return netChange;
  });
  return sum(netChangeInActivities)
    .multiply(CgCO2)
    .multiply(num(-1))
    .named('CLUC,j,y');
};

export const calculate_16_1_1_4_BiomassBurningCH4 = (
  input: LULUCFParentInputTransformed,
  _context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  /*
  ELUC,g,j,y = SUM (Eg,i,j,y * ag,i,j,y)
  */
  const activities = input.landUse?.activities;

  if (!activities) {
    return zeroCH4.named('ELUC,g=ch4,j,y');
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
  input: LULUCFParentInputTransformed,
  _context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  /*
  ELUC,g,j,y = SUM (Eg,i,j,y * ag,i,j,y)
  */
  const activities = input.landUse?.activities;

  if (!activities) {
    return zeroN2O.named('ELUC,g=n2o,j,y');
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
  input: LULUCFParentInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  /*
  SLUC,j=1-3,y = SUM ∆Si,j=1-3,y * Cg,CO2
  ∆Si,j=1-3,y = Or * ai,j=1-3,y
  */
  const activities = input.landUse?.activities;

  if (!activities) {
    return root(mass('CO2', 0)).named('SLUC,j=1-3,y');
  }

  const CgCO2 = selectConstant(constants.COMMON, 'CG_CO2');

  const soilLosses = activities
    .filter(isLandClearingActivity)
    .map((activity) => {
      const { region, activityAreaHectares } = activity;

      const Or = selectConstant(
        constants.LULUCF,
        'ORGANIC_STOCK_LOSS_FACTORS',
        region,
      );

      return Or.multiply(activityAreaHectares);
    });

  return sum(soilLosses)
    .multiply(CgCO2)
    .multiply(num(-1))
    .named('SLUC,j=1-3,y');
};

export const calculate_16_1_1_7_HarvestedWoodProducts = (
  input: LULUCFParentInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  /*
  CHWP,j=6-7,y = SUM (Cp,i,j=6-7,y * ai,j=6-7,y) * Cg,CO2 * -1
  */
  const { constants } = context;
  const activities = input.landUse?.activities;

  if (!activities) {
    return root(mass('CO2', 0)).named('CHWP,j=6-7,y');
  }

  const CgCO2 = selectConstant(constants.COMMON, 'CG_CO2');
  const harvestedWoodEmissions = activities
    .filter(isForestryActivity)
    .map((activity) => {
      const {
        carbonMassOfWoodProductsHarvestedPerHectare,
        activityAreaHectares,
      } = activity;

      return carbonMassOfWoodProductsHarvestedPerHectare.multiply(
        activityAreaHectares,
      );
    });

  return sum(harvestedWoodEmissions)
    .multiply(CgCO2)
    .multiply(num(-1))
    .named('CHWP,j=6-7,y');
};
