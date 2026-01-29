import Decimal from 'decimal.js-light';
import { RootContainer, TypedContainer } from './origins';
import { RealNumber, realNumber } from './units';

export const one = new RootContainer(realNumber(new Decimal(1)), {
  name: 'one',
  valueType: 'constant',
});
export const zero = new RootContainer(realNumber(new Decimal(0)), {
  name: 'zero',
  valueType: 'constant',
});

export const oneMinus = (x: TypedContainer<RealNumber>) => one.minus(x);
