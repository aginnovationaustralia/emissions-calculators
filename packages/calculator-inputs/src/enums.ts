import { z } from 'zod';

/** Identifies a list of enum values regardless of their order. */
const valuesKey = (values: readonly string[]) =>
  JSON.stringify([...values].sort());

const makeEnumSchema = <TEnum extends string>(values: readonly TEnum[]) =>
  z.enum(values);

export type EnumSchema<TEnum extends string> = ReturnType<
  typeof makeEnumSchema<TEnum>
>;

/**
 * Gives an inline schema for any list of values, emitted in place rather than as a shared
 * component. Pass it as `enumSchema` when you don't want to name your enums.
 */
export const inlineEnumSchema = <TEnum extends string>(
  values: readonly TEnum[],
): EnumSchema<TEnum> => makeEnumSchema(values);

export type EnumRegistryOptions = {
  /** Appended to the error for unregistered values, e.g. where to register them. */
  unregisteredHint?: string;
};

/**
 * Registers named enums, so each is emitted once as an OpenAPI component (with its name as the id)
 * and referenced everywhere it is used. API client generators then produce a named enum type
 * instead of a plain string.
 *
 * Returns `enumSchema`, which gives the shared schema for a list of values. The values may be in any
 * order but must exactly match a registered enum; anything else throws, which fails a build that
 * generates OpenAPI specs.
 */
export const createEnumRegistry = (
  namedEnums: Record<string, readonly string[]>,
  { unregisteredHint = 'Register them with a name.' }: EnumRegistryOptions = {},
) => {
  const schemasByValues = new Map<string, z.ZodEnum>();
  for (const [id, values] of Object.entries(namedEnums)) {
    const key = valuesKey(values);
    const existing = schemasByValues.get(key);
    if (existing) {
      throw new Error(
        `Enums ${existing.meta()?.id} and ${id} have the same values; register them once`,
      );
    }
    schemasByValues.set(key, makeEnumSchema(values).meta({ id }));
  }

  const enumSchema = <TEnum extends string>(
    values: readonly TEnum[],
  ): EnumSchema<TEnum> => {
    const schema = schemasByValues.get(valuesKey(values));
    if (!schema) {
      throw new Error(
        `Enum values ${JSON.stringify(values)} are not registered. ${unregisteredHint}`,
      );
    }
    return schema as EnumSchema<TEnum>;
  };

  return { enumSchema };
};
