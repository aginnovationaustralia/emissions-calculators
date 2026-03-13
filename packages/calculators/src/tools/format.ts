import { Container, isNamedOrigin } from './containers';
import { AnyUnit, isStringUnit, isVoid } from './units';

export function formatUnit(unit: AnyUnit): string {
  if (isVoid(unit)) {
    return 'Void';
  }
  if (isStringUnit(unit)) {
    return `string: (${unit})`;
  }

  switch (unit.__unitType) {
    case 'MassPerMass':
      return `Mass(${unit.snum}) / Mass(${unit.sdenom})`;
    case 'Mass':
      return `Mass(${unit.substance})`;
    case 'Volume':
      return `Volume(${unit.substance})`;
    case 'Energy':
      return 'energy';
    case 'RealNumber':
      return 'real number';
    case 'MassPerEnergy':
      return `Mass(${unit.substance}) / Energy`;
    case 'EnergyPerMass':
      return `Energy / Mass(${unit.substance})`;
    case 'EnergyPerVolume':
      return `Energy / Volume(${unit.substance})`;
    case 'MassPerVolume':
      return `Mass(${unit.mass}) / Volume(${unit.volume})`;
    case 'MassPerArea':
      return `Mass(${unit.substance}) / Area`;
    case 'MassPerTime':
      return `Mass(${unit.substance}) / Time`;
    case 'MassPerHeadPerDay':
      return `Mass(${unit.substance}) / Head / Day`;
    case 'MassPerDay':
      return `Mass(${unit.substance}) / Day`;
    case 'Days':
      return 'Days';
    case 'Head':
      return 'Head';
    case 'Area':
      return 'Area';
    case 'Time':
      return 'Time';
    case 'Electricity':
      return 'Electricity';
    case 'MassPerElectricity':
      return `Mass(${unit.substance}) / Electricity`;
  }
}

export const formatExpression = (container: Container<AnyUnit>): string => {
  //   const lhsUnit = container.unit;
  //   let lhs = '';
  //   if (isVoid(lhsUnit)) {
  //     lhs = 'void(0)';
  //   } else if (isStringUnit(lhsUnit)) {
  //     lhs = lhsUnit;
  //   } else {
  //     // console.log(container);
  //     lhs = lhsUnit.value.toNumber().toString();
  //   }

  const lhs = formatValueAndName(container);

  const rhs = formatExpressionRecursive(container);

  return `${lhs} = ${rhs}`;
};

const formatUnitValue = (unit: AnyUnit): string => {
  if (isVoid(unit)) {
    return 'void(0)';
  } else if (isStringUnit(unit)) {
    return unit;
  } else {
    return unit.value.toNumber().toString();
  }
};

const formatValueAndName = (container: Container<AnyUnit>): string => {
  const core = container.core;
  const name = core?.name ?? 'anon';

  return `${name}(${formatUnitValue(container.unit)})`;
};

const formatExpressionRecursive = (container: Container<AnyUnit>): string => {
  switch (container.originType) {
    case 'binary':
      return `${formatExpressionRecursive(container.left)} ${container.type === 'add' ? '+' : container.type === 'subtract' ? '-' : container.type === 'multiply' ? '*' : '/'} ${formatExpressionRecursive(container.right)}`;
    case 'root':
      return formatValueAndName(container);
    case 'sum':
      return container.from.map(formatExpressionRecursive).join(' + ');
    case 'constant_selection':
      return formatValueAndName(container);
    case 'bracketed':
      return `(${formatExpressionRecursive(container.inner)})`;
    default:
      return `Unknown ${container}`;
  }
};

export const formatIntermediates = (container: Container<AnyUnit>): string => {
  const intermediates = formatIntermediatesRecursive(container);

  return [formatValueAndName(container)].concat(intermediates).join('\n');
};

const formatIntermediatesRecursive = (
  container: Container<AnyUnit>,
): string[] => {
  switch (container.originType) {
    case 'binary':
      return formatIntermediatesRecursive(container.left).concat(
        formatIntermediatesRecursive(container.right),
      );
    case 'root':
      return [formatValueAndName(container)];
    case 'sum':
      return container.from.flatMap(formatIntermediatesRecursive);
    case 'constant_selection':
      return [formatValueAndName(container)];
    case 'bracketed':
      return formatIntermediatesRecursive(container.inner);
    default:
      return [`Unknown ${container}`];
  }
};

