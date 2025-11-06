import { validateCalculatorInput } from '../calculators';
import {
  calculateScope3Fertiliser,
  mergeOtherFertilisers,
} from '../common/fertiliser';
import { calculateTreeCarbonSequestration } from '../common/trees';
import { Vegetation } from '../types';
import { BeefPurchaseSchema } from '../types/Beef/beefpurchase.input';
import { LivestockPurchaseSchema } from '../types/livestockPurchase.input';
import { beefTestInput } from './Beef/beef.data';
import { testContext } from './common/context';
import { veg1 } from './SheepBeef/vegetation.data';

const P = 7;

const context = testContext();

describe('checking Scope3Fertiliser via mergeOtherFertilisers', () => {
  const beefInput = JSON.parse(JSON.stringify(beefTestInput));
  const beefInputCopy = JSON.parse(JSON.stringify(beefTestInput));
  const beefInputFertiliserAsArray = {
    ...beefInputCopy,
    beef: {
      fertiliser: {
        ...beefInputCopy.fertiliser,
        otherFertilisers: [
          {
            otherType: beefInputCopy.fertiliser.otherType,
            otherDryland: beefInputCopy.fertiliser.otherDryland,
            otherIrrigated: beefInputCopy.fertiliser.otherIrrigated,
          },
        ],
      },
    },
  };

  // manually changed
  beefInput.fertiliser.otherFertilisers = [
    {
      otherType:
        beefInput.fertiliser.otherType ?? ' Urea-Ammonium Nitrate (UAN)',
      otherDryland: beefInput.fertiliser.otherDryland ?? 0,
      otherIrrigated: beefInput.fertiliser.otherIrrigated ?? 0,
    },
  ];

  const res = calculateScope3Fertiliser(beefInput.fertiliser, context);
  const resMerged = calculateScope3Fertiliser(
    mergeOtherFertilisers(beefInput.fertiliser),
    context,
  );
  const resMergedArray = calculateScope3Fertiliser(
    mergeOtherFertilisers(beefInputFertiliserAsArray.fertiliser),
    context,
  );

  test('scope 3 beef fertiliser should be accurate and all the same', () => {
    expect(res).toBeCloseTo(42.4284, P);
    expect(resMerged).toBeCloseTo(res, P);
    expect(resMergedArray).toBeCloseTo(res, P);
  });
});

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
    expect(() =>
      validateCalculatorInput(BeefPurchaseSchema, oldPurchaseFail),
    ).toThrow();
  });
});

describe('checking Fertiliser merge', () => {
  const beefInput = JSON.parse(JSON.stringify(beefTestInput));
  beefInput.fertiliser.otherType = ' Urea-Ammonium Nitrate (UAN)';
  beefInput.fertiliser.otherDryland = 2;
  beefInput.fertiliser.otherIrrigated = 2;

  delete beefInput.fertiliser.otherFertilisers;

  const merged = mergeOtherFertilisers(beefInput.fertiliser);

  test('merged should be an array', () => {
    expect(Array.isArray(merged.otherFertilisers)).toBe(true);
    expect(merged.otherFertilisers.length).toBe(1);
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
