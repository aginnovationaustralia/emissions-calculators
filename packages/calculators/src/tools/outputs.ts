import Decimal from 'decimal.js-light';
import { HasMetadata, ValueMetadata } from './metadata';
import { Container } from './origins';
import { AnyUnit, formatUnit, isVoid, mass, Mass, VoidUnit } from './units';

export const makeUnique = <T>(a: T[]): T[] => {
  return [...new Set(a)];
};
export const makeUniqueByName = <T extends { name: string }>(a: T[]): T[] => {
  return a.filter((v, i, s) => s.findIndex((t) => t.name === v.name) === i);
};

export type ConstantDefinition = {
  name: string;
  value: number;
};

type HasDecimalValue = {
  value: Decimal;
};

const convertToCO2e = (
  gasAmountKg: Decimal,
  gas: 'CO2' | 'CH4' | 'N2O' | 'CO2e',
) => {
  if (gas === 'CH4') {
    return gasAmountKg.mul(new Decimal(28));
  } else if (gas === 'N2O') {
    return gasAmountKg.mul(new Decimal(265));
  }
  return gasAmountKg;
};

export interface Output<
  Scope extends 1 | 2 | 3,
  S extends 'CO2' | 'CH4' | 'N2O' | 'CO2e' = 'CO2' | 'CH4' | 'N2O' | 'CO2e',
>
  extends HasMetadata, HasDecimalValue {
  amountCO2e: Decimal;
  name: string;
  unit: Mass<S>;
  scope: Scope;
  from: Container<Mass<S> | VoidUnit>;
  valueType: 'output';
  originType: 'unary';
  references: string[];
  constants: ConstantDefinition[];
}

export const output = <
  Scope extends 1 | 2 | 3,
  S extends 'CO2' | 'CH4' | 'N2O' | 'CO2e',
>(
  name: string,
  scope: Scope,
  from: Container<Mass<S> | VoidUnit>,
  metadata?: ValueMetadata,
): Output<Scope, S> => {
  const gasAmountKg = isVoid(from.unit) ? new Decimal(0) : from.unit.value;
  const gas = isVoid(from.unit) ? ('CO2' as S) : from.unit.substance;
  const amountCO2e = convertToCO2e(gasAmountKg, gas);
  return {
    valueType: 'output',
    originType: 'unary',
    name,
    scope,
    value: gasAmountKg,
    amountCO2e,
    from,
    metadata,
    unit: mass(gas),
    references: makeUnique(collectReferences(from)),
    constants: makeUniqueByName(collectConstants(from)),
  };
};

export const scope23Output = <Scope extends 2 | 3, S extends 'CO2' | 'CO2e'>(
  name: string,
  scope: Scope,
  from: Container<Mass<S> | VoidUnit>,
  metadata?: ValueMetadata,
): Output<Scope, S> => output(name, scope, from, metadata);

export interface Scope1Output<
  S extends 'CO2' | 'CH4' | 'N2O' | 'CO2e',
> extends Output<1, S> {
  gas: S;
}
export const scope1Output = <S extends 'CO2' | 'CH4' | 'N2O' | 'CO2e'>(
  name: string,
  from: Container<Mass<S> | VoidUnit>,
): Scope1Output<S> => {
  const gas: S = isVoid(from.unit) ? ('CO2' as S) : from.unit.substance;
  return {
    ...output(name, 1, from),
    gas,
  };
};

export const collectReferences = <O extends Container<AnyUnit>>(
  container: O,
): string[] => {
  const baseResults =
    container.core.valueType === 'intermediate'
      ? []
      : (container.core.references ?? []);
  switch (container.originType) {
    case 'unary':
      return baseResults.concat(collectReferences(container.from));
    case 'binary':
      return baseResults.concat(
        collectReferences(container.left),
        collectReferences(container.right),
      );
    case 'root':
      return baseResults;
    case 'sum':
      return baseResults.concat(container.from.flatMap(collectReferences));
    case 'constant_selection':
      return baseResults.concat(
        container.selectors
          .filter((s) => typeof s !== 'string')
          .flatMap(collectReferences),
      );
  }
};

export const collectConstants = <O extends Container<AnyUnit>>(
  origin: O,
): ConstantDefinition[] => {
  const constants: ConstantDefinition[] = [];
  if (origin.originType === 'constant_selection') {
    const currentConstant = {
      name: origin.core.name,
      value: origin.unit.value.toNumber(),
      units: formatUnit(origin.unit),
    };
    constants.push(currentConstant);
  }
  switch (origin.originType) {
    case 'unary':
      return collectConstants(origin.from);
    case 'binary':
      return collectConstants(origin.left).concat(
        collectConstants(origin.right),
      );
    case 'root':
      return [];
    case 'sum':
      return origin.from.flatMap(collectConstants);
    case 'constant_selection':
      return constants.concat(
        origin.selectors
          .filter((s) => typeof s !== 'string')
          .flatMap(collectConstants),
      );
  }
};
