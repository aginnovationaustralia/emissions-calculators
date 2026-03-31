import Decimal from 'decimal.js-light';
import { num, root, RootContainer, TypedContainer } from './containers';
import { days, mass, RealNumber, realNumber } from './units';

export const one = new RootContainer(realNumber(new Decimal(1)), {
  name: 'one',
});
export const zero = new RootContainer(realNumber(new Decimal(0)), {
  name: 'zero',
});
export const tenToPowMinus3 = new RootContainer(
  realNumber(new Decimal(10).pow(-3)),
  {
    name: '10^-3',
  },
);
export const tenToPowMinus4 = new RootContainer(
  realNumber(new Decimal(10).pow(-4)),
  {
    name: '10^-4',
  },
);

export const zeroN2O = new RootContainer(mass('N2O', new Decimal(0)), {
  name: 'zeroN2O',
});

export const zeroCH4 = new RootContainer(mass('CH4', new Decimal(0)), {
  name: 'zeroCH4',
});

export const zeroCO2e = new RootContainer(mass('CO2e', new Decimal(0)), {
  name: 'zeroCO2e',
});

export const zeroN = new RootContainer(mass('N', new Decimal(0)), {
  name: 'zeroN',
});

export const oneMinus = (x: TypedContainer<RealNumber>) => one.minus(x);
export const onePlus = (x: TypedContainer<RealNumber>) => one.plus(x);

export const daysInYear = root(days(365));
export const daysPostWeaning = root(days(281));
export const daysPreWeaning = root(days(84));
export const daysInSeason = root(days(91.25)).named('daysInSeason');

export const e = num(Math.E).named('e');
