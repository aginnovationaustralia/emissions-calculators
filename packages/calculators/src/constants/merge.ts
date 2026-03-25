import { NumberUnitBase } from '@/tools/units';
import Decimal from 'decimal.js-light';
import { PartialDeep } from 'type-fest';
import { ReplaceNumberUnits } from './types';

/** Returns the number at the given path in a partial numbers tree, or undefined if missing. */
function valueAtPath(
  obj: object | null | undefined,
  path: string[],
): number | undefined {
  if (path.length === 0) return undefined;
  if (obj == null || typeof obj !== 'object') return undefined;
  const sub = (obj as Record<string, unknown>)[path[0]];
  if (typeof sub === 'number') return sub;
  return valueAtPath(sub as object, path.slice(1));
}

/** First override that has a number at path wins; otherwise undefined. */
function firstOverrideAtPath(
  overrides: object[],
  path: string[],
): number | undefined {
  for (const o of overrides) {
    const n = valueAtPath(o, path);
    if (n !== undefined) return n;
  }
  return undefined;
}

/** Runtime check: value is a NumberUnitBase-like leaf (has .value). */
function isNumberUnitLeaf(
  val: unknown,
): val is NumberUnitBase & Record<string, unknown> {
  return (
    val != null &&
    typeof val === 'object' &&
    !Array.isArray(val) &&
    'value' in (val as object)
  );
}

/**
 * Recursively merge overrides into defaults. Traverses the shape of T; at each
 * NumberUnitBase leaf, uses the first override that provides a number at that
 * path to set the unit's value (as a new Decimal), otherwise keeps the default value.
 * Returns a new object of type T.
 */
export const mergeConstants = <
  T extends object,
  U extends PartialDeep<ReplaceNumberUnits<T>>,
>(
  defaults: T,
  overrides: U[],
): T => {
  function merge(def: unknown, path: string[]): unknown {
    if (isNumberUnitLeaf(def)) {
      const overrideNum = firstOverrideAtPath(overrides as object[], path);
      const value =
        overrideNum !== undefined
          ? new Decimal(overrideNum)
          : (def as NumberUnitBase).value;
      return { ...(def as object), value } as T;
    }
    if (def != null && typeof def === 'object' && !Array.isArray(def)) {
      const result: Record<string, unknown> = {};
      for (const key of Object.keys(def as object)) {
        (result as Record<string, unknown>)[key] = merge(
          (def as Record<string, unknown>)[key],
          path.concat(key),
        );
      }
      return result as T;
    }
    return def;
  }
  return merge(defaults, []) as T;
};
