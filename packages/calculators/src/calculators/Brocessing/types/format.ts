import {
  BinaryOrigin,
  ConstantSelectionOrigin,
  Origin,
  RootOrigin,
  SummedOrigin,
} from './origins';
import { NumberUnit } from './units';

const formatRoot = (origin: RootOrigin<NumberUnit>): string => {
  return origin.name;
};

// A function you can pass to array.filter that will create a unique array of strings
const uniqueStrings = (value: string, index: number, self: string[]): boolean =>
  self.indexOf(value) === index;

const formatNamesSum = (origin: SummedOrigin<NumberUnit>): string => {
  return `sum(${origin.from.items
    .map(formatNamesRecursive)
    .filter(uniqueStrings)
    .join(' + ')})`;
};

const binaryExpression = (
  type: 'add' | 'subtract' | 'multiply' | 'divide',
): string => {
  switch (type) {
    case 'add':
      return '+';
    case 'subtract':
      return '-';
    case 'multiply':
      return '*';
    case 'divide':
      return '/';
  }
};
const formatNamesBinary = (origin: BinaryOrigin<NumberUnit>): string => {
  return `${formatNamesRecursive(origin.left)} ${binaryExpression(
    origin.type,
  )} ${formatNamesRecursive(origin.right)}`;
};

const formatNamesConstantSelection = (
  origin: ConstantSelectionOrigin<NumberUnit>,
): string => {
  return origin.selectors
    .map((selector) =>
      typeof selector === 'string'
        ? selector
        : selector.originType === 'root'
        ? `[${selector.name}]`
        : `${[selector.unit]}`,
    )
    .join('.');
};

export const formatNamesRecursive = (origin: Origin<NumberUnit>): string => {
  switch (origin.originType) {
    case 'root':
      return formatRoot(origin);
    case 'binary':
      return formatNamesBinary(origin);
    case 'unary':
      return `${formatNamesRecursive(origin.from)}`;
    case 'sum':
      return formatNamesSum(origin);
    case 'constant_selection':
      return formatNamesConstantSelection(origin);
  }
};

export const formatNames = (origin: Origin<NumberUnit>): string => {
  const lhs =
    origin.valueType === 'intermediate'
      ? `unnamed ${origin.originType}`
      : origin.name;

  return `${lhs} = ${formatNamesRecursive(origin)}`;
};