type NamedValuesNode = {
  lhs?: string;
  rhs?: string;
  children: NamedValuesNode[];
  depth: number;
};

const collectExpressions = (
  nodes: NamedValuesNode[],
  maxDepth: number,
): string[] => {
  return nodes.flatMap((node) => {
    if (node.depth >= maxDepth) {
      return [];
    }
    const children = collectExpressions(node.children, maxDepth);
    const indent = '  '.repeat(node.depth);
    const current = node.lhs
      ? [`${indent}${node.lhs} = ${node.rhs ?? 'rhs'}`]
      : [];
    return current.concat(children);
  });
};

export const formatNamedValues = (
  container: Container<AnyUnit>,
  maxDepth: number,
): string => {
  const root = formatNamedValuesRecursive(container, 0);
  const expressions = collectExpressions(root, maxDepth);

  return expressions.join('\n');
};

const formatNamedValuesRecursive = (
  container: Container<AnyUnit>,
  depth: number,
  bracketWrap: boolean = false,
): NamedValuesNode[] => {
  const isNamed = isNamedOrigin(container.core);
  const lhs = formatValueAndName(container);

  const wrap = bracketWrap ? (s: string) => `(${s})` : (s: string) => s;

  if (isNamed) {
    switch (container.originType) {
      case 'binary': {
        // convert left and right to named values. Left and right may return a list of named containers that also require expansion
        const leftResults = formatNamedValuesRecursive(
          container.left,
          depth + 1,
        );
        const rightResults = formatNamedValuesRecursive(
          container.right,
          depth + 1,
        );
        const children = leftResults.concat(rightResults);
        const op =
          container.type === 'add'
            ? ' + '
            : container.type === 'subtract'
              ? ' - '
              : container.type === 'multiply'
                ? ' * '
                : ' / ';
        return [
          {
            lhs,
            rhs: wrap(children.map((c) => c.lhs ?? c.rhs).join(op)),
            children,
            depth,
          },
        ];
      }
      case 'sum': {
        const children = container.from.flatMap((c) =>
          formatNamedValuesRecursive(c, depth + 1),
        );
        return [
          {
            lhs,
            rhs: wrap(`sum (${children.map((c) => c.lhs).join(' + ')})`),
            // expression: `${children.map((c) => c.expression).join(' + ')}`,
            children,
            depth,
          },
        ];
      }
      case 'constant_selection':
        return [
          {
            lhs,
            rhs: 'constant',
            children: [],
            depth,
          },
        ];
      case 'root':
        return [
          {
            lhs,
            rhs: 'root',
            children: [],
            depth,
          },
        ];
      case 'bracketed': {
        return formatNamedValuesRecursive(container.inner, depth, true);
      }
      default:
        return [
          {
            lhs,
            children: [],
            depth: depth + 1,
          },
        ];
    }
  } else {
    switch (container.originType) {
      case 'binary': {
        const op =
          container.type === 'add'
            ? ' + '
            : container.type === 'subtract'
              ? ' - '
              : container.type === 'multiply'
                ? ' * '
                : ' / ';
        const leftResults = formatNamedValuesRecursive(container.left, depth);
        const rightResults = formatNamedValuesRecursive(container.right, depth);
        const children = leftResults.concat(rightResults);
        return [
          {
            lhs: undefined,
            rhs: wrap(children.map((c) => c.lhs ?? c.rhs).join(op)),
            children,
            depth,
          },
        ];
      }
      case 'sum': {
        const children = container.from.flatMap((c) =>
          formatNamedValuesRecursive(c, depth),
        );
        return [
          {
            lhs: undefined,
            rhs: wrap(
              `sum (${children.map((c) => c.lhs ?? c.rhs).join(' + ')})`,
            ),
            children,
            depth,
          },
        ];
      }
      case 'bracketed': {
        return formatNamedValuesRecursive(container.inner, depth, true);
      }
      case 'root':
        return [
          {
            lhs,
            rhs: 'root',
            children: [],
            depth,
          },
        ];
    }
    return [];
  }
};
