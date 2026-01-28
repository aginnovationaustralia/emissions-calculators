import Decimal from 'decimal.js-light';
import { rootOrigin } from './origins';
import { realNumber } from './units';

export const one = rootOrigin(realNumber(new Decimal(1)), {
  name: 'one',
  valueType: 'constant',
});
export const zero = rootOrigin(realNumber(new Decimal(0)), {
  name: 'zero',
  valueType: 'constant',
});
