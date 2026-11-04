import { collectInputs } from '../collect';
import { Metadata } from '../containers';
import { AnyNumberUnit, AnyUnit } from './units';
import {
  createEnumSchemas,
  GenericInputContainer,
  genericEnumInput,
  genericBooleanInput,
  genericBooleanInputOptional,
  genericEnumInputOptional,
  genericLiteralInput,
  GenericMethod,
  genericNumberInput,
  genericNumberInputOptional,
} from './inputs';
import { QualityTable } from '../quality';
import { input, numberInput } from '../inputs';
import { mass, volume } from '../units';

/** An input container defined by another calculator, with its own extra field. */
class SectionInput<U extends AnyUnit> extends GenericInputContainer<
  U,
  GenericMethod
> {
  section: string;

  constructor(
    unit: U,
    method: GenericMethod,
    section: string,
    quality?: QualityTable,
    baseOrigin?: Metadata,
  ) {
    super(unit, method, quality, baseOrigin);
    this.section = section;
  }

  override switchUnit<V extends AnyNumberUnit>(
    converter: (from: NoInfer<U>) => V,
  ): SectionInput<V> {
    return super.switchUnit(converter) as SectionInput<V>;
  }
}

const sectionInput =
  (section: string) =>
  <U extends AnyUnit>(
    unit: U,
    fields: { name: string; method: GenericMethod; quality?: QualityTable },
  ) =>
    new SectionInput(unit, fields.method, section, fields.quality, {
      name: fields.name,
    });

const fuelEnums = createEnumSchemas(
  { FuelState: ['Liquid', 'Gaseous'] },
  'the test fuel enums',
);

describe('genericNumberInput', () => {
  it('builds a GenericInputContainer by default, with the quality from the value', () => {
    const schema = genericNumberInput((v) => volume('Liquid fuel', v), {
      name: 'Qi',
    });
    const result = schema.parse({ value: 10, quality: { Temporal: '2' } });

    expect(result).toBeInstanceOf(GenericInputContainer);
    expect(result.core?.name).toBe('Qi');
    expect(result.method).toBe('1');
    expect(result.quality).toEqual({ Temporal: '2' });
    expect(result.unit.store.toNumber()).toBe(10);
  });

  it('builds a custom input container, keeping its extra field across a unit switch', () => {
    const schema = genericNumberInput(
      (v) => volume('Liquid fuel', v),
      { name: 'Qi', method: '3' },
      {},
      sectionInput('2.41'),
    );
    const result = schema.parse({ value: 10 });
    const switched = result.switchUnit((u) =>
      mass('Liquid fuel', u.store.toNumber()),
    );

    expect(switched).toBeInstanceOf(SectionInput);
    expect(switched.section).toBe('2.41');
    expect(switched.method).toBe('3');
    expect(switched.core?.name).toBe('Qi');
  });

  it('stores the value of an input for any method above 1 as the method 2 value', () => {
    const schema = genericNumberInput((v) => volume('Liquid fuel', v), {
      name: 'Qi',
      method: '4',
    });
    const result = schema.parse({ value: 10 });

    expect(result.unit.store.valueMethod2?.toNumber()).toBe(10);
  });

  it('applies the schema tweaker to the value', () => {
    const schema = genericNumberInput(
      (v) => volume('Liquid fuel', v),
      { name: 'Qi' },
      { schemaTweaker: (s) => s.min(0) },
    );

    expect(() => schema.parse({ value: -1 })).toThrow();
  });

  it('accepts a missing value when optional', () => {
    const schema = genericNumberInputOptional((v) => volume('Liquid fuel', v), {
      name: 'Qi',
    });

    expect(schema.parse(undefined)).toBeUndefined();
    expect(schema.parse({ value: 1 })?.unit.store.toNumber()).toBe(1);
  });
});

describe('genericEnumInput', () => {
  it('builds an input container from a value of a registered enum', () => {
    const schema = genericEnumInput(fuelEnums, ['Gaseous', 'Liquid'], {
      name: 'State',
      method: '2',
    });
    const result = schema.parse('Liquid');

    expect(result).toBeInstanceOf(GenericInputContainer);
    expect(result.unit).toBe('Liquid');
    expect(result.method).toBe('2');
    expect(() => schema.parse('Solid')).toThrow();
  });

  it('builds a custom input container, and accepts a missing value when optional', () => {
    const schema = genericEnumInputOptional(
      fuelEnums,
      ['Liquid', 'Gaseous'],
      { name: 'State' },
      {},
      sectionInput('2.41'),
    );

    expect(schema.parse(undefined)).toBeUndefined();
    expect(schema.parse('Gaseous')?.section).toBe('2.41');
  });

  it('throws for enums that are not registered', () => {
    expect(() =>
      genericEnumInput(fuelEnums, ['Liquid', 'Solid'], { name: 'State' }),
    ).toThrow(
      'are not registered. Add them with a name in the test fuel enums',
    );
  });

  it('throws when two enums are registered with the same values', () => {
    expect(() =>
      createEnumSchemas({ A: ['x', 'y'], B: ['y', 'x'] }, 'the test enums'),
    ).toThrow('Enums A and B have the same values');
  });
});

describe('genericLiteralInput', () => {
  it('accepts only its value, and builds a custom input container', () => {
    const schema = genericLiteralInput(
      'Method 2',
      { name: 'Variant', method: '2' },
      {},
      sectionInput('2.41'),
    );
    const result = schema.parse('Method 2');

    expect(result.unit).toBe('Method 2');
    expect(result.method).toBe('2');
    expect(result.section).toBe('2.41');
    expect(() => schema.parse('Method 1')).toThrow();
  });
});

describe('genericBooleanInput', () => {
  it('builds a GenericInputContainer by default', () => {
    const result = genericBooleanInput({ name: 'Flag' }).parse(true);

    expect(result).toBeInstanceOf(GenericInputContainer);
    expect(result.unit).toBe(true);
    expect(result.method).toBe('1');
    expect(result.core?.name).toBe('Flag');
  });

  it('builds a custom input container, and accepts a missing value when optional', () => {
    const schema = genericBooleanInputOptional(
      { name: 'Flag' },
      {},
      sectionInput('2.41'),
    );

    expect(schema.parse(undefined)).toBeUndefined();
    expect(schema.parse(false)?.section).toBe('2.41');
  });
});

describe('InputContainer', () => {
  it('keeps its modules and quality across a unit switch', () => {
    const original = input(volume('Fuel', 1), {
      name: 'Fuel',
      method: '2',
      quality: { Spatial: '3' },
      modules: ['3.1'],
    });
    const switched = original.switchUnit((u) =>
      mass('Fuel', u.store.toNumber()),
    );

    expect(switched.modules).toEqual(['3.1']);
    expect(switched.method).toBe('2');
    expect(switched.quality).toEqual({ Spatial: '3' });
    expect(switched.unit.__unitType).toBe('Mass');
  });

  it('is built by numberInput with its modules', () => {
    const schema = numberInput((v) => volume('Fuel', v), {
      name: 'Fuel',
      description: 'Fuel used',
      modules: ['3.1'],
    });

    expect(collectInputs(schema.parse({ value: 2 }))).toEqual([
      { name: 'Fuel', value: 2, method: '1', modules: ['3.1'], quality: {} },
    ]);
  });
});
