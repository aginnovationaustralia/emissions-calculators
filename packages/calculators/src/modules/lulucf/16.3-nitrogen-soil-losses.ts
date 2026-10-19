import { ExecutionContext } from '@/calculators/executionContext';
import { selectConstant } from '@/tools/constants';
import { br, Container } from '@/tools/containers';
import { zeroN2O } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { Mass, massPerMass } from '@/tools/units';
import { ConstantsForLULUCF } from './constants';
import { LULUCFInputTransformed, LULUCFParentInputTransformed } from './input';
import {
  isLandClearingActivity,
  isLandClearingForestToCropland,
  isLandClearingToGrasslandOrSettlements,
  LandClearingForestToCroplandInputTransformed,
  LandClearingForestToGrasslandInputTransformed,
  LandClearingForestToSettlementsInputTransformed,
} from './land-use-change-activity-input';

export const calculateMineralisedNitrogenFromClearingToCrops = (
  activity: LandClearingForestToCroplandInputTransformed,
  context: ExecutionContext<ConstantsForLULUCF>,
) => {
  const { constants } = context;

  const { region, activityAreaHectares } = activity;

  const R = selectConstant(constants.LULUCF, 'CARBON_TO_NITROGEN_RATIO');

  const Or = selectConstant(
    constants.LULUCF,
    'ORGANIC_STOCK_LOSS_FACTORS',
    region,
  );

  const organicCarbonChange =
    Or.multiply(activityAreaHectares).named('∆Si,j=1,y');

  return organicCarbonChange
    .divide(R)
    .named('Ni,j=1,y')
    .reference('16.3.1.1 (2)');
};

const calculateN2OFromClearingToCrops = (
  input: LULUCFInputTransformed,
  context: ExecutionContext<ConstantsForLULUCF>,
) => {
  const { constants } = context;

  const activities = input.activities?.filter(isLandClearingForestToCropland);

  if (!activities || activities.length === 0) {
    return zeroN2O;
  }

  const activityRecords = activities.map((activity) => {
    const { cropProductionSystem } = activity;

    const EFcrop = selectConstant(
      constants.CROP,
      'EF_N2O_ATMOSPHERIC_DEPOSITION_PRODUCTION_SYSTEM',
      cropProductionSystem,
    )
      .switchUnit((val) => massPerMass('N2O', 'N', val.store))
      .named('EFcrop');

    const mineralisedNitrogen = calculateMineralisedNitrogenFromClearingToCrops(
      activity,
      context,
    );

    return mineralisedNitrogen.multiply(EFcrop);
  });

  return sum(activityRecords);
};

export const calculateMineralisedNitrogenFromClearingToOpen = (
  activity:
    | LandClearingForestToGrasslandInputTransformed
    | LandClearingForestToSettlementsInputTransformed,
  context: ExecutionContext<ConstantsForLULUCF>,
) => {
  const { constants } = context;
  const { region, activityAreaHectares } = activity;
  const R = selectConstant(constants.LULUCF, 'CARBON_TO_NITROGEN_RATIO');

  const Or = selectConstant(
    constants.LULUCF,
    'ORGANIC_STOCK_LOSS_FACTORS',
    region,
  );

  const organicCarbonChange =
    Or.multiply(activityAreaHectares).named('∆Si,j=2-3,y');

  return organicCarbonChange.divide(R).named('Ni,j=2-3,y');
};

const calculateN2OFromClearingToOpen = (
  input: LULUCFInputTransformed,
  context: ExecutionContext<ConstantsForLULUCF>,
) => {
  const { constants } = context;

  const activities = input.activities?.filter(
    isLandClearingToGrasslandOrSettlements,
  );

  if (!activities || activities.length === 0) {
    return zeroN2O;
  }

  const activityRecords = activities.map((activity) => {
    const { pastureProductionSystem } = activity;
    const EFpasture = selectConstant(
      constants.CROP,
      'EF_N2O_ATMOSPHERIC_DEPOSITION_PRODUCTION_SYSTEM',
      pastureProductionSystem,
    ).switchUnit((val) => massPerMass('N2O', 'N', val.store));
    const mineralisedNitrogen = calculateMineralisedNitrogenFromClearingToOpen(
      activity,
      context,
    );

    return mineralisedNitrogen.multiply(EFpasture);
  });

  return sum(activityRecords);
};

export const calculate_16_3_1_1_NitrogenMineralisationSoilLosses = (
  input: LULUCFParentInputTransformed,
  context: ExecutionContext<ConstantsForLULUCF>,
): Container<Mass<'N2O'>> => {
  const { landUse } = input;

  if (!landUse) {
    return zeroN2O.named('ELUC,i,j=1-3,y');
  }

  /*
    ELUC,i,j=1-3,y = (Ni,j=1,y * EF crop + Ni,j=2-3,y * EF pasture) * Cg,N2O
    Ni,j=1-3,y = SUM (∆Si,j=1-3,y)/R
  */

  const { constants } = context;

  const activities = landUse.activities?.filter(isLandClearingActivity);

  if (!activities || activities.length === 0) {
    return zeroN2O.named('ELUC,i,j=1-3,y');
  }

  const CgN2O = selectConstant(constants.COMMON, 'ELEMENTAL_TO_MOLECULAR_N2O');

  const n2oFromClearingToCrops = calculateN2OFromClearingToCrops(
    landUse,
    context,
  );
  const n2oFromClearingToPastureOrSettlements = calculateN2OFromClearingToOpen(
    landUse,
    context,
  );

  return br(n2oFromClearingToCrops.plus(n2oFromClearingToPastureOrSettlements))
    .multiply(CgN2O)
    .named('ELUC,i,j=1-3,y')
    .reference('16.3.1.1 (1)');
};
