import { ExecutionContext } from '@/calculators/executionContext';
import { num, root } from '@/tools/containers';
import { sum } from '@/tools/sum';
import { mass } from '@/tools/units';
import { ConstantsForLULUCF } from './constants';
import { LULUCFParentInputTransformed } from './input';

export const calculate_16_5_1_2_SavannaCarbonChange = (
  input: LULUCFParentInputTransformed,
  _context: ExecutionContext<ConstantsForLULUCF>,
) => {
  /*
    CSFM,y = SUM ∆Ci,y * -1
    ∆Ci,y = (∆CHRZ,i,y + ∆CLRZ,i,y)
    */
  const burning = input.landUse?.burning;

  if (!burning) {
    return root(mass('CO2e', 0)).named('CSFM,y');
  }

  const carbonStockChangeRecords = burning.map((burning) => {
    return burning.carbonStockChangeLowRainfallZone
      .plus(burning.carbonStockChangeHighRainfallZone)
      .reference('16.5.1.2 (2)');
  });

  return sum(carbonStockChangeRecords)
    .multiply(num(-1))
    .named('CSFM,y')
    .reference('16.5.1.2 (1)');
};

export const calculate_16_5_1_4_SavannaBiomassBurning = (
  input: LULUCFParentInputTransformed,
  _context: ExecutionContext<ConstantsForLULUCF>,
) => {
  /*
      ESFM,y = SUM (ELRZ,i,y + EHRZ,i,y)
      */
  const burning = input.landUse?.burning;

  if (!burning) {
    return root(mass('CO2e', 0)).named('ESFM,y');
  }

  const emissionsRecords = burning.map((burning) => {
    return burning.emissionsFromBurningLowRainfallZone
      .plus(burning.emissionsFromBurningHighRainfallZone)
      .reference('16.5.1.4 (1)');
  });
  return sum(emissionsRecords).named('ESFM,y');
};
