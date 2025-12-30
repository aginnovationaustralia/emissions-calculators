import { Origin, RootOrigin } from './origins';
import { NumberUnit } from './units';

const formatRoot = (origin: RootOrigin<NumberUnit>): string => {
  if (origin.valueType === 'intermediate') {
    return `unnamed root`;
  }
  return origin.name;
};

export const formatOriginRecursive = (origin: Origin<NumberUnit>): string => {
  switch (origin.originType) {
    case 'root':
      return formatRoot(origin);
    case 'binary':
      return `${formatOriginRecursive(origin.left)} ${
        origin.type
      } ${formatOriginRecursive(origin.right)}`;
    case 'unary':
      return `${formatOriginRecursive(origin.from)}`;
    case 'sum':
      return origin.from.items.map(formatOriginRecursive).join(' + ');
    case 'constant_selection':
      return origin.selectors.join('.');
  }
};

export const formatOrigin = (origin: Origin<NumberUnit>): string => {
  const lhs =
    origin.valueType === 'intermediate'
      ? `unnamed ${origin.originType}`
      : origin.name;

  return `${lhs} = ${formatOriginRecursive(origin)}`;
};
