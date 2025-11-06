import { calculateScope1SavannahBurning } from '../../Beef/Scope1SavannahBurning';
import { testContext } from '../common/context';

describe('checking calculateScope1SavannahBurning, all types of inputs', () => {
  describe('VIC', () => {
    const totalCH4 = 0;
    const totalN2O = 0;
    const context = testContext('Beef');
    const emissions = calculateScope1SavannahBurning(
      {
        fireScarArea: 100,
        yearsSinceLastFire: 3,
        season: 'late dry season',
        rainfallZone: 'low',
        fuel: 'coarse',
        vegetation: 'Open woodland with mixed grass',
        patchiness: 'low',
      },
      'vic',
      context,
    );

    test('totalCH4 emissions should be accurate', () => {
      expect(emissions.totalCH4).toBeCloseTo(totalCH4);
    });

    test('totalN2O should be accurate', () => {
      expect(emissions.totalN2O).toBeCloseTo(totalN2O);
    });
  });

  describe('QLD', () => {
    const totalCH4 = 1.78569;
    const totalN2O = 1.0323;
    const context = testContext('Beef');
    const emissions = calculateScope1SavannahBurning(
      {
        fireScarArea: 100,
        yearsSinceLastFire: 3,
        season: 'late dry season',
        rainfallZone: 'low',
        fuel: 'coarse',
        vegetation: 'Open woodland with mixed grass',
        patchiness: 'low',
      },
      'qld',
      context,
    );

    test('totalCH4 emissions should be accurate', () => {
      expect(emissions.totalCH4).toBeCloseTo(totalCH4);
    });

    test('totalN2O should be accurate', () => {
      expect(emissions.totalN2O).toBeCloseTo(totalN2O);
    });
  });

  describe('NT', () => {
    const totalCH4 = 45.46795;
    const totalN2O = 20.06771;
    const context = testContext('Beef');
    const emissions = calculateScope1SavannahBurning(
      {
        fireScarArea: 400,
        yearsSinceLastFire: 5,
        season: 'early dry season',
        rainfallZone: 'low',
        fuel: 'fine',
        vegetation: 'Woodland with hummock grass',
        patchiness: 'high',
      },
      'nt',
      context,
    );

    test('totalCH4 emissions should be accurate', () => {
      expect(emissions.totalCH4).toBeCloseTo(totalCH4);
    });

    test('totalN2O should be accurate', () => {
      expect(emissions.totalN2O).toBeCloseTo(totalN2O);
    });
  });
});
