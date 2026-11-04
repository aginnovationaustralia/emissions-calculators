import { Metadata } from './containers';
import { getDisplayUnit } from './display-units';
import { enumSchema } from './enum-schemas';
import {
  genericBooleanInput,
  genericBooleanInputOptional,
  genericEnumInput,
  genericEnumInputOptional,
  GenericInputContainer,
  GenericInputFields,
  genericLiteralInput,
  genericNumberInput,
  genericNumberInputOptional,
  GenericNumberInputSchema,
  GenericNumberInputSchemaOptional,
  NumberInputValue,
  NumberSchemaTweaker,
} from './generic/inputs';
import { AnyNumberUnit, AnyUnit } from './generic/units';
import { ModuleNames } from './modules';
import { QualityTable } from './quality';

export type {
  NumberInputValue,
  NumberSchemaTweaker,
  RatedValue,
} from './generic/inputs';

const X_MODULES = 'x-modules';

type Method = '1' | '2';

export class InputContainer<U extends AnyUnit> extends GenericInputContainer<
  U,
  Method
> {
  /** Which module(s) (e.g. '3.1') consume this input. */
  modules: string[];
  quality?: QualityTable;

  constructor(
    unit: U,
    method: Method,
    modules: string[],
    quality?: QualityTable,
    baseOrigin?: Metadata,
  ) {
    super(unit, method, baseOrigin);
    this.modules = modules;
    this.quality = quality;
  }

  override switchUnit<V extends AnyNumberUnit>(
    converter: (from: NoInfer<U>) => V,
  ): InputContainer<V> {
    return super.switchUnit(converter) as InputContainer<V>;
  }
}
export type NonEmptyArray<T> = [T, ...T[]];

export type InputOptions = {
  name: string;
  method?: Method;
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
  return new InputContainer(value, method, modules, quality, { name });
};

export type RateableInputValue = number;

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

/** Builds VEERG's input container, with the modules from the input options. */
const buildInput =
  (modules: ModuleNames[], quality?: QualityTable) =>
  <U extends AnyUnit>(
    unit: U,
    { name, method }: GenericInputFields<Method>,
  ): InputContainer<U> =>
    input(unit, { name, method, quality, modules });

const appendUnits = (description: string, units: string) =>
  `${description} (${units})`;

/** Build the `description` + `x-modules` meta fields shared by every input schema. */
const openapiTags = (description: string, modules: ModuleNames[]) => ({
  description,
  [X_MODULES]: modules,
});

// -------- Numbers -----------------

/**
 * Zod schema accepting `{ value, quality? }` and returning an input container.
 */
export function numberInput<U extends AnyNumberUnit>(
  unitFactory: (value: number) => U,
  options: TypedInputOptions,
  schemaTweaker?: NumberSchemaTweaker,
): GenericNumberInputSchema<InputContainer<U>> {
  const displayUnit = getDisplayUnit(unitFactory, schemaTweaker);
  return genericNumberInput(
    unitFactory,
    options,
    {
      schemaTweaker,
      displayUnit,
      meta: openapiTags(
        appendUnits(options.description, displayUnit),
        options.modules,
      ),
    },
    buildInput(options.modules)<U>,
  );
}

/**
 * Optional `{ value, quality? }` number input schema.
 */
export function numberInputOptional<U extends AnyNumberUnit>(
  unitFactory: (value: number) => U,
  options: TypedInputOptions,
  schemaTweaker?: NumberSchemaTweaker,
): GenericNumberInputSchemaOptional<InputContainer<U>> {
  const displayUnit = getDisplayUnit(unitFactory);
  return genericNumberInputOptional(
    unitFactory,
    options,
    {
      schemaTweaker,
      displayUnit,
      meta: openapiTags(
        appendUnits(options.description, displayUnit),
        options.modules,
      ),
    },
    buildInput(options.modules)<U>,
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
) =>
  genericEnumInput(
    enumSchema,
    values,
    options,
    { meta: openapiTags(options.description, options.modules) },
    buildInput(options.modules)<TEnum>,
  );

export const enumInputOptional = <TEnum extends string>(
  values: readonly TEnum[],
  options: TypedInputOptions,
) =>
  genericEnumInputOptional(
    enumSchema,
    values,
    options,
    { meta: openapiTags(options.description, options.modules) },
    buildInput(options.modules)<TEnum>,
  );

/**
 * An input that only accepts a single value, typically used to select a variant. It is
 * emitted inline as a single-value enum, so it does not need to be registered.
 */
export const literalInput = <TValue extends string>(
  value: TValue,
  options: TypedInputOptions,
) =>
  genericLiteralInput(
    value,
    options,
    { meta: openapiTags(options.description, options.modules) },
    buildInput(options.modules)<TValue>,
  );

// -------- Booleans -----------------

export const booleanInput = (
  inputName: string,
  description: string,
  modules: NonEmptyArray<ModuleNames>,
) =>
  genericBooleanInput(
    { name: inputName },
    { meta: openapiTags(description, modules) },
    buildInput(modules)<boolean>,
  );

export const booleanInputOptional = (
  inputName: string,
  description: string,
  modules: NonEmptyArray<ModuleNames>,
) =>
  genericBooleanInputOptional(
    { name: inputName },
    { meta: openapiTags(description, modules) },
    buildInput(modules)<boolean>,
  );
