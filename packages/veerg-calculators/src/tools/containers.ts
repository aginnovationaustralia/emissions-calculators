/*
 * Containers for the emissions calculators, built on @aginnovationaustralia/calculator-units.
 *
 * The calculators use the package's default unit system as is. This module fixes its rules into the
 * `Container` types, adds the calculators' metadata, and keeps the names calculation code already
 * imports from here.
 */
import {
  AnyContainer as UnitsAnyContainer,
  Container as UnitsContainer,
  Metadata as UnitsMetadata,
  UnitSystem,
} from '@aginnovationaustralia/calculator-units';
import {
  DefaultRules,
  defaultUnitSystem,
  KnownPackageNumberUnit,
  KnownPackageUnit,
} from '@aginnovationaustralia/calculator-units/defaults';
import type { QualityTable } from './quality';
import { BooleanUnit } from './units';

declare module '@aginnovationaustralia/calculator-units' {
  interface Metadata {
    /** The data quality of an input, as reported by the user. */
    quality?: QualityTable;
    /** Which module(s) (e.g. '3.1') consume an input. */
    modules?: string[];
    /** Is this a significant intermediate value? Should it be attached ot the final output? */
    intermediate?: boolean;
  }
}

export {
  br,
  childrenOf,
  max,
  min,
  translate,
  type Origin,
} from '@aginnovationaustralia/calculator-units';
export { relabelMass } from '@aginnovationaustralia/calculator-units/defaults';

/** The calculation methods VEERG inputs can be for. */
export type VeergMethod = '1' | '2';

/**
 * The units a VEERG container can hold. The calculators have no units of their own, so these are
 * exactly the units the package knows, and the package can format all of them.
 */
export type VeergUnit = KnownPackageUnit;

/** The package's default rules, with containers limited to the package's number units. */
export interface CalculatorRules extends DefaultRules {
  numberUnits: KnownPackageNumberUnit;
}

/** The calculators' unit system: the package defaults, with methods 1 and 2 and VEERG units only. */
export const units: UnitSystem<CalculatorRules, VeergMethod> = defaultUnitSystem
  .withMethods<VeergMethod>('1', '2')
  .withNumberUnits<KnownPackageNumberUnit>();

export const { root, num } = units;

export type Metadata = UnitsMetadata | undefined;

export const isNamedOrigin = (metadata: Metadata) => !!metadata?.name;

/** A value in unit `U`, and how it was calculated. Its inputs are for method 1 or 2. */
export type Container<U extends VeergUnit> = UnitsContainer<
  U,
  CalculatorRules,
  VeergMethod
>;

/**
 * A union of containers, one for each member of `U`: `ContainerOf<'a' | 'b'>` is
 * `Container<'a'> | Container<'b'>`. Unlike `Container<'a' | 'b'>`, type guards on it narrow in
 * their false branch too, so a chain of guards can be checked as exhaustive.
 */
export type ContainerOf<U extends VeergUnit> = U extends unknown
  ? Container<U>
  : never;

/** Any VEERG container, seen only as a record of how it was calculated. */
export type AnyContainer = UnitsAnyContainer<VeergMethod, VeergUnit>;

// Names from the class based containers these replace. A container is no longer a different type
// for each way it can be made; that is recorded in `origin.kind` instead.
export type NumberContainer<U extends VeergUnit> = Container<U>;
export type StringContainer<U extends VeergUnit> = Container<U>;
export type BooleanContainer<U extends VeergUnit = BooleanUnit> = Container<U>;
export type TypedContainer<U extends VeergUnit> = Container<U>;
export type MultiContainer<U extends VeergUnit> = Container<U>;
export type BinaryContainer<U extends VeergUnit> = Container<U>;
export type SummedContainer<U extends VeergUnit> = Container<U>;
export type RootContainer<U extends VeergUnit> = Container<U>;
export type BracketedContainer<U extends VeergUnit> = Container<U>;
export type ConstantSelectionContainer<U extends VeergUnit> = Container<U>;
export type TranslationContainer<
  _TIn,
  TOut extends VeergUnit,
> = Container<TOut>;
