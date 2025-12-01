import { calculateTreeCarbonSequestration } from '@/calculators/common/trees';
import { Vegetation } from '@/types';
import { BeefPurchaseSchema } from '@/types/Beef/beefpurchase.input';
import { LivestockPurchaseSchema } from '@/types/livestockPurchase.input';
import {
  InputValidationError,
  validateCalculatorInput,
} from '../calculators/validate';
import { testContext } from './common/context';
import { veg1 } from './SheepBeef/vegetation.data';

const context = testContext();

describe('checking LivestockPurchaseSchemas', () => {
  const oldPurchase = {
    head: 1,
    purchaseWeight: 2,
  };

  const validatedPurchase = validateCalculatorInput(
    LivestockPurchaseSchema,
    oldPurchase,
  );

  test('validation should result in no error', () => {
    expect(validatedPurchase).toBeDefined();
  });
});

describe('checking LivestockPurchaseSchemas from parent class, set to fail', () => {
  const oldPurchaseFail = {
    headPurchased: undefined,
    purchasedWeight: 2,
    source: 'random source name',
  };

  test('validation should result in at least one error', () => {
    expect(
      validateCalculatorInput(BeefPurchaseSchema, oldPurchaseFail),
    ).toEqual(
      expect.objectContaining({
        valid: false,
        error: expect.any(InputValidationError),
      }),
    );
  });
});

describe('checking bad tree values', () => {
  const veg = JSON.parse(JSON.stringify(veg1.vegetation));
  const vegBadData: Vegetation = { ...veg, soil: 'Structured Earths' };
  const vegBadData2: Vegetation = {
    ...veg,
    soil: 'Structured Earths',
    region: 'North Coast',
  };
  const vegNegativeAge: Vegetation = { ...veg, age: -1 };

  const resBad = calculateTreeCarbonSequestration(vegBadData, context);
  const resNeg = calculateTreeCarbonSequestration(vegNegativeAge, context);
  const resBad2 = calculateTreeCarbonSequestration(vegBadData2, context);
  const resNoData = calculateTreeCarbonSequestration(
    { age: 12 } as Vegetation,
    context,
  );

  test('bad combination of data should result in 0', () => {
    expect(resBad.total).toBe(0);
    expect(resBad.average).toBe(0);
  });

  test('negative age should result in 0', () => {
    expect(resNeg.total).toBe(0);
    expect(resNeg.average).toBe(0);
  });

  test('bad combination of data 2 should result in 0', () => {
    expect(resBad2.total).toBe(0);
    expect(resBad2.average).toBe(0);
  });

  test('no data should result in 0', () => {
    expect(resNoData.total).toBe(0);
    expect(resNoData.average).toBe(0);
  });
});
