import { AnyContainer, isNamedOrigin } from './containers';
import { AnyUnit, isBooleanUnit, isStringUnit, isVoid } from './units';

export function formatUnit(unit: AnyUnit): string {
  if (isVoid(unit)) {
    return 'Void';
  }
  if (isStringUnit(unit)) {
    return `string: (${unit})`;
  }
  if (isBooleanUnit(unit)) {
    return 'boolean';
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
    case 'MassPerAreaPerYear':
      return `Mass(${unit.substance}) / Area / Year`;
    case 'MassPerYear':
      return `Mass(${unit.substance}) / Year`;
    case 'MassPerTime':
      return `Mass(${unit.substance}) / Time`;
    case 'MassPerHeadPerDay':
      return `Mass(${unit.substance}) / Head / Day`;
    case 'MassPerHeadPerYear':
      return `Mass(${unit.substance}) / Head / Year`;
    case 'MassPerDay':
      return `Mass(${unit.substance}) / Day`;
    case 'VolumePerHeadPerDay':
      return `Volume(${unit.substance}) / Head / Day`;
    case 'VolumePerMass':
      return `Volume(${unit.volume}) / Mass(${unit.mass})`;
    case 'MassPerHead':
      return `Mass(${unit.substance}) / Head`;
    case 'Days':
      return 'Days';
    case 'Years':
      return 'Years';
    case 'CountPerArea':
      return 'Count / Area';
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
    case 'MassPerAreaPerDay':
      return `Mass(${unit.substance}) / Area / Day`;
    case 'Distance':
      return 'Disance';
    case 'MassDistance':
      return `Mass-Distance(${unit.substance})`;
    case 'MassPerMassDistance':
      return `Mass(${unit.snum}) / Mass-Distance(${unit.sdenom})`;
    case 'EnergyPerHeadPerDay':
      return `Energy / Head / Day`;
  }
}

