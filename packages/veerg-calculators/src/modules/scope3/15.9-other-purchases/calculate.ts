import { ExecutionContext } from '@/calculators/executionContext';
import { HasCommonConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { zeroCO2e } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import {
  isOtherPurchasedCleaningChemical,
  isOtherPurchasedMiscellaneous,
  isOtherPurchasedPharmacyChemical,
  isOtherPurchasedSeed,
  OtherPurchasedGoodOrServiceInputTransformed,
  OtherPurchasedGoodsAndServicesInputTransformed,
} from './input';

const calculateItemEmissions = (
  item: OtherPurchasedGoodOrServiceInputTransformed,
  constants: HasCommonConstants,
) => {
  if (isOtherPurchasedSeed(item)) {
    return selectConstant(
      constants.COMMON,
      'OTHER_PURCHASED_FACTORS',
      'SEED',
      item.seedType,
    ).multiply(item.quantityKilograms);
  }
  if (isOtherPurchasedMiscellaneous(item)) {
    return selectConstant(
      constants.COMMON,
      'OTHER_PURCHASED_FACTORS',
      'MISCELLANEOUS',
      item.miscellaneousType,
    ).multiply(item.quantity);
  }
  if (isOtherPurchasedCleaningChemical(item)) {
    return selectConstant(
      constants.COMMON,
      'OTHER_PURCHASED_FACTORS',
      'CLEANING_CHEMICAL',
      item.cleaningChemicalType,
    ).multiply(item.quantityKilograms);
  }
  if (isOtherPurchasedPharmacyChemical(item)) {
    return item.headTreated.multiply(
      selectConstant(
        constants.COMMON,
        'OTHER_PURCHASED_FACTORS',
        'PHARMACY_CHEMICAL',
        item.pharmacyChemicalType,
      ),
    );
  }
  return item.quantity.multiply(item.emissionFactor);
};

export function calculateOtherPurchasedGoodsAndServicesEmissions(
  input: OtherPurchasedGoodsAndServicesInputTransformed,
  context: ExecutionContext<HasCommonConstants>,
) {
  const { constants } = context;
  const emissions = (input.otherPurchasedGoodsAndServices ?? []).map((item) =>
    calculateItemEmissions(item, constants),
  );
  return sum(emissions, zeroCO2e);
}
