import Decimal from 'decimal.js-light';
import { RootContainer, TypedContainer } from './containers';
import { mass, RealNumber, realNumber } from './units';

export const one = new RootContainer(realNumber(new Decimal(1)), {
  name: 'one',
  valueType: 'constant',
});
export const zero = new RootContainer(realNumber(new Decimal(0)), {
  name: 'zero',
  valueType: 'constant',
});
export const tenToPowMinus3 = new RootContainer(
  realNumber(new Decimal(10).pow(-3)),
  {
    name: '10^-3',
    valueType: 'constant',
  },
);

export const zeroN2O = new RootContainer(mass('N2O', new Decimal(0)), {
  name: 'zeroN2O',
  valueType: 'constant',
});

export const zeroCH4 = new RootContainer(mass('CH4', new Decimal(0)), {
  name: 'zeroCH4',
  valueType: 'constant',
});

export const zeroCO2e = new RootContainer(mass('CO2e', new Decimal(0)), {
  name: 'zeroCO2e',
  valueType: 'constant',
});

export const zeroN = new RootContainer(mass('N', new Decimal(0)), {
  name: 'zeroN',
  valueType: 'constant',
});

export const oneMinus = (x: TypedContainer<RealNumber>) => one.minus(x);
