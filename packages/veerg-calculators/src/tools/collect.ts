import { Container } from './containers';
import { formatUnit } from './format';
import { QualityTable } from './quality';
import { AnyUnit, isBooleanUnit, isStringUnit } from './units';

export type ConstantDefinition = {
  name: string;
  value: number;
  units: string;
};

type CollectVisitor<T> = (container: Container<AnyUnit> | undefined) => T[];

/**
 * Walks the children of a container with a consistent shape for every
 * `originType`. Callers collect from the current node, then append
 * `traverseContainerChildren(container, collectFn)`.
 */
const traverseContainerChildren = <T>(
  container: Container<AnyUnit>,
  visit: CollectVisitor<T>,
): T[] => {
  switch (container.originType) {
    case 'binary':
      return visit(container.left).concat(visit(container.right));
    case 'bracketed':
      return visit(container.inner);
    case 'constant_selection':
      return container.selectors
        .filter((s) => typeof s !== 'string')
        .flatMap(visit);
    case 'input':
    case 'root':
      return [];
    case 'method1and2':
      return visit(container.method2 ?? container.method1);
    case 'method2':
      return visit(container.method2);
    case 'sum':
      return container.from.flatMap(visit);
    case 'translation':
      return visit(container.from);
    case 'switch':
      return visit(container.subject).concat(visit(container.selected));
    case 'if_else':
      return visit(container.condition).concat(visit(container.selected));
  }
};

export const collectReferences = <O extends Container<AnyUnit>>(
  container: O | undefined,
): string[] => {
  if (container === undefined) {
    return [];
  }
  const local = container.core?.references ?? [];
  return local.concat(traverseContainerChildren(container, collectReferences));
};

export const collectConstants = <O extends Container<AnyUnit>>(
  origin: O | undefined,
): ConstantDefinition[] => {
  if (origin === undefined) {
    return [];
  }
  const local: ConstantDefinition[] =
    origin.originType === 'constant_selection'
      ? [
          {
            name: origin.core.name,
            value: origin.unit.store.toNumber(),
            units: formatUnit(origin.unit),
          },
        ]
      : [];
  return local.concat(traverseContainerChildren(origin, collectConstants));
};

export type InputDefinition = {
  name: string;
  value: number | string | boolean;
  method: '1' | '2';
  modules: string[];
  quality: QualityTable | undefined;
};

export const collectInputs = <O extends Container<AnyUnit>>(
  origin: O | undefined,
): InputDefinition[] => {
  if (origin === undefined) {
    return [];
  }
  const local: InputDefinition[] =
    origin.originType === 'input'
      ? [
          {
            name: origin.core?.name ?? 'Unknown input',
            value: isStringUnit(origin.unit)
              ? origin.unit
              : isBooleanUnit(origin.unit)
                ? origin.unit
                : origin.unit.store.toNumber(),
            method: origin.method,
            modules: origin.modules,
            quality: origin.core?.quality,
          },
        ]
      : [];
  return local.concat(traverseContainerChildren(origin, collectInputs));
};
