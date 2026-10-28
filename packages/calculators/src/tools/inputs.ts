import { object } from '@/types/schemas';
import { z } from 'zod';
import { BaseContainer, Metadata } from './containers';
import { getDisplayUnit } from './display-units';
import { ModuleNames } from './modules';
import { QualityTable, QualityTableSchema } from './quality';
import { MethodValueStore } from './method-value-store';
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

  /**
   * Tag this input with the module(s) that consume it and its calculation method. A method 2
   * number input tracks its value for both methods (see {@link MethodValueStore}).
   */
  asCalculatorInput(modules: string[], method: '1' | '2'): InputContainer<U> {
    const unit: AnyUnit = this.unit;
    const tagged =
      method === '2' && isNumberUnit(unit)
        ? { ...unit, store: MethodValueStore.fromMethod2Input(unit.store) }
        : unit;
    return new InputContainer(tagged as U, method, modules, this.core);
  }
}

const isNumberUnit = (unit: AnyUnit): unit is NumberUnit =>
  typeof unit === 'object';

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

/**
 * Options for the generic input schemas, which know nothing about the calculator modules.
 */
export type GenericInputOptions = {
  name: string;
  description: string;
};

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
    options: GenericInputOptions,
  ) =>
  ({ value, quality }: RatedValue): InputContainer<U> =>
    input(unitFactory(value), { name: options.name, quality, modules: [] });

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

/** The `x-modules` meta field added to every calculator input schema. */
const modulesTag = (modules: ModuleNames[]) => ({ [X_MODULES]: modules });

/**
 * Tag the input container a schema produces with the module(s) that consume it and its
 * calculation method.
 */
const asCalculatorInput =
  (modules: ModuleNames[], method: '1' | '2' = '1') =>
  <C extends InputContainer<AnyUnit> | undefined>(container: C): C =>
    container?.asCalculatorInput(modules, method) as C;

// -------- Generic inputs -----------------
// These know nothing about the calculator modules, so they can be used to build inputs for
// any calculation. The calculator inputs below are built on them.

/**
 * Zod schema accepting `{ value, quality? }` and returning an input container.
 */
export function genericNumberInput<U extends NumberUnit>(
  unitFactory: (value: number) => U,
  options: GenericInputOptions,
  schemaTweaker?: NumberSchemaTweaker,
): TransformedNumberInputSchemaFactory<U> {
  const displayUnit = getDisplayUnit(unitFactory, schemaTweaker);
  return resolveNumberInputSchema(displayUnit, schemaTweaker)
    .transform(toInputContainer(unitFactory, options))
    .meta({ description: appendUnits(options.description, displayUnit) });
}

/**
 * Optional `{ value, quality? }` number input schema.
 */
export function genericNumberInputOptional<U extends NumberUnit>(
  unitFactory: (value: number) => U,
  options: GenericInputOptions,
  schemaTweaker?: NumberSchemaTweaker,
): NumberInputSchemaOptional<U> {
  const displayUnit = getDisplayUnit(unitFactory);
  return resolveNumberInputSchema(displayUnit, schemaTweaker)
    .optional()
    .transform(mapOptional(toInputContainer(unitFactory, options)))
    .meta({ description: appendUnits(options.description, displayUnit) });
}

export const genericEnumInput = <TEnum extends string>(
  values: readonly TEnum[],
  options: GenericInputOptions,
) => {
  const { name, description } = options;
  return z
    .enum(values)
    .transform((val): InputContainer<TEnum> =>
      input(val, { name, modules: [] }),
    )
    .meta({ description });
};

export const genericEnumInputOptional = <TEnum extends string>(
  values: readonly TEnum[],
  options: GenericInputOptions,
) => {
  const { name, description } = options;
  return z
    .enum(values)
    .optional()
    .transform(
      mapOptional((val): InputContainer<TEnum> =>
        input(val, { name, modules: [] }),
      ),
    )
    .meta({ description });
};

export const genericBooleanInput = ({
  name,
  description,
}: GenericInputOptions) =>
  z
    .boolean()
    .transform((val): InputContainer<boolean> =>
      input(val, { name, modules: [] }),
    )
    .meta({ description });

export const genericBooleanInputOptional = ({
  name,
  description,
}: GenericInputOptions) =>
  z
    .boolean()
    .optional()
    .transform(
      mapOptional((val): InputContainer<boolean> =>
        input(val, { name, modules: [] }),
      ),
    )
    .meta({ description });

// -------- Calculator inputs -----------------
// The generic inputs, tagged with the module(s) that consume them, both in the OpenAPI
// schema (`x-modules`) and on the input container.

/**
 * Zod schema accepting `{ value, quality? }` and returning an input container.
 */
export function numberInput<U extends NumberUnit>(
  unitFactory: (value: number) => U,
  options: TypedInputOptions,
  schemaTweaker?: NumberSchemaTweaker,
): TransformedNumberInputSchemaFactory<U> {
  return genericNumberInput(unitFactory, options, schemaTweaker)
    .overwrite(asCalculatorInput(options.modules, options.method))
    .meta(modulesTag(options.modules));
}

/**
 * Optional `{ value, quality? }` number input schema.
 */
export function numberInputOptional<U extends NumberUnit>(
  unitFactory: (value: number) => U,
  options: TypedInputOptions,
  schemaTweaker?: NumberSchemaTweaker,
): NumberInputSchemaOptional<U> {
  return genericNumberInputOptional(unitFactory, options, schemaTweaker)
    .overwrite(asCalculatorInput(options.modules, options.method))
    .meta(modulesTag(options.modules));
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
) =>
  genericEnumInput(values, options)
    .overwrite(asCalculatorInput(options.modules, options.method))
    .meta(modulesTag(options.modules));

export const enumInputOptional = <TEnum extends string>(
  values: readonly TEnum[],
  options: TypedInputOptions,
) =>
  genericEnumInputOptional(values, options)
    .overwrite(asCalculatorInput(options.modules, options.method))
    .meta(modulesTag(options.modules));

// -------- Booleans -----------------

export const booleanInput = (
  inputName: string,
  description: string,
  modules: NonEmptyArray<ModuleNames>,
) =>
  genericBooleanInput({ name: inputName, description })
    .overwrite(asCalculatorInput(modules))
    .meta(modulesTag(modules));

export const booleanInputOptional = (
  inputName: string,
  description: string,
  modules: NonEmptyArray<ModuleNames>,
) =>
  genericBooleanInputOptional({ name: inputName, description })
    .overwrite(asCalculatorInput(modules))
    .meta(modulesTag(modules));
