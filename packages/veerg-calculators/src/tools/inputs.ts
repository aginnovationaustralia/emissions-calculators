import { object } from '@/types/schemas';
import { z } from 'zod';
import { BaseContainer, Metadata } from './containers';
import { getDisplayUnit } from './display-units';
import { enumSchema } from './enum-schemas';
import { ModuleNames } from './modules';
import { QualityTable, QualityTableSchema } from './quality';
import { AnyUnit, NumberUnit } from './units';
import { mapOptional } from './zod';

const X_MODULES = 'x-modules';

export class InputContainer<U extends AnyUnit> extends BaseContainer<U> {
  originType: 'input';
  method: '1' | '2';
  /** Which module(s) (e.g. '3.1') consume this input. */
  modules: string[];

  constructor(
    unit: U,
    method: '1' | '2',
    modules: string[],
    baseOrigin?: Metadata,
  ) {
    super(unit, baseOrigin);
    this.originType = 'input';
    this.method = method;
    this.modules = modules;
  }

  switchUnit<
    UN extends (U extends NumberUnit ? U : never),
    V extends NumberUnit,
  >(converter: (from: UN) => V): InputContainer<V> {
    const newUnit = converter(this.unit as unknown as UN);
    return new InputContainer(newUnit, this.method, this.modules, this.core);
  }
}
export type NonEmptyArray<T> = [T, ...T[]];

export type InputOptions = {
  name: string;
  method?: '1' | '2';
  quality?: QualityTable;
  /**
   * Which module(s) (e.g. '3.1') consume this input. Input schemas require at least one
   * module (see `TypedInputOptions`); this looser type is only for building bare input
   * containers, such as in tests of the container tools.
   */
  modules: ModuleNames[];
};

/**
 * Function for constructing an input container from a unit value and options.
 * @param value the unit value to be wrapped by the input container
 * @param options the input options
 * @returns the input container
 */
export const input = <T extends AnyUnit>(
  value: T,
  { name, method = '1', quality, modules }: InputOptions,
): InputContainer<T> => {
  return new InputContainer(value, method, modules, { name, quality });
};

export type RateableInputValue = number;

/** Wire form for number inputs: always an object; quality is optional. */
export type NumberInputValue<T extends RateableInputValue = number> = {
  value: T;
  quality?: QualityTable;
};

/** Parsed number input with quality always present (defaults to `{}`). */
export type RatedValue<T extends RateableInputValue = number> = {
  value: T;
  quality: QualityTable;
};

/** Build a number input value. */
export const numberValue = (
  value: number,
  quality?: QualityTable,
): NumberInputValue => (quality === undefined ? { value } : { value, quality });
export const nv = numberValue;

/** Build a number input value, or `undefined` when the raw value is missing. */
export const numberValueOptional = (
  value: number | undefined | null,
  quality?: QualityTable,
): NumberInputValue | undefined =>
  value === undefined || value === null ? undefined : nv(value, quality);
export const nvo = numberValueOptional;

export type TypedInputOptions = Omit<InputOptions, 'modules'> & {
  description: string;
  scope?: '1' | '2' | '3';
  /**
   * Which module(s) (e.g. '3.1') consume this input. Must not be empty: every key a
   * user can supply has to be read by at least one module. If no module reads a key in
   * some location, leave the key out of that location's schema instead.
   */
  modules: NonEmptyArray<ModuleNames>;
};

export type NumberSchemaTweaker = (schema: z.ZodNumber) => z.ZodNumber;

// -------- Number input OpenAPI components --------
// Stable, description-free schemas so zod-openapi can emit shared $refs.

const qualityField = QualityTableSchema.optional().default({});

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

type NumberInputObjectSchema = z.ZodType<RatedValue, NumberInputValue>;

type NumberInputSchema = z.ZodType<number, number>;

/* Create a map of number input schemas by constraint key. This lets the user define rules with zod syntax,
 * and for most scenarios we will match it to a stable schema snippet. This allows a clean OpenAPI file to be generated
 */
