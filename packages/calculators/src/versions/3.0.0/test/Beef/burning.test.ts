import { calculateScope1SavannahBurning } from '../../Beef/Scope1SavannahBurning';
import { testContext, V3_0_0 } from '../common/context';

describe('checking calculateScope1SavannahBurning, all types of inputs', () => {
  describe.each([[V3_0_0, 0, 0]])('VIC', (version, totalCH4, totalN2O) => {
    const context = testContext(version, 'Beef');
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

  describe.each([[V3_0_0, 1.78569, 1.0323]])(
    'QLD',
    (version, totalCH4, totalN2O) => {
      const context = testContext(version, 'Beef');
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
    },
  );

  describe.each([[V3_0_0, 45.46795, 20.06771]])(
    'NT',
    (version, totalCH4, totalN2O) => {
      const context = testContext(version, 'Beef');
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
    },
  );
});
