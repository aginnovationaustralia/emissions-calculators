import Decimal from 'decimal.js-light';
import { Origin, SummedOrigin } from './origins';
import { NumberUnit } from './values';

const sumNumberUnits = <N extends NumberUnit>(a: N, bs: N[]): N => {
    if (bs.length === 0) {
        return a;
    }
    const [first, ...rest] = bs;
    return sumNumberUnits(a.add(first), rest);
};

export const sum = <N extends NumberUnit>(values: Origin<N>[]): SummedOrigin => {
    const [first, ...rest] = values;
  return {
    type: 'sum',
    from: values,
    unit: rest.reduce((acc, curr) => acc.add((curr.unit as N), first.unit),
  };
};
