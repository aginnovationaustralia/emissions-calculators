/* eslint-disable @typescript-eslint/no-empty-object-type -- the named schema interfaces below are deliberately empty, see the comment on them */
/*
 * Input schemas for the emissions calculators, built with @aginnovationaustralia/calculator-inputs.
 *
 * This module supplies the calculators' choices: every input names the module(s) that read it
 * (recorded as metadata and emitted as `x-modules`), number inputs can carry a data quality rating,
 * and units are described with `getDisplayUnit`. The exported names and signatures are unchanged
 * from before the extraction.
 */
import {
  createInputBuilders,
  NumberSchemaTweaker,
} from '@aginnovationaustralia/calculator-inputs';
import { core, z } from 'zod';
import { Container, units } from './containers';
import { getDisplayUnit } from './display-units';
import { enumSchema } from './enum-schemas';
import { ModuleNames } from './modules';
import { QualityTable, QualityTableSchema } from './quality';
import { AnyUnit, NumberUnit } from './units';

export {
  isNonNegative,
  isPercentage,
  isPositive,
  isProportion,
  type NumberSchemaTweaker,
} from '@aginnovationaustralia/calculator-inputs';

const X_MODULES = 'x-modules';

/**
 * A value supplied by the user, recorded with an `origin.kind` of `input` and the method it is for.
 * Its name, quality and modules are in `meta`.
 */
export type InputContainer<U> = Container<U>;

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
): InputContainer<T> => units.input(value, { name, method, quality, modules });

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

const builders = createInputBuilders({
  system: units,
  enumSchema,
  displayUnit: (unitFactory, schemaTweaker) =>
    getDisplayUnit(unitFactory as (value: number) => NumberUnit, schemaTweaker),
  toMeta: (options: { modules: NonEmptyArray<ModuleNames> }) => ({
    modules: options.modules,
  }),
  toOpenApi: (options) => ({ [X_MODULES]: options.modules }),
  numberFields: { quality: QualityTableSchema.optional().default({}) },
  numberFieldsToMeta: ({ quality }) => ({ quality }),
});

type NumberInputObjectSchema = z.ZodType<RatedValue, NumberInputValue>;

// -------- Named input field types --------
// Each input helper returns one of these interfaces rather than its inferred zod type. They
// add nothing to the zod type they extend, but TypeScript writes an interface by name in
// declaration files, where it would otherwise write out the whole zod type for every field
// of every schema. Without them the package's declarations are tens of megabytes, which is
// slow for every consumer's type checking and exhausts the memory of documentation tools.

/** A required number input, from {@link numberInput} */
export interface NumberInputField<U extends NumberUnit> extends z.ZodPipe<
  NumberInputObjectSchema,
  z.ZodTransform<InputContainer<U>, RatedValue>
> {}

/** An optional number input, from {@link numberInputOptional} */
export interface OptionalNumberInputField<
  U extends NumberUnit,
> extends z.ZodPipe<
  z.ZodOptional<NumberInputObjectSchema>,
  z.ZodTransform<InputContainer<U> | undefined, RatedValue | undefined>
> {}

type EnumValuesSchema<TEnum extends string> = z.ZodEnum<
  core.util.ToEnum<TEnum>
>;

/** A required enum input, from {@link enumInput} */
export interface EnumInputField<TEnum extends string> extends z.ZodPipe<
  EnumValuesSchema<TEnum>,
  z.ZodTransform<InputContainer<TEnum>, TEnum>
> {}

/** An optional enum input, from {@link enumInputOptional} */
export interface OptionalEnumInputField<TEnum extends string> extends z.ZodPipe<
  z.ZodOptional<EnumValuesSchema<TEnum>>,
  z.ZodTransform<InputContainer<TEnum> | undefined, TEnum | undefined>
> {}

/** A single value input, from {@link literalInput} */
export interface LiteralInputField<TValue extends string> extends z.ZodPipe<
  EnumValuesSchema<TValue>,
  z.ZodTransform<InputContainer<TValue>, TValue>
> {}

/** A required boolean input, from {@link booleanInput} */
export interface BooleanInputField extends z.ZodPipe<
  z.ZodBoolean,
  z.ZodTransform<InputContainer<boolean>, boolean>
> {}

/** An optional boolean input, from {@link booleanInputOptional} */
export interface OptionalBooleanInputField extends z.ZodPipe<
  z.ZodOptional<z.ZodBoolean>,
  z.ZodTransform<InputContainer<boolean> | undefined, boolean | undefined>
> {}

/**
 * Zod schema accepting `{ value, quality? }` and returning an input container.
 */
export function numberInput<U extends NumberUnit>(
  unitFactory: (value: number) => U,
  options: TypedInputOptions,
  schemaTweaker?: NumberSchemaTweaker,
): NumberInputField<U> {
  return builders.numberInput(
    unitFactory,
    options,
    schemaTweaker,
  ) as unknown as NumberInputField<U>;
}

/**
 * Optional `{ value, quality? }` number input schema.
 */
export function numberInputOptional<U extends NumberUnit>(
  unitFactory: (value: number) => U,
  options: TypedInputOptions,
  schemaTweaker?: NumberSchemaTweaker,
): OptionalNumberInputField<U> {
  return builders.numberInputOptional(
    unitFactory,
    options,
    schemaTweaker,
  ) as unknown as OptionalNumberInputField<U>;
}

// -------- Enums -----------------

export const enumInput = <TEnum extends string>(
  values: readonly TEnum[],
  options: TypedInputOptions,
): EnumInputField<TEnum> =>
  builders.enumInput(values, options) as unknown as EnumInputField<TEnum>;

export const enumInputOptional = <TEnum extends string>(
  values: readonly TEnum[],
  options: TypedInputOptions,
): OptionalEnumInputField<TEnum> =>
  builders.enumInputOptional(
    values,
    options,
  ) as unknown as OptionalEnumInputField<TEnum>;

/**
 * An input that only accepts a single value, typically used to select a variant. It is
 * emitted inline as a single-value enum, so it does not need to be registered.
 */
export const literalInput = <TValue extends string>(
  value: TValue,
  options: TypedInputOptions,
): LiteralInputField<TValue> =>
  builders.literalInput(value, options) as unknown as LiteralInputField<TValue>;

// -------- Booleans -----------------

export const booleanInput = (
  inputName: string,
  description: string,
  modules: NonEmptyArray<ModuleNames>,
): BooleanInputField =>
  builders.booleanInput({ name: inputName, description, modules });

export const booleanInputOptional = (
  inputName: string,
  description: string,
  modules: NonEmptyArray<ModuleNames>,
): OptionalBooleanInputField =>
  builders.booleanInputOptional({ name: inputName, description, modules });
