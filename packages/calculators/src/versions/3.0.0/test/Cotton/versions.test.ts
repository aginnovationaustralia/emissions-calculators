import { calculateScope1N2O } from '../../Cotton/Scope1';
import { testContext, V2_0_0 } from '../common/context';
import { cotton1 } from './cotton.data';

const cotton = {
  ...cotton1,
  otherFertiliserType: 'Triple Superphosphate (TSP)',
} as const;
const cottonSP11 = {
  ...cotton1,
  otherFertiliserType: 'Super Potash 1:1',
} as const;
const cottonSP21 = {
  ...cotton1,
  otherFertiliserType: 'Super Potash 2:1',
} as const;
const cottonSP31 = {
  ...cotton1,
  otherFertiliserType: 'Super Potash 3:1',
} as const;
const cottonSP41 = {
  ...cotton1,
  otherFertiliserType: 'Super Potash 4:1',
} as const;
const cottonSP51 = {
  ...cotton1,
  otherFertiliserType: 'Super Potash 5:1',
} as const;
const cottonMOP = {
  ...cotton1,
  otherFertiliserType: 'Muriate of Potash',
} as const;
const cottonSOP = {
  ...cotton1,
  otherFertiliserType: 'Sulphate of Potash',
} as const;
const cottonSOA = {
  ...cotton1,
  otherFertiliserType: 'Sulphate of Ammonia',
} as const;

describe('checking new TSP fertiliser types', () => {
  const context = testContext(V2_0_0, 'Cotton');

  test('is returning a value for TSP', () => {
    const n2o = calculateScope1N2O(cotton, context);
    expect(n2o.fertiliserN2O).toBeGreaterThan(0);
  });

  test('is returning a value for SUPER POTASH 1:1', () => {
    const n2oSP11 = calculateScope1N2O(cottonSP11, context);
    expect(n2oSP11.fertiliserN2O).toBeGreaterThan(0);
  });

  test('is returning a value for SUPER POTASH 2:1', () => {
    const n2oSP21 = calculateScope1N2O(cottonSP21, context);
    expect(n2oSP21.fertiliserN2O).toBeGreaterThan(0);
  });

  test('is returning a value for SUPER POTASH 3:1', () => {
    const n2oSP31 = calculateScope1N2O(cottonSP31, context);
    expect(n2oSP31.fertiliserN2O).toBeGreaterThan(0);
  });

  test('is returning a value for SUPER POTASH 4:1', () => {
    const n2oSP41 = calculateScope1N2O(cottonSP41, context);
    expect(n2oSP41.fertiliserN2O).toBeGreaterThan(0);
  });

  test('is returning a value for SUPER POTASH 5:1', () => {
    const n2oSP51 = calculateScope1N2O(cottonSP51, context);
    expect(n2oSP51.fertiliserN2O).toBeGreaterThan(0);
  });

  test('is returning a value for MURIATE OF POTASH', () => {
    const n2oMOP = calculateScope1N2O(cottonMOP, context);
    expect(n2oMOP.fertiliserN2O).toBeGreaterThan(0);
  });

  test('is returning a value for SULPHATE OF POTASH', () => {
    const n2oSOP = calculateScope1N2O(cottonSOP, context);
    expect(n2oSOP.fertiliserN2O).toBeGreaterThan(0);
  });

  test('is returning a value for SULPHATE OF AMMONIA', () => {
    const n2oSOA = calculateScope1N2O(cottonSOA, context);
    expect(n2oSOA.fertiliserN2O).toBeGreaterThan(0);
  });
});
