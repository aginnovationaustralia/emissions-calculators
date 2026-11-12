/*
 * Containers for the emissions calculators, built on @aginnovationaustralia/calculator-units.
 *
 * The calculators use the package's default unit system as is. This module fixes its rules into the
 * `Container` types, adds the calculators' metadata, and keeps the names calculation code already
 * imports from here.
 */
import {
  AnyContainer as UnitsAnyContainer,
  Metadata as UnitsMetadata,
  Container as UnitsContainer,
} from '@aginnovationaustralia/calculator-units';
import {
  DefaultRules,
  defaultUnitSystem,
} from '@aginnovationaustralia/calculator-units/defaults';
import { BooleanUnit } from './units';
import type { QualityTable } from './quality';

declare module '@aginnovationaustralia/calculator-units' {
  interface Metadata {
    /** The data quality of an input, as reported by the user. */
    quality?: QualityTable;
    /** Which module(s) (e.g. '3.1') consume an input. */
    modules?: string[];
  }
}

export {
  br,
  childrenOf,
  max,
  min,
  multiplyAllValuesBy,
  translate,
  type Origin,
} from '@aginnovationaustralia/calculator-units';
export { relabelMass } from '@aginnovationaustralia/calculator-units/defaults';

/** The calculation methods VEERG inputs can be for. */
export type VeergMethod = '1' | '2';

/** The calculators' unit system: the package defaults, with methods 1 and 2 only. */
export const units = defaultUnitSystem.withMethods<VeergMethod>('1', '2');
export type CalculatorRules = DefaultRules;

export const { root, num } = units;

export type Metadata = UnitsMetadata | undefined;

export const isNamedOrigin = (metadata: Metadata) => !!metadata?.name;

/** A value in unit `U`, and how it was calculated. Its inputs are for method 1 or 2. */
export type Container<U> = UnitsContainer<U, CalculatorRules, VeergMethod>;

/** Any VEERG container, seen only as a record of how it was calculated. */
export type AnyContainer = UnitsAnyContainer<VeergMethod>;

// Names from the class based containers these replace. A container is no longer a different type
// for each way it can be made; that is recorded in `origin.kind` instead.
export type NumberContainer<U> = Container<U>;
export type StringContainer<U> = Container<U>;
export type BooleanContainer<U = BooleanUnit> = Container<U>;
export type TypedContainer<U> = Container<U>;
export type MultiContainer<U> = Container<U>;
export type BinaryContainer<U> = Container<U>;
export type SummedContainer<U> = Container<U>;
export type RootContainer<U> = Container<U>;
export type BracketedContainer<U> = Container<U>;
export type ConstantSelectionContainer<U> = Container<U>;
export type TranslationContainer<_TIn, TOut> = Container<TOut>;
