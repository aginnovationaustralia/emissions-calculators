import type { ObjectEntries } from 'type-fest/source/entries';

/**
 * Type-safe version of Object.entries.
 * @param object The object to get entries from.
 * @returns The entries of the object.
 */
export function entriesFromObject<T extends object>(
  object: T,
): ObjectEntries<T> {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Filling TS gaps
  return Object.entries(object) as ObjectEntries<T>;
}

/**
 * Type-safe version of Object.fromEntries.
 * @param entries The entries to get an object from.
 * @returns The object from the entries.
 */
export function objectFromEntries<T extends object>(
  entries: ObjectEntries<T>,
): T {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Filling TS gaps
  return Object.fromEntries(entries) as T;
}

export const swapObjectKeysAndValues = <
  K extends PropertyKey,
  V extends PropertyKey,
>(
  input: Record<K, V>,
): Record<V, K> =>
  objectFromEntries(
    entriesFromObject(input).map(([key, value]) => [value, key]),
  );

/**
 * Type-safe version of Object.values.
 * @param object The object to get values from.
 * @returns The values of the object.
 */
export function valuesFromObject<T extends object>(
  object: T,
): Array<T[keyof T]> {
  return Object.values(object);
}

/**
 * Type-safe version of Object.keys.
 * @param object The object to get keys from.
 * @returns The keys of the object.
 */
export function keysFromObject<T extends object>(object: T): Array<keyof T> {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Filling TS gaps
  return Object.keys(object) as Array<keyof T>;
}

export type Nullable<T> = { [K in keyof T]: T[K] | null };

export function addAcrossAllKeys<T extends Record<string, number | undefined>>(
  obj1: T,
  obj2: T,
): T {
  return entriesFromObject(obj2).reduce(
    (acc, [k, v]) => ({ ...acc, [k]: (v ?? 0) + (acc[k] ?? 0) }),
    obj1,
  );
}

export function isNumber(value: unknown): boolean {
  return (
    value != null && value !== '' && !Number.isNaN(Number(value.toString()))
  );
}

export function singleAllocationToArray<
  // eslint-disable-next-line no-use-before-define
  T extends { [key in W]?: number | number[] } & object,
  K extends object,
  W extends keyof T,
>(
  objects: T[],
  ref: K[],
  key: W,
  mode: 'average' | 'flat' = 'average',
): (Omit<T, W> & { [key in W]: number[] })[] {
  return (objects ?? []).map((x) => {
    const allocation: number | number[] | undefined = x[key];

    if (isNumber(allocation) && !Array.isArray(allocation)) {
      const allocationValue =
        mode === 'average' ? (allocation ?? 0) / ref.length : allocation;

      return {
        ...x,
        [key]: new Array(ref.length).fill(allocationValue),
      };
    }

    if (!isNumber(allocation) && !Array.isArray(allocation)) {
      return {
        ...x,
        [key]: [],
      };
    }

    return x;
  }) as (Omit<T, W> & { [key in W]: number[] })[];
}
