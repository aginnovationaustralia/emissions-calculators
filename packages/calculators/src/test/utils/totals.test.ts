import { addTotalValueWithEmissionElements } from '../../calculators/common/tools';

describe('addTotalValueWithEmissionElements', () => {
  test('addTotalValueWithEmissionElements should work', () => {
    const res = addTotalValueWithEmissionElements({
      fuelCO2: 0.1,
      fuelN2O: 0.4,
      fuelCH4: 0.2,
      ureaCO2: 0.2,
      burningCH4: 0.15,
      total: 0.2,
      totalCH4: 0.1,
    });

    expect(res.total).toBeCloseTo(1.05);
    expect(res.totalCO2).toBeCloseTo(0.3);
    expect(res.totalCH4).toBeCloseTo(0.35);
    expect(res.totalN2O).toBeCloseTo(0.4);
  });
});
