import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { num, root } from '@/tools/containers';
import { sum } from '@/tools/sum';
import { mass } from '@/tools/units';
import { LULUCFParentInputTransformed } from './input';

export const calculate_16_4_1_2_SavannaCarbonChange = (
  input: LULUCFParentInputTransformed,
  _context: ExecutionContext<ConstantsForGrainsCalculator>,
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
    return burning.carbonStockChangeLowRainfallZone.plus(
      burning.carbonStockChangeHighRainfallZone,
    );
  });

  return sum(carbonStockChangeRecords).multiply(num(-1)).named('CSFM,y');
};

export const calculate_16_4_1_4_SavannaBiomassBurning = (
  input: LULUCFParentInputTransformed,
  _context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  /*
      ESFM,y = SUM (ELRZ,i,y + EHRZ,i,y)
      */
  const burning = input.landUse?.burning;

  if (!burning) {
    return root(mass('CO2e', 0)).named('ESFM,y');
  }

  const emissionsRecords = burning.map((burning) => {
    return burning.emissionsFromBurningLowRainfallZone.plus(
      burning.emissionsFromBurningHighRainfallZone,
    );
  });
  return sum(emissionsRecords).named('ESFM,y');
};
