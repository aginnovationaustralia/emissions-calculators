import {
  booleanInput,
  booleanInputOptional,
  enumInput,
  enumInputOptional,
  genericBooleanInput,
  genericBooleanInputOptional,
  genericEnumInput,
  genericEnumInputOptional,
  genericNumberInput,
  genericNumberInputOptional,
  NonEmptyArray,
  numberInput,
  numberInputOptional,
  nv,
} from './inputs';
import Decimal from 'decimal.js-light';
import { MethodValueStore, seedOf } from './method-value-store';
import { ENTERIC_OTHER_3_6, MANURE_OTHER_4_7, ModuleNames } from './modules';
import { head } from './units';
import { ValueStore } from './value-store';

const modules: NonEmptyArray<ModuleNames> = [
  ENTERIC_OTHER_3_6,
  MANURE_OTHER_4_7,
];
const genericOptions = { name: 'thing', description: 'A thing' };
const typedOptions = { ...genericOptions, modules: modules };
const housing = ['Paddock', 'Barn'] as const;

describe('generic inputs', () => {
  it('builds a number input container with no modules', () => {
    const schema = genericNumberInput(head, genericOptions);
    const container = schema.parse(nv(5, { Temporal: '2' }));

    expect(container.unit.__unitType).toBe('Head');
    expect(container.unit.store.toNumber()).toBe(5);
    expect(container.core?.name).toBe('thing');
    expect(container.core?.quality).toEqual({ Temporal: '2' });
    expect(container.modules).toEqual([]);
    expect(schema.meta()).toEqual({ description: 'A thing (head)' });
  });

  it('builds an enum input container with no modules', () => {
    const schema = genericEnumInput(housing, genericOptions);
    const container = schema.parse('Barn');

    expect(container.unit).toBe('Barn');
    expect(container.modules).toEqual([]);
    expect(schema.meta()).toEqual({ description: 'A thing' });
    expect(schema.safeParse('Feedlot').success).toBe(false);
  });

  it('builds a boolean input container with no modules', () => {
    const schema = genericBooleanInput(genericOptions);
    const container = schema.parse(true);

    expect(container.unit).toBe(true);
    expect(container.modules).toEqual([]);
    expect(schema.meta()).toEqual({ description: 'A thing' });
  });

  it('passes undefined through the optional variants', () => {
    expect(
      genericNumberInputOptional(head, genericOptions).parse(undefined),
    ).toBeUndefined();
    expect(
      genericEnumInputOptional(housing, genericOptions).parse(undefined),
    ).toBeUndefined();
    expect(
      genericBooleanInputOptional(genericOptions).parse(undefined),
    ).toBeUndefined();
  });
});

describe('calculator inputs', () => {
  const xModules = { 'x-modules': modules };

  it('tags a number input container and its schema with its modules', () => {
    const schema = numberInput(head, typedOptions);

    expect(schema.parse(nv(5)).modules).toEqual(modules);
    expect(schema.meta()).toEqual({
      description: 'A thing (head)',
      ...xModules,
    });
  });

  it('tags an enum input container and its schema with its modules', () => {
    const schema = enumInput(housing, typedOptions);

    expect(schema.parse('Paddock').modules).toEqual(modules);
    expect(schema.meta()).toEqual({ description: 'A thing', ...xModules });
  });

  it('tags a boolean input container and its schema with its modules', () => {
    const schema = booleanInput('thing', 'A thing', modules);

    expect(schema.parse(false).modules).toEqual(modules);
    expect(schema.meta()).toEqual({ description: 'A thing', ...xModules });
  });

  it('tags supplied optional inputs, and passes undefined through', () => {
    const number = numberInputOptional(head, typedOptions);
    const enumeration = enumInputOptional(housing, typedOptions);
    const boolean = booleanInputOptional('thing', 'A thing', modules);

    expect(number.parse(nv(1))?.modules).toEqual(modules);
    expect(enumeration.parse('Barn')?.modules).toEqual(modules);
    expect(boolean.parse(true)?.modules).toEqual(modules);

    expect(number.parse(undefined)).toBeUndefined();
    expect(enumeration.parse(undefined)).toBeUndefined();
    expect(boolean.parse(undefined)).toBeUndefined();
  });

  it('tracks a method 2 number input for both methods', () => {
    const container = numberInput(head, {
      ...typedOptions,
      method: '2',
    }).parse(nv(3));

    expect(container.method).toBe('2');
    expect(container.unit.store).toBeInstanceOf(MethodValueStore);
    expect(seedOf(container.unit.store)).toEqual({
      valueMethod1: new Decimal(3),
      valueMethod2: new Decimal(3),
    });
  });

  it('leaves a method 1 number input with a plain store', () => {
    const container = numberInput(head, typedOptions).parse(nv(3));

    expect(container.method).toBe('1');
    expect(container.unit.store.constructor).toBe(ValueStore);
  });

  it('marks a method 2 enum input without changing its value', () => {
    const container = enumInput(housing, {
      ...typedOptions,
      method: '2',
    }).parse('Barn');

    expect(container.method).toBe('2');
    expect(container.unit).toBe('Barn');
  });
});
