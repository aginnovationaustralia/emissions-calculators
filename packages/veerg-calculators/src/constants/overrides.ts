import { NumberUnitBase } from '@/tools/units';
import { values, ValueStore } from '@/tools/value-store';
import { AllConstants } from './types';

/**
 * A deep partial version of a constants structure, where every unit (e.g. MassPerMass, RealNumber)
 * is replaced by a plain number.
 */
export type DeepConstantOverrides<T> = T extends NumberUnitBase
  ? number
  : T extends object
    ? { [K in keyof T]?: DeepConstantOverrides<T[K]> }
    : T;

/**
 * Overrides for any subset of the constants. Leaf values are plain numbers, and are written directly
 * into the unit's value store, so they must be expressed in the unit's storage units (e.g. J/L
 * rather than GJ/kL, and fractions rather than percentages).
 */
export type ConstantOverrides = DeepConstantOverrides<AllConstants>;

export type ConstantOverridesResult = {
  constants: AllConstants;
  warnings: string[];
};

const isUnit = (value: unknown): value is NumberUnitBase =>
  typeof value === 'object' &&
  value !== null &&
  (value as Partial<NumberUnitBase>).store instanceof ValueStore;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const applyOverride = (
  node: unknown,
  override: unknown,
  path: string[],
  warnings: string[],
): unknown => {
  if (override === undefined) {
    return node;
  }

  const location = path.join('.');

  if (node === undefined) {
    warnings.push(`Override for '${location}' does not match any constant`);
    return node;
  }

  if (isUnit(node)) {
    if (typeof override !== 'number' || !Number.isFinite(override)) {
      warnings.push(
        `Override for '${location}' must be a number, received ${typeof override}`,
      );
      return node;
    }
    return { ...node, store: values(override) };
  }

  if (isPlainObject(node)) {
    if (!isPlainObject(override)) {
      warnings.push(
        `Override for '${location}' must be an object, received ${typeof override}`,
      );
      return node;
    }

    // Copy on write: constant objects are shared module-level values (and some unit instances are
    // reused across several keys), so they must never be mutated.
    let result = node;
    for (const [key, value] of Object.entries(override)) {
      const updated = applyOverride(node[key], value, [...path, key], warnings);
      if (updated !== node[key]) {
        if (result === node) {
          result = { ...node };
        }
        result[key] = updated;
      }
    }
    return result;
  }

  if (typeof override !== typeof node) {
    warnings.push(
      `Override for '${location}' must be a ${typeof node}, received ${typeof override}`,
    );
    return node;
  }

  return override;
};

/**
 * Apply a set of overrides to the constants, returning a new constants object. The original
 * constants are not modified. Any override that does not line up with the shape of the constants
 * is skipped and reported in `warnings`.
 */
export const applyConstantOverrides = (
  constants: AllConstants,
  overrides: ConstantOverrides | undefined,
): ConstantOverridesResult => {
  const warnings: string[] = [];
  const result = applyOverride(constants, overrides, [], warnings);

  return { constants: result as AllConstants, warnings };
};
