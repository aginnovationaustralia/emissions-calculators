import { ExecutionContext } from '@/calculators/executionContext';
import { HasConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { captureMethod1Or2Value } from '@/tools/multi';
import { zeroCO2e } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { voidUnit } from '@/tools/units';
import {
  PurchasedMineralSupplementInputTransformed,
  purchasedMineralSupplementIsMethod2,
  PurchasedMineralSupplementsInputTransformed,
} from './purchased-mineral-supplements.input';

const getEmissionsFactor = (
  mineral: PurchasedMineralSupplementInputTransformed,
  constants: HasConstants<'LIVESTOCK'>,
) => {
  if (purchasedMineralSupplementIsMethod2(mineral)) {
    return captureMethod1Or2Value(voidUnit(), mineral.customEmissionsFactor);
  }
  return captureMethod1Or2Value(
    selectConstant(
      constants.LIVESTOCK,
      'PURCHASED_MINERAL_SUPPLEMENT_FACTORS',
      mineral.type,
    ),
    undefined,
  );
};

export const calculatePurchasedMineralSupplements = (
  activity: PurchasedMineralSupplementsInputTransformed,
  context: ExecutionContext<HasConstants<'COMMON' | 'LIVESTOCK'>>,
) => {
  /**
   * E = SUM Qm * EFm
   */
  const { constants } = context;
  const mineralEmissions = activity.purchasedMineralSupplements.map(
    (mineral) => {
      const emissionsFactor = getEmissionsFactor(mineral, constants).named(
        'EFm',
      );

      return mineral.amount
        .multiply(emissionsFactor)
        .named('E')
        .reference('15.3.1.1 (1)');
    },
  );

  return sum(mineralEmissions, zeroCO2e);
};