const numberInputByConstraint = new Map<string, NumberInputSchema>([
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

const resolveNumberInputSchema = (
  displayUnit: string,
  schemaTweaker?: NumberSchemaTweaker,
): NumberInputObjectSchema => {
  const valueSchema = schemaTweaker ? schemaTweaker(z.number()) : z.number();

  const known = numberInputByConstraint.get(numberConstraintKey(valueSchema));
  const baseSchema = known ?? valueSchema;
  return object({
    value: baseSchema,
    quality: qualityField,
  }).meta({ 'x-units': displayUnit });
};

const toInputContainer =
  <U extends NumberUnit>(
    unitFactory: (value: number) => U,
    options: TypedInputOptions,
  ) =>
  ({ value, quality }: RatedValue): InputContainer<U> => {
    const unit = unitFactory(value);
    if (options.method === '2') {
      unit.store.applyMethod2();
    }
    return input(unit, {
      name: options.name,
      method: options.method,
      quality,
      modules: options.modules,
    });
  };

type TransformedNumberInputSchemaFactory<U extends NumberUnit> = z.ZodPipe<
  NumberInputObjectSchema,
  z.ZodTransform<InputContainer<U>, RatedValue>
>;

type NumberInputSchemaOptional<U extends NumberUnit> = z.ZodPipe<
  z.ZodOptional<NumberInputObjectSchema>,
  z.ZodTransform<InputContainer<U> | undefined, RatedValue | undefined>
>;

const appendUnits = (description: string, units: string) =>
  `${description} (${units})`;

/** Build the `description` + `x-modules` meta fields shared by every input schema. */
const openapiTags = (description: string, modules: ModuleNames[]) => ({
  description,
  [X_MODULES]: modules,
});

/**
 * Zod schema accepting `{ value, quality? }` and returning an input container.
 */
export function numberInput<U extends NumberUnit>(
  unitFactory: (value: number) => U,
  options: TypedInputOptions,
  schemaTweaker?: NumberSchemaTweaker,
): TransformedNumberInputSchemaFactory<U> {
  const displayUnit = getDisplayUnit(unitFactory, schemaTweaker);
  return resolveNumberInputSchema(displayUnit, schemaTweaker)
    .transform(toInputContainer(unitFactory, options))
    .meta(
      openapiTags(
        appendUnits(options.description, displayUnit),
        options.modules,
      ),
    );
}

/**
 * Optional `{ value, quality? }` number input schema.
 */
export function numberInputOptional<U extends NumberUnit>(
  unitFactory: (value: number) => U,
  options: TypedInputOptions,
  schemaTweaker?: NumberSchemaTweaker,
): NumberInputSchemaOptional<U> {
  const displayUnit = getDisplayUnit(unitFactory);
  return resolveNumberInputSchema(displayUnit, schemaTweaker)
    .optional()
    .transform(mapOptional(toInputContainer(unitFactory, options)))
    .meta(
      openapiTags(
        appendUnits(options.description, displayUnit),
        options.modules,
      ),
    );
}

export const isNonNegative: NumberSchemaTweaker = (schema) => schema.min(0);
export const isPositive: NumberSchemaTweaker = (schema) => schema.gt(0);
export const isProportion: NumberSchemaTweaker = (schema) =>
  schema.min(0).max(1);
export const isPercentage: NumberSchemaTweaker = (schema) =>
  schema.min(0).max(100);

// -------- Enums -----------------

export const enumInput = <TEnum extends string>(
  values: readonly TEnum[],
  options: TypedInputOptions,
) => {
  const { name, description, method = '1', modules } = options;
  return enumSchema(values)
    .meta(openapiTags(description, options.modules))
    .transform((val): InputContainer<TEnum> =>
      input(val, { name, method, modules }),
    );
};

export const enumInputOptional = <TEnum extends string>(
  values: readonly TEnum[],
  options: TypedInputOptions,
) => {
  const { name, description, method = '1', modules } = options;
  return enumSchema(values)
    .optional()
    .meta(openapiTags(description, options.modules))
    .transform(
      mapOptional((val): InputContainer<TEnum> =>
        input(val, { name, method, modules }),
      ),
    );
};

/**
 * An input that only accepts a single value, typically used to select a variant. It is
 * emitted inline as a single-value enum, so it does not need to be registered.
 */
export const literalInput = <TValue extends string>(
  value: TValue,
  options: TypedInputOptions,
) => {
  const { name, description, method = '1', modules } = options;
  return z
    .enum([value])
    .meta(openapiTags(description, options.modules))
    .transform((val): InputContainer<TValue> =>
      input(val, { name, method, modules }),
    );
};

// -------- Booleans -----------------

export const booleanInput = (
  inputName: string,
  description: string,
  modules: NonEmptyArray<ModuleNames>,
) =>
  z
    .boolean()
    .meta(openapiTags(description, modules))
    .transform((val): InputContainer<boolean> =>
      input(val, { name: inputName, modules }),
    );

export const booleanInputOptional = (
  inputName: string,
  description: string,
  modules: NonEmptyArray<ModuleNames>,
) =>
  z
    .boolean()
    .optional()
    .meta(openapiTags(description, modules))
    .transform(
      mapOptional((val): InputContainer<boolean> =>
        input(val, { name: inputName, modules }),
      ),
    );