export const formatExpression = (container: AnyContainer): string => {
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

const formatUnitValue = (unit: AnyContainer['unit']): string => {
  if (isVoid(unit)) {
    return 'void(0)';
  } else if (isStringUnit(unit)) {
    return unit;
  } else if (isBooleanUnit(unit)) {
    return unit.toString();
  } else {
    return unit.store.toNumber().toString();
  }
};

const formatOperator = (
  type: 'add' | 'subtract' | 'multiply' | 'divide' | 'power' | 'min' | 'max',
): string => {
  const operatorMap = {
    add: '+',
    subtract: '-',
    multiply: '*',
    divide: '/',
    power: '^',
    min: 'min',
    max: 'max',
  };
  return operatorMap[type];
};

const formatValueAndName = (container: AnyContainer): string => {
  const name = container.meta.name ?? 'n';

  return `${name}(${formatUnitValue(container.unit)})`;
};

const formatExpressionRecursive = (container: AnyContainer): string => {
  switch (container.origin.kind) {
    case 'binary':
      if (container.origin.operation === 'min') {
        return `${formatOperator(container.origin.operation)}(${formatExpressionRecursive(container.origin.left)}, ${formatExpressionRecursive(container.origin.right)})`;
      }
      return `${formatExpressionRecursive(container.origin.left)} ${formatOperator(container.origin.operation)} ${formatExpressionRecursive(container.origin.right)}`;
    case 'root':
      return formatValueAndName(container);
    case 'sum':
      return container.origin.from.map(formatExpressionRecursive).join(' + ');
    case 'selection':
      return formatValueAndName(container);
    case 'bracketed':
      return `(${formatExpressionRecursive(container.origin.inner)})`;
    case 'if_else':
      return `if(${formatExpressionRecursive(container.origin.condition)}, ${formatExpressionRecursive(container.origin.whenTrue)}, ${formatExpressionRecursive(container.origin.whenFalse)})`;
    default:
      return `Unknown ${container}`;
  }
};

export const formatIntermediates = (container: AnyContainer): string => {
  const intermediates = formatIntermediatesRecursive(container);

  return [formatValueAndName(container)].concat(intermediates).join('\n');
};

const formatIntermediatesRecursive = (container: AnyContainer): string[] => {
  switch (container.origin.kind) {
    case 'binary':
      return formatIntermediatesRecursive(container.origin.left).concat(
        formatIntermediatesRecursive(container.origin.right),
      );
    case 'root':
      return [formatValueAndName(container)];
    case 'sum':
      return container.origin.from.flatMap(formatIntermediatesRecursive);
    case 'selection':
      return [formatValueAndName(container)];
    case 'bracketed':
      return formatIntermediatesRecursive(container.origin.inner);
    case 'if_else':
      return formatIntermediatesRecursive(container.origin.condition)
        .concat(formatIntermediatesRecursive(container.origin.whenTrue))
        .concat(formatIntermediatesRecursive(container.origin.whenFalse));
    default:
      return [`Unknown ${container}`];
  }
};

type NamedValuesNode = {
  lhs?: string;
  rhs?: string;
  name?: string;
  children: NamedValuesNode[];
  depth: number;
};

type FormatOptions = {
  maxDepth?: number;
  focusOn?: string;
  includeChildren?: boolean;
};

const collectExpressions = (
  nodes: NamedValuesNode[],
  formatOptions: FormatOptions = {},
): string[] => {
  const { maxDepth = 2, focusOn, includeChildren = true } = formatOptions;
  return nodes.flatMap((node) => {
    if (node.depth >= maxDepth) {
      return [];
    }
    const focusFound = focusOn && node.name?.startsWith(focusOn);
    const include = (focusOn && focusFound) || includeChildren;
    const children = collectExpressions(node.children, {
      focusOn,
      includeChildren: include,
      maxDepth,
    });
    const indent = '  '.repeat(node.depth);
    const current =
      include && node.lhs
        ? [`${indent}${node.lhs} = ${node.rhs ?? 'rhs'}`]
        : [];
    return current.concat(children);
  });
};

export const formatNamedValues = (
  container: AnyContainer,
  formatOptions: FormatOptions = {},
): string => {
  const { focusOn, includeChildren = true, maxDepth = 2 } = formatOptions;
  const root = formatNamedValuesRecursive(container, 0);
  const expressions = collectExpressions(root, {
    focusOn,
    includeChildren: focusOn ? false : includeChildren,
    maxDepth,
  });

  return expressions.join('\n');
};

const formatNamedValuesRecursive = (
  container: AnyContainer,
  depth: number,
  bracketWrap: boolean = false,
): NamedValuesNode[] => {
  const isNamed = isNamedOrigin(container.meta);
  const lhs = formatValueAndName(container);
  const name = container.meta.name;

  const wrap = bracketWrap ? (s: string) => `(${s})` : (s: string) => s;

  if (isNamed) {
    switch (container.origin.kind) {
      case 'binary': {
        // convert left and right to named values. Left and right may return a list of named containers that also require expansion
        const leftResults = formatNamedValuesRecursive(
          container.origin.left,
          depth + 1,
        );
        const rightResults = formatNamedValuesRecursive(
          container.origin.right,
          depth + 1,
        );
        const children = leftResults.concat(rightResults);
        const op = formatOperator(container.origin.operation);
        return [
          {
            lhs,
            name,
            rhs: wrap(children.map((c) => c.lhs ?? c.rhs).join(` ${op} `)),
            children,
            depth,
          },
        ];
      }
      case 'sum': {
        const children = container.origin.from.flatMap((c) =>
          formatNamedValuesRecursive(c, depth + 1),
        );
        return [
          {
            lhs,
            name,
            rhs: wrap(`sum (${children.map((c) => c.lhs).join(' + ')})`),
            // expression: `${children.map((c) => c.expression).join(' + ')}`,
            children,
            depth,
          },
        ];
      }
      case 'selection':
        return [
          {
            lhs,
            name,
            rhs: 'constant',
            children: [],
            depth,
          },
        ];
      case 'root':
        return [
          {
            lhs,
            name,
            rhs: 'root',
            children: [],
            depth,
          },
        ];
      case 'bracketed': {
        return formatNamedValuesRecursive(container.origin.inner, depth, true);
      }
      case 'if_else': {
        const conditionResults = formatNamedValuesRecursive(
          container.origin.condition,
          depth + 1,
        );
        const trueResults = formatNamedValuesRecursive(
          container.origin.whenTrue,
          depth + 1,
        );
        const falseResults = formatNamedValuesRecursive(
          container.origin.whenFalse,
          depth + 1,
        );
        const children = conditionResults
          .concat(trueResults)
          .concat(falseResults);
        return [
          {
            lhs,
            name,
            rhs: wrap(`if(${children.map((c) => c.lhs ?? c.rhs).join(', ')})`),
            children,
            depth,
          },
        ];
      }
      default:
        return [
          {
            lhs,
            name,
            children: [],
            depth: depth + 1,
          },
        ];
    }
  } else {
    switch (container.origin.kind) {
      case 'binary': {
        const op = formatOperator(container.origin.operation);
        const leftResults = formatNamedValuesRecursive(
          container.origin.left,
          depth,
        );
        const rightResults = formatNamedValuesRecursive(
          container.origin.right,
          depth,
        );
        const children = leftResults.concat(rightResults);
        return [
          {
            lhs: undefined,
            name,
            rhs: wrap(children.map((c) => c.lhs ?? c.rhs).join(` ${op} `)),
            children,
            depth,
          },
        ];
      }
      case 'sum': {
        const children = container.origin.from.flatMap((c) =>
          formatNamedValuesRecursive(c, depth),
        );
        return [
          {
            lhs: undefined,
            name,
            rhs: wrap(
              `sum (${children.map((c) => c.lhs ?? c.rhs).join(' + ')})`,
            ),
            children,
            depth,
          },
        ];
      }
      case 'bracketed': {
        return formatNamedValuesRecursive(container.origin.inner, depth, true);
      }
      case 'if_else': {
        const conditionResults = formatNamedValuesRecursive(
          container.origin.condition,
          depth,
        );
        const trueResults = formatNamedValuesRecursive(
          container.origin.whenTrue,
          depth,
        );
        const falseResults = formatNamedValuesRecursive(
          container.origin.whenFalse,
          depth,
        );
        const children = conditionResults
          .concat(trueResults)
          .concat(falseResults);
        return [
          {
            lhs: undefined,
            name,
            rhs: wrap(`if(${children.map((c) => c.lhs ?? c.rhs).join(', ')})`),
            children,
            depth,
          },
        ];
      }
      case 'root':
        return [
          {
            lhs,
            name,
            rhs: 'root',
            children: [],
            depth,
          },
        ];
    }
    return [];
  }
};
