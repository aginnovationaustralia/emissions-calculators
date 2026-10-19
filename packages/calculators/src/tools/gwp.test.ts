import Decimal from 'decimal.js-light';
import { convertToCO2e } from './gwp';

describe('convertToCO2e', () => {
  it.each([
    ['CO2', 10, 10],
    ['CO2e', 10, 10],
    ['CH4', 10, 280],
    ['N2O', 10, 2650],
  ] as const)(
    '%s: multiplies by the correct GWP factor',
    (gas, kg, expected) => {
      expect(convertToCO2e(new Decimal(kg), gas).toNumber()).toBe(expected);
    },
  );
});
