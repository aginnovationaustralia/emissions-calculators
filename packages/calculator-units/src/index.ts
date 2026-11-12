import DecimalClass from 'decimal.js-light';

export {
  childrenOf,
  type AnyContainer,
  type BinaryOperation,
  type Container,
  type Method,
  type Origin,
  type RuleSet,
} from './container.js';
export * from './combinators.js';
export * from './errors.js';
export type { Metadata } from './metadata.js';
export * from './rules.js';
export * from './substances.js';
export * from './system.js';
export * from './units.js';
export * from './value-store.js';

/**
 * The Decimal class values are stored with. Build initial values with this export rather than your
 * own copy of decimal.js-light: a Decimal from another copy is rejected when it is stored.
 *
 * Declared as a const (not `export { default as Decimal }`) so Node can detect it as a named export
 * of the CommonJS build.
 */
export const Decimal = DecimalClass;
export type Decimal = DecimalClass;
