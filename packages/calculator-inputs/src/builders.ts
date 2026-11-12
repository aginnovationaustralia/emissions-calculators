import type {
  Container,
  Metadata,
  Method,
  NumberUnit,
  RuleSet,
  UnitSystem,
} from '@aginnovationaustralia/calculator-units';
import { z } from 'zod';
import type { EnumSchema } from './enums.js';
import { NumberSchemaTweaker, resolveNumberSchema } from './numbers.js';
import { mapOptional } from './optional.js';

/** Options every input takes. Consumers add their own with the `O` type parameter. */
export type BaseInputOptions<M extends Method = Method> = {
  /** The input's name, recorded on its container. */
  name: string;
  /** Describes the input in the API documentation. */
  description: string;
  /**
   * Which calculation method the value is for, '1' to '4'. Defaults to method 1. Narrow it in your
   * own options type if your domain has fewer methods.
   */
  method?: M;
};

export type InputOptions<O, M extends Method = Method> = BaseInputOptions<M> &
  O;

/*
 * The consumer's extra fields beside `value`. zod types an object with no fields as
 * `Record<string, never>`, which would make `value` never, so no fields adds nothing.
 */
type FieldsInput<F extends z.ZodRawShape> = [keyof F] extends [never]
  ? unknown
  : z.input<z.ZodObject<F>>;
type FieldsOutput<F extends z.ZodRawShape> = [keyof F] extends [never]
  ? unknown
  : z.output<z.ZodObject<F>>;

/** The wire form of a number input: `{ value }` plus the consumer's extra fields. */
type NumberWireInput<F extends z.ZodRawShape> = {
  value: number;
} & FieldsInput<F>;
type NumberWireOutput<F extends z.ZodRawShape> = {
  value: number;
} & FieldsOutput<F>;
export type NumberWireSchema<F extends z.ZodRawShape> = z.ZodType<
  NumberWireOutput<F>,
  NumberWireInput<F>
>;

/** A number input schema: validates the wire form and returns an input container. */
export type NumberInputSchema<
  U,
  RS extends RuleSet,
  F extends z.ZodRawShape,
  M extends Method = Method,
> = z.ZodPipe<
  NumberWireSchema<F>,
  z.ZodTransform<Container<U, RS, M>, NumberWireOutput<F>>
>;

export type NumberInputSchemaOptional<
  U,
  RS extends RuleSet,
  F extends z.ZodRawShape,
  M extends Method = Method,
> = z.ZodPipe<
  z.ZodOptional<NumberWireSchema<F>>,
  z.ZodTransform<
    Container<U, RS, M> | undefined,
    NumberWireOutput<F> | undefined
  >
>;

/** An enum (or literal) input schema. */
export type EnumInputSchema<
  T extends string,
  RS extends RuleSet,
  M extends Method = Method,
> = z.ZodPipe<
  EnumSchema<T>,
  z.ZodTransform<Container<T, RS, M>, z.output<EnumSchema<T>>>
>;

export type EnumInputSchemaOptional<
  T extends string,
  RS extends RuleSet,
  M extends Method = Method,
> = z.ZodPipe<
  z.ZodOptional<EnumSchema<T>>,
  z.ZodTransform<
    Container<T, RS, M> | undefined,
    z.output<EnumSchema<T>> | undefined
  >
>;

export type BooleanInputSchema<
  RS extends RuleSet,
  M extends Method = Method,
> = z.ZodPipe<z.ZodBoolean, z.ZodTransform<Container<boolean, RS, M>, boolean>>;

export type BooleanInputSchemaOptional<
  RS extends RuleSet,
  M extends Method = Method,
> = z.ZodPipe<
  z.ZodOptional<z.ZodBoolean>,
  z.ZodTransform<Container<boolean, RS, M> | undefined, boolean | undefined>
>;

export type InputBuilderConfig<
  RS extends RuleSet,
  O extends object,
  F extends z.ZodRawShape,
  M extends Method = Method,
> = {
  /** The unit system the input containers belong to. */
  system: UnitSystem<RS, M>;

  /** Gives the shared schema for a list of enum values; see `createEnumRegistry`. */
  enumSchema: <TEnum extends string>(
    values: readonly TEnum[],
  ) => EnumSchema<TEnum>;

  /**
   * Describes the unit a number input is measured in, e.g. 'kilograms'. It is added to the input's
   * description and as `x-units` on its schema. Called with a factory for the unit, the number
   * validation if there is any, and the input's options. Use the options when the unit a value is
   * supplied in can't be worked out from the unit it is stored as, e.g. a mass supplied in tonnes.
   */
  displayUnit: (
    unitFactory: (value: number) => NumberUnit,
    tweaker: NumberSchemaTweaker | undefined,
    options: InputOptions<O, M>,
  ) => string;

  /** Metadata to record on every input's container, from the consumer's options. */
  toMeta?: (options: O) => Metadata;

  /** Extra OpenAPI fields for every input's schema, from the consumer's options. */
  toOpenApi?: (options: O) => Record<string, unknown>;

  /** Fields allowed beside `value` in a number input, e.g. a data quality rating. */
  numberFields?: F;

  /** Metadata to record on a number input's container, from its extra fields. */
  numberFieldsToMeta?: (fields: z.output<z.ZodObject<F>>) => Metadata;
};

