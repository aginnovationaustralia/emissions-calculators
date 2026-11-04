import { object } from '@/types/schemas';
import { z } from 'zod';
import { BaseContainer, InputLike, Metadata } from '../containers';
import { mapOptional } from '../zod';
import { AnyNumberUnit, AnyUnit } from './units';

/**
 * The calculation methods an input can contribute to. A calculator narrows this to the methods it
 * supports (VEERG uses '1' and '2'). Units only hold a method 1 and a method 2 value, so the value
 * of an input for any method above 1 is stored as the method 2 value.
 */
export type GenericMethod = '1' | '2' | '3' | '4';

/**
 * An input container with the fields every calculator needs. A calculator can extend this with its
 * own fields (VEERG's is `InputContainer` in inputs.ts); the extra fields are kept by `switchUnit`.
 */
export class GenericInputContainer<
  U extends AnyUnit,
  M extends GenericMethod = GenericMethod,
> extends BaseContainer<U> {
  originType: 'input';
  method: M;

  constructor(unit: U, method: M, baseOrigin?: Metadata) {
    super(unit, baseOrigin);
    this.originType = 'input';
    this.method = method;
  }

  switchUnit<V extends AnyNumberUnit>(
    converter: (from: NoInfer<U>) => V,
  ): GenericInputContainer<V, M> {
    const clone = this.clone() as unknown as GenericInputContainer<V, M>;
    clone.unit = converter(this.unit);
    return clone;
  }
}

/** The options every input builder accepts. */
export type GenericInputOptions<M extends GenericMethod = GenericMethod> = {
  name: string;
  method?: M;
};

/** The fields read from the options and the parsed value, for building an input container. */
export type GenericInputFields<M extends GenericMethod> = {
  name: string;
  method: M;
};

/**
 * Builds a calculator's input container from a parsed unit value. Pass one to the generic input
 * builders to produce your own input container class, with your own extra fields.
 */
export type InputBuilder<
  U extends AnyUnit,
  M extends GenericMethod,
  C extends InputLike<U>,
  X = object,
> = (unit: U, fields: GenericInputFields<M>, extra: X) => C;

const buildGenericInput = <U extends AnyUnit, M extends GenericMethod>(
  unit: U,
  { name, method }: GenericInputFields<M>,
): GenericInputContainer<U, M> =>
  new GenericInputContainer(unit, method, { name });

// NOTE: When no builder is passed, C keeps its default of GenericInputContainer. Only supplying C
// explicitly without a matching builder could make the cast below unsound.
const builderOrDefault = <
  U extends AnyUnit,
  M extends GenericMethod,
  C extends InputLike<U>,
  X,
>(
  build: InputBuilder<U, M, C, X> | undefined,
) => build ?? (buildGenericInput as unknown as InputBuilder<U, M, C, X>);

const methodOf = <M extends GenericMethod>(options: GenericInputOptions<M>) =>
  options.method ?? ('1' as M);

/** How an input's schema is described to API users. */
export type SchemaOptions = {
  /** OpenAPI metadata for the input, such as its description. */
  meta?: z.GlobalMeta;
};

const withMeta = <S extends z.ZodType>(schema: S, meta?: z.GlobalMeta): S =>
  meta === undefined ? schema : schema.meta(meta);

/** Builds an input container from a parsed value that is used as the unit as is. */
const toValueInputContainer =
  <U extends AnyUnit, M extends GenericMethod, C extends InputLike<U>>(
    options: GenericInputOptions<M>,
    build: InputBuilder<U, M, C>,
  ) =>
  (value: U): C =>
    build(value, { name: options.name, method: methodOf(options) }, {});

// -------- Numbers -----------------

/**
 * Extra fields a calculator adds to the object of its number inputs, alongside `value`. Their
 * parsed values are passed to the input builder.
 */
export type NumberInputExtension = z.core.$ZodLooseShape;

// NOTE: `value` is part of the object shape, rather than intersected with it, because Zod infers an
// object with an empty shape as `Record<string, never>`, which no `{ value }` would satisfy.
type NumberInputShape<E extends NumberInputExtension> = {
  value: z.ZodNumber;
} & E;

