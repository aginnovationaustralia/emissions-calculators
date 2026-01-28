import Decimal from 'decimal.js-light';
import { RootContainer } from './origins';
import { realNumber } from './units';

export const one = new RootContainer(realNumber(new Decimal(1)), {
  name: 'one',
  valueType: 'constant',
});
export const zero = new RootContainer(realNumber(new Decimal(0)), {
  name: 'zero',
  valueType: 'constant',
});