/**
 * Builds zod schemas that validate user supplied values and turn them into input containers of a
 * unit system:
 *
 * - `numberInput(unitFactory, options, tweaker?)` accepts `{ value, ...numberFields }`
 * - `enumInput(values, options)` accepts one of a registered list of strings
 * - `literalInput(value, options)` accepts exactly one string
 * - `booleanInput(options)` accepts a boolean
 *
 * plus an `Optional` variant of each (except literals), which also accepts `undefined`.
 *
 * Each consumer chooses the options its inputs take (`O`, inferred from `toMeta`/`toOpenApi`), what
 * of them is recorded as metadata or emitted to OpenAPI, and what fields sit beside a number's
 * `value` (`F`, inferred from `numberFields`).
 */
export const createInputBuilders = <
  RS extends RuleSet,
  M extends Method,
  O extends object = object,
  F extends z.ZodRawShape = Record<never, never>,
>(
  config: InputBuilderConfig<RS, O, F, M>,
) => {
  const {
    system,
    enumSchema,
    displayUnit,
    toMeta = () => ({}),
    toOpenApi = () => ({}),
    numberFields = {} as F,
    numberFieldsToMeta = () => ({}),
  } = config;

  /** The `description` and consumer tags shared by every input schema. */
  const openapiTags = (description: string, options: InputOptions<O, M>) => ({
    description,
    ...toOpenApi(options),
  });

  const numberWireSchema = (
    units: string,
    tweaker?: NumberSchemaTweaker,
  ): NumberWireSchema<F> =>
    z
      .strictObject({ value: resolveNumberSchema(tweaker), ...numberFields })
      .meta({ 'x-units': units }) as unknown as NumberWireSchema<F>;

  const toNumberContainer =
    <U extends NumberUnit>(
      unitFactory: (value: number) => U,
      options: InputOptions<O, M>,
    ) =>
    (wire: NumberWireOutput<F>): Container<U, RS, M> => {
      const { value, ...fields } = wire;
      return system.input(unitFactory(value), {
        ...toMeta(options),
        ...numberFieldsToMeta(fields as z.output<z.ZodObject<F>>),
        name: options.name,
        method: options.method,
      });
    };

  const toContainer =
    <T extends string | boolean>(options: InputOptions<O, M>) =>
    (value: T): Container<T, RS, M> =>
      system.input(value, {
        ...toMeta(options),
        name: options.name,
        method: options.method,
      });

  const withUnits = (description: string, units: string) =>
    `${description} (${units})`;

  /** Accepts `{ value, ...numberFields }` and returns an input container of the unit. */
  const numberInput = <U extends NumberUnit>(
    unitFactory: (value: number) => U,
    options: InputOptions<O, M>,
    tweaker?: NumberSchemaTweaker,
  ): NumberInputSchema<U, RS, F, M> => {
    const units = displayUnit(unitFactory, tweaker, options);
    return numberWireSchema(units, tweaker)
      .transform(toNumberContainer(unitFactory, options))
      .meta(
        openapiTags(withUnits(options.description, units), options),
      ) as NumberInputSchema<U, RS, F, M>;
  };

  /**
   * Like `numberInput`, but also accepts `undefined`. The display unit is worked out without the
   * number validation, which matches how the emissions calculators have always described these.
   */
  const numberInputOptional = <U extends NumberUnit>(
    unitFactory: (value: number) => U,
    options: InputOptions<O, M>,
    tweaker?: NumberSchemaTweaker,
  ): NumberInputSchemaOptional<U, RS, F, M> => {
    const units = displayUnit(unitFactory, undefined, options);
    return numberWireSchema(units, tweaker)
      .optional()
      .transform(mapOptional(toNumberContainer(unitFactory, options)))
      .meta(
        openapiTags(withUnits(options.description, units), options),
      ) as NumberInputSchemaOptional<U, RS, F, M>;
  };

  /** Accepts one of a registered list of strings. */
  const enumInput = <TEnum extends string>(
    values: readonly TEnum[],
    options: InputOptions<O, M>,
  ): EnumInputSchema<TEnum, RS, M> =>
    enumSchema(values)
      .meta(openapiTags(options.description, options))
      .transform(toContainer<TEnum>(options)) as unknown as EnumInputSchema<
      TEnum,
      RS,
      M
    >;

  const enumInputOptional = <TEnum extends string>(
    values: readonly TEnum[],
    options: InputOptions<O, M>,
  ): EnumInputSchemaOptional<TEnum, RS, M> =>
    enumSchema(values)
      .optional()
      .meta(openapiTags(options.description, options))
      .transform(
        mapOptional(toContainer<TEnum>(options)),
      ) as unknown as EnumInputSchemaOptional<TEnum, RS, M>;

  /**
   * Accepts exactly one string, typically to select a variant. It is emitted inline as a
   * single-value enum, so it doesn't need to be registered.
   */
  const literalInput = <TValue extends string>(
    value: TValue,
    options: InputOptions<O, M>,
  ): EnumInputSchema<TValue, RS, M> =>
    z
      .enum([value])
      .meta(openapiTags(options.description, options))
      .transform(toContainer<TValue>(options)) as unknown as EnumInputSchema<
      TValue,
      RS,
      M
    >;

  const booleanInput = (
    options: InputOptions<O, M>,
  ): BooleanInputSchema<RS, M> =>
    z
      .boolean()
      .meta(openapiTags(options.description, options))
      .transform(toContainer<boolean>(options));

  const booleanInputOptional = (
    options: InputOptions<O, M>,
  ): BooleanInputSchemaOptional<RS, M> =>
    z
      .boolean()
      .optional()
      .meta(openapiTags(options.description, options))
      .transform(mapOptional(toContainer<boolean>(options)));

  return {
    numberInput,
    numberInputOptional,
    enumInput,
    enumInputOptional,
    literalInput,
    booleanInput,
    booleanInputOptional,
  };
};