/** Wire form for number inputs: always an object, with any extra fields alongside `value`. */
export type GenericNumberInputValue<E extends NumberInputExtension = object> =
  z.input<z.ZodObject<NumberInputShape<E>, z.core.$strict>>;

/** The parsed values of the extra fields of a number input. */
export type NumberInputExtra<E extends NumberInputExtension> = Omit<
  z.output<z.ZodObject<NumberInputShape<E>, z.core.$strict>>,
  'value'
>;

/** Parsed number input. */
export type GenericParsedNumberInput<E extends NumberInputExtension = object> =
  { value: number } & NumberInputExtra<E>;

export type NumberSchemaTweaker = (schema: z.ZodNumber) => z.ZodNumber;

// Stable, description-free schemas so zod-openapi can emit shared $refs.

const NumberInputSchema = z.number().meta({ id: 'NumberInput' });

const NonNegativeNumberInputSchema = z
  .number()
  .min(0)
  .meta({ id: 'NonNegativeNumberInput' });

const ProportionNumberInputSchema = z
  .number()
  .min(0)
  .max(1)
  .meta({ id: 'ProportionNumberInput' });

const PercentageNumberInputSchema = z
  .number()
  .min(0)
  .max(100)
  .meta({ id: 'PercentageNumberInput' });

const PositiveNumberInputSchema = z
  .number()
  .gt(0)
  .meta({ id: 'PositiveNumberInput' });

const MinOneNumberInputSchema = z
  .number()
  .min(1)
  .meta({ id: 'MinOneNumberInput' });

/** Fingerprint a number schema's JSON Schema constraints (ignoring $schema). */
const numberConstraintKey = (schema: z.ZodNumber): string => {
  const json = z.toJSONSchema(schema) as Record<string, unknown>;
  const { $schema: _schema, ...rest } = json;
  return JSON.stringify(rest);
};

type NumberInputObjectSchema<E extends NumberInputExtension> = z.ZodType<
  GenericParsedNumberInput<E>,
  GenericNumberInputValue<E>
>;

type NumberValueSchema = z.ZodType<number, number>;

/* Create a map of number input schemas by constraint key. This lets the user define rules with zod syntax,
 * and for most scenarios we will match it to a stable schema snippet. This allows a clean OpenAPI file to be generated
 */
const numberInputByConstraint = new Map<string, NumberValueSchema>([
  [numberConstraintKey(z.number()), NumberInputSchema],
  [numberConstraintKey(z.number().min(0)), NonNegativeNumberInputSchema],
  [numberConstraintKey(z.number().min(0).max(1)), ProportionNumberInputSchema],
  [
    numberConstraintKey(z.number().min(0).max(100)),
    PercentageNumberInputSchema,
  ],
  [numberConstraintKey(z.number().gt(0)), PositiveNumberInputSchema],
  [numberConstraintKey(z.number().min(1)), MinOneNumberInputSchema],
]);

/** How the value of a number input is validated and described. */
export type NumberSchemaOptions<E extends NumberInputExtension = object> =
  SchemaOptions & {
    schemaTweaker?: NumberSchemaTweaker;
    /** The units of the value, described to API users as `x-units`. */
    displayUnit?: string;
    /** Extra fields of the input object, alongside `value`. */
    extend?: E;
  };

const resolveNumberInputSchema = <E extends NumberInputExtension>({
  schemaTweaker,
  displayUnit,
  extend,
}: NumberSchemaOptions<E>): NumberInputObjectSchema<E> => {
  const valueSchema = schemaTweaker ? schemaTweaker(z.number()) : z.number();

  const known = numberInputByConstraint.get(numberConstraintKey(valueSchema));
  const baseSchema = known ?? valueSchema;
  const schema = object({
    value: baseSchema,
    ...extend,
  }) as unknown as NumberInputObjectSchema<E>;
  return displayUnit === undefined
    ? schema
    : schema.meta({ 'x-units': displayUnit });
};

