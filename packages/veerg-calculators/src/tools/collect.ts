import { isNumberUnit } from '@aginnovationaustralia/calculator-units';
import { AnyContainer } from './containers';
import { formatUnit } from './format';
import { QualityTable } from './quality';
import { isBooleanUnit, isStringUnit, NumberUnit } from './units';

export type ConstantDefinition = {
  name: string;
  value: number;
  units: string;
};

export type InputDefinition = {
  name: string;
  value: number | string | boolean;
  method: '1' | '2';
  modules: string[];
  quality: QualityTable | undefined;
};

export type IntermediateDefinition = {
  name: string;
  value: number | string | boolean;
};

type CollectVisitor<T> = (container: AnyContainer | undefined) => T[];

/**
 * Walks the children of a container with a consistent shape for every
 * `origin.kind`. Callers collect from the current node, then append
 * `traverseContainerChildren(container, collectFn)`.
 */
const traverseContainerChildren = <T>(
  container: AnyContainer,
  visit: CollectVisitor<T>,
): T[] => {
  const origin = container.origin;
  switch (origin.kind) {
    case 'binary':
      return visit(origin.left).concat(visit(origin.right));
    case 'bracketed':
      return visit(origin.inner);
    case 'selection':
      return origin.selectors
        .filter((s): s is AnyContainer => typeof s !== 'string')
        .flatMap(visit);
    case 'input':
    case 'root':
      return [];
    case 'method1and2':
      return visit(origin.method2 ?? origin.method1);
    case 'method2':
      return visit(origin.method2);
    case 'sum':
      return origin.from.flatMap(visit);
    case 'translation':
      return visit(origin.from);
    case 'switch':
      return visit(origin.subject).concat(visit(origin.selected));
    case 'if_else':
      return visit(origin.condition).concat(visit(origin.selected));
  }
};

export const collectReferences = <O extends AnyContainer>(
  container: O | undefined,
): string[] => {
  if (container === undefined) {
    return [];
  }
  const local = container.meta.references ?? [];
  return local.concat(traverseContainerChildren(container, collectReferences));
};

export const collectConstants = <O extends AnyContainer>(
  origin: O | undefined,
): ConstantDefinition[] => {
  if (origin === undefined) {
    return [];
  }
  const local: ConstantDefinition[] =
    origin.origin.kind === 'selection' && isNumberUnit(origin.unit)
      ? [
          {
            name: origin.meta.name ?? 'Unknown constant',
            value: origin.unit.store.toNumber(),
            units: formatUnit(origin.unit as NumberUnit),
          },
        ]
      : [];
  return local.concat(traverseContainerChildren(origin, collectConstants));
};

export const collectInputs = <O extends AnyContainer>(
  origin: O | undefined,
): InputDefinition[] => {
  if (origin === undefined) {
    return [];
  }
  const local: InputDefinition[] =
    origin.origin.kind === 'input'
      ? [
          {
            name: origin.meta.name ?? 'Unknown input',
            value: isStringUnit(origin.unit)
              ? origin.unit
              : isBooleanUnit(origin.unit)
                ? origin.unit
                : origin.unit.store.toNumber(),
            method: origin.origin.method,
            modules: origin.meta.modules ?? [],
            quality: origin.meta.quality,
          },
        ]
      : [];
  return local.concat(traverseContainerChildren(origin, collectInputs));
};

/**
 * Collects the containers marked `intermediate` in a calculation tree. Each container is
 * visited once, so a container reached by two paths is not reported twice (intermediates
 * with the same name are summed into one value, see `sumByName`).
 */
export const collectIntermediates = <O extends AnyContainer>(
  origin: O | undefined,
): IntermediateDefinition[] => {
  const seen = new Set<AnyContainer>();
  const visit = (container: AnyContainer | undefined): IntermediateDefinition[] => {
    if (container === undefined || seen.has(container)) {
      return [];
    }
    seen.add(container);
    const local: IntermediateDefinition[] =
      container.meta.intermediate === true
        ? [
            {
              name: container.meta.name ?? 'Unknown intermediate',
              value: isStringUnit(container.unit)
                ? container.unit
                : isBooleanUnit(container.unit)
                  ? container.unit
                  : container.unit.store.toNumber(),
            },
          ]
        : [];
    return local.concat(traverseContainerChildren(container, visit));
  };
  return visit(origin);
};
