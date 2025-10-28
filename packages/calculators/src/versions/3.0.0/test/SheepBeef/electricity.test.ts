import { calculateElectricityScope2And3 } from '../../common-legacy/electricity';
import { loadAllConstants } from '../../constants/constantsLoader';
import { ExecutionContext } from '../../executionContext';
import { ConstantsForSheepBeefCalculator } from '../../SheepBeef/constants';
import { V2_0_0 } from '../common/context';

describe('checking calculateElectricityScope2And3, all types of inputs', () => {
  const constants = loadAllConstants();
  const context: ExecutionContext<ConstantsForSheepBeefCalculator> = {
    calculator: 'SheepBeef',
    version: V2_0_0,
    constants,
    timestamp: '2000-01-01T00:00:00Z',
  };

  describe('VIC, fully non-renewable usage', () => {
    const emissions = calculateElectricityScope2And3(
      'vic',
      'State Grid',
      0.0,
      100000,
      context,
    );

    test('scope 2 emissions should be accurate', () => {
      expect(emissions.scope2).toBeCloseTo(77);
    });

    test('scope 3 emissions should be accurate', () => {
      expect(emissions.scope3).toBeCloseTo(9);
    });
  });

  describe('VIC, partially non-renewable usage', () => {
    const emissions = calculateElectricityScope2And3(
      'vic',
      'State Grid',
      0.3,
      100000,
      context,
    );

    test('scope 2 emissions should be accurate', () => {
      expect(emissions.scope2).toBeCloseTo(53.9);
    });

    test('scope 3 emissions should be accurate', () => {
      expect(emissions.scope3).toBeCloseTo(6.3);
    });
  });

  describe('VIC, all renewable usage', () => {
    const emissions = calculateElectricityScope2And3(
      'vic',
      'State Grid',
      1.0,
      100000,
      context,
    );

    test('scope 2 emissions should be accurate', () => {
      expect(emissions.scope2).toBeCloseTo(0);
    });

    test('scope 3 emissions should be accurate', () => {
      expect(emissions.scope3).toBeCloseTo(0);
    });
  });

  describe('VIC, fully renewable usage', () => {
    const emissions = calculateElectricityScope2And3(
      'vic',
      'Renewable',
      0.0,
      100000,
      context,
    );

    test('scope 2 emissions should be accurate', () => {
      expect(emissions.scope2).toBeCloseTo(0);
    });

    test('scope 3 emissions should be accurate', () => {
      expect(emissions.scope3).toBeCloseTo(0);
    });
  });

  describe('VIC, fully renewable usage with accidental input', () => {
    const emissions = calculateElectricityScope2And3(
      'vic',
      'Renewable',
      0.5,
      100000,
      context,
    );

    test('scope 2 emissions should be accurate', () => {
      expect(emissions.scope2).toBeCloseTo(0);
    });

    test('scope 3 emissions should be accurate', () => {
      expect(emissions.scope3).toBeCloseTo(0);
    });
  });
});

describe('checking calculateElectricityScope2And3, all states', () => {
  const constants = loadAllConstants();
  const context: ExecutionContext<ConstantsForSheepBeefCalculator> = {
    calculator: 'SheepBeef',
    version: V2_0_0,
    constants,
    timestamp: '2000-01-01T00:00:00Z',
  };

  describe('ACT, fully non-renewable usage', () => {
    const emissions = calculateElectricityScope2And3(
      'act',
      'State Grid',
      0.0,
      100000,
      context,
    );

    test('scope 2 emissions should be accurate', () => {
      expect(emissions.scope2).toBeCloseTo(66);
    });

    test('scope 3 emissions should be accurate', () => {
      expect(emissions.scope3).toBeCloseTo(4);
    });
  });

  describe('NSW, fully non-renewable usage', () => {
    const emissions = calculateElectricityScope2And3(
      'nsw',
      'State Grid',
      0.0,
      100000,
      context,
    );

    test('scope 2 emissions should be accurate', () => {
      expect(emissions.scope2).toBeCloseTo(66);
    });

    test('scope 3 emissions should be accurate', () => {
      expect(emissions.scope3).toBeCloseTo(4);
    });
  });

  describe('TAS, fully non-renewable usage', () => {
    const emissions = calculateElectricityScope2And3(
      'tas',
      'State Grid',
      0.0,
      100000,
      context,
    );

    test('scope 2 emissions should be accurate', () => {
      expect(emissions.scope2).toBeCloseTo(15);
    });

    test('scope 3 emissions should be accurate', () => {
      expect(emissions.scope3).toBeCloseTo(3);
    });
  });

  describe('WA SW, fully non-renewable usage', () => {
    const emissions = calculateElectricityScope2And3(
      'wa_sw',
      'State Grid',
      0.0,
      100000,
      context,
    );

    test('scope 2 emissions should be accurate', () => {
      expect(emissions.scope2).toBeCloseTo(51);
    });

    test('scope 3 emissions should be accurate', () => {
      expect(emissions.scope3).toBeCloseTo(6);
    });
  });

  describe('SA, fully non-renewable usage', () => {
    const emissions = calculateElectricityScope2And3(
      'sa',
      'State Grid',
      0.0,
      100000,
      context,
    );

    test('scope 2 emissions should be accurate', () => {
      expect(emissions.scope2).toBeCloseTo(23);
    });

    test('scope 3 emissions should be accurate', () => {
      expect(emissions.scope3).toBeCloseTo(5);
    });
  });

  describe('QLD, fully non-renewable usage', () => {
    const emissions = calculateElectricityScope2And3(
      'qld',
      'State Grid',
      0.0,
      100000,
      context,
    );

    test('scope 2 emissions should be accurate', () => {
      expect(emissions.scope2).toBeCloseTo(71);
    });

    test('scope 3 emissions should be accurate', () => {
      expect(emissions.scope3).toBeCloseTo(10);
    });
  });

  describe('WA NW, fully non-renewable usage', () => {
    const emissions = calculateElectricityScope2And3(
      'wa_nw',
      'State Grid',
      0.0,
      100000,
      context,
    );

    test('scope 2 emissions should be accurate', () => {
      expect(emissions.scope2).toBeCloseTo(61);
    });

    test('scope 3 emissions should be accurate', () => {
      expect(emissions.scope3).toBeCloseTo(9);
    });
  });

  describe('NT, fully non-renewable usage', () => {
    const emissions = calculateElectricityScope2And3(
      'nt',
      'State Grid',
      0.0,
      100000,
      context,
    );

    test('scope 2 emissions should be accurate', () => {
      expect(emissions.scope2).toBeCloseTo(56);
    });

    test('scope 3 emissions should be accurate', () => {
      expect(emissions.scope3).toBeCloseTo(7);
    });
  });
});