const toNumberInputContainer =
  <
    U extends AnyNumberUnit,
    M extends GenericMethod,
    E extends NumberInputExtension,
    C extends InputLike<U>,
  >(
    unitFactory: (value: number) => U,
    options: GenericInputOptions<M>,
    build: InputBuilder<U, M, C, NumberInputExtra<E>>,
  ) =>
  ({ value, ...extra }: GenericParsedNumberInput<E>): C => {
    const unit = unitFactory(value);
    const method = methodOf(options);
    if (method !== '1') {
      unit.store.applyMethod2();
    }
    return build(
      unit,
      { name: options.name, method },
      extra as NumberInputExtra<E>,
    );
  };

export type GenericNumberInputSchema<
  C,
  E extends NumberInputExtension = object,
> = z.ZodPipe<
  NumberInputObjectSchema<E>,
  z.ZodTransform<C, GenericParsedNumberInput<E>>
>;

export type GenericNumberInputSchemaOptional<
  C,
  E extends NumberInputExtension = object,
> = z.ZodPipe<
  z.ZodOptional<NumberInputObjectSchema<E>>,
  z.ZodTransform<C | undefined, GenericParsedNumberInput<E> | undefined>
>;

/**
 * Zod schema accepting `{ value }`, plus any extra fields in `schema.extend`, and returning an
 * input container.
 */
export const genericNumberInput = <
  U extends AnyNumberUnit,
  M extends GenericMethod = GenericMethod,
  E extends NumberInputExtension = object,
  C extends InputLike<U> = GenericInputContainer<U, M>,
>(
  unitFactory: (value: number) => U,
  options: GenericInputOptions<M>,
  schema: NumberSchemaOptions<E> = {},
  build?: InputBuilder<U, M, C, NumberInputExtra<E>>,
): GenericNumberInputSchema<C, E> =>
  withMeta(
    resolveNumberInputSchema(schema).transform(
      toNumberInputContainer(unitFactory, options, builderOrDefault(build)),
    ),
    schema.meta,
  );

/** Optional number input schema, as for `genericNumberInput`. */
export const genericNumberInputOptional = <
  U extends AnyNumberUnit,
  M extends GenericMethod = GenericMethod,
  E extends NumberInputExtension = object,
  C extends InputLike<U> = GenericInputContainer<U, M>,
>(
  unitFactory: (value: number) => U,
  options: GenericInputOptions<M>,
  schema: NumberSchemaOptions<E> = {},
  build?: InputBuilder<U, M, C, NumberInputExtra<E>>,
): GenericNumberInputSchemaOptional<C, E> =>
  withMeta(
    resolveNumberInputSchema(schema)
      .optional()
      .transform(
        mapOptional(
          toNumberInputContainer(unitFactory, options, builderOrDefault(build)),
        ),
      ),
    schema.meta,
  );

// -------- Enums -----------------

// Every enum used in an input schema must be registered with a name. Each is tagged with that name
// as its id, so zod-openapi emits it once under components/schemas and references it with a $ref.
// API client generators then produce a named enum type instead of a plain string. Building a schema
// from an unregistered list of values throws, which fails when the OpenAPI specs are generated.

/** Identifies a list of enum values regardless of their order. */
const valuesKey = (values: readonly string[]) =>
  JSON.stringify([...values].sort());

// NOTE: Named with Zod's own `ToEnum`, rather than inferred from `z.enum`, so the emitted declaration
// stays assignable from a consumer's `z.enum(values)` when TEnum is generic.
/** The Zod schema for an enum of the given values. */
export type EnumSchema<TEnum extends string> = z.ZodEnum<
  z.core.util.ToEnum<TEnum>
>;

const makeEnumSchema = <TEnum extends string>(
  values: readonly TEnum[],
): EnumSchema<TEnum> => z.enum(values);

/** Looks up the shared Zod schema for a registered enum. */
export type EnumSchemas = <TEnum extends string>(
  values: readonly TEnum[],
) => EnumSchema<TEnum>;

/**
 * Registers a calculator's named enums, and returns a lookup of the shared Zod schema for each.
 * The values passed to the lookup may be in any order, but must exactly match a registered enum.
 * @param namedEnums the enum values, keyed by the name used as their OpenAPI component id
 * @param registeredIn where the enums are registered, to point to in the error for a missing enum
 */
export const createEnumSchemas = (
  namedEnums: Record<string, readonly string[]>,
  registeredIn: string,
): EnumSchemas => {
  const enumSchemasByValues = new Map<string, z.ZodEnum>();
  for (const [id, values] of Object.entries(namedEnums)) {
    const key = valuesKey(values);
    const existing = enumSchemasByValues.get(key);
    if (existing) {
      throw new Error(
        `Enums ${existing.meta()?.id} and ${id} have the same values; register them once`,
      );
    }
    enumSchemasByValues.set(key, makeEnumSchema(values).meta({ id }));
  }

  return <TEnum extends string>(values: readonly TEnum[]) => {
    const schema = enumSchemasByValues.get(valuesKey(values));
    if (!schema) {
      throw new Error(
        `Enum values ${JSON.stringify(values)} are not registered. Add them with a name in ${registeredIn}`,
      );
    }
    return schema as EnumSchema<TEnum>;
  };
};

/**
 * Zod schema accepting one of a registered enum's values and returning an input container.
 * @param enumSchemas the calculator's registered enums, from `createEnumSchemas`
 */
export const genericEnumInput = <
  TEnum extends string,
  M extends GenericMethod = GenericMethod,
  C extends InputLike<TEnum> = GenericInputContainer<TEnum, M>,
>(
  enumSchemas: EnumSchemas,
  values: readonly TEnum[],
  options: GenericInputOptions<M>,
  schema: SchemaOptions = {},
  build?: InputBuilder<TEnum, M, C>,
) =>
  withMeta(enumSchemas(values), schema.meta).transform(
    toValueInputContainer(options, builderOrDefault(build)),
  );

/** Optional registered enum input schema. */
export const genericEnumInputOptional = <
  TEnum extends string,
  M extends GenericMethod = GenericMethod,
  C extends InputLike<TEnum> = GenericInputContainer<TEnum, M>,
>(
  enumSchemas: EnumSchemas,
  values: readonly TEnum[],
  options: GenericInputOptions<M>,
  schema: SchemaOptions = {},
  build?: InputBuilder<TEnum, M, C>,
) =>
  withMeta(enumSchemas(values).optional(), schema.meta).transform(
    mapOptional(toValueInputContainer(options, builderOrDefault(build))),
  );

/**
 * Zod schema accepting only a single value, typically used to select a variant, and returning an
 * input container. It is emitted inline as a single-value enum, so it does not need to be
 * registered.
 */
export const genericLiteralInput = <
  TValue extends string,
  M extends GenericMethod = GenericMethod,
  C extends InputLike<TValue> = GenericInputContainer<TValue, M>,
>(
  value: TValue,
  options: GenericInputOptions<M>,
  schema: SchemaOptions = {},
  build?: InputBuilder<TValue, M, C>,
) =>
  withMeta(z.enum([value]), schema.meta).transform(
    toValueInputContainer(options, builderOrDefault(build)),
  );

// -------- Booleans -----------------

/** Zod schema accepting a boolean and returning an input container. */
export const genericBooleanInput = <
  M extends GenericMethod = GenericMethod,
  C extends InputLike<boolean> = GenericInputContainer<boolean, M>,
>(
  options: GenericInputOptions<M>,
  schema: SchemaOptions = {},
  build?: InputBuilder<boolean, M, C>,
) =>
  withMeta(z.boolean(), schema.meta).transform(
    toValueInputContainer(options, builderOrDefault(build)),
  );

/** Optional boolean input schema. */
export const genericBooleanInputOptional = <
  M extends GenericMethod = GenericMethod,
  C extends InputLike<boolean> = GenericInputContainer<boolean, M>,
>(
  options: GenericInputOptions<M>,
  schema: SchemaOptions = {},
  build?: InputBuilder<boolean, M, C>,
) =>
  withMeta(z.boolean().optional(), schema.meta).transform(
    mapOptional(toValueInputContainer(options, builderOrDefault(build))),
  );
