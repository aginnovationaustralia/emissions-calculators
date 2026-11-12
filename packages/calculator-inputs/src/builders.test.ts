import { Container } from '@aginnovationaustralia/calculator-units';
import {
  DefaultRules,
  defaultUnitSystem,
  Mass,
  mass,
} from '@aginnovationaustralia/calculator-units/defaults';
import { z } from 'zod';
import {
  createEnumRegistry,
  createInputBuilders,
  inlineEnumSchema,
  isNonNegative,
  isProportion,
  registerNumberSchema,
  resolveNumberSchema,
} from './index.js';
import { Equal, expectType } from './test-helpers.js';

/*
 * A consumer like the emissions calculators: inputs say which modules read them, and number inputs
 * can carry a data quality rating.
 */
declare module '@aginnovationaustralia/calculator-units' {
  interface Metadata {
    modules?: string[];
    quality?: { Temporal?: '1' | '2' };
  }
}

const Gases = ['CO2', 'CH4'] as const;
const { enumSchema } = createEnumRegistry(
  { Gas: Gases },
  { unregisteredHint: 'Add them to the test registry.' },
);

const inputs = createInputBuilders({
  system: defaultUnitSystem,
  enumSchema,
  displayUnit: (_factory, tweaker) => (tweaker === isProportion ? '0-1' : 'kg'),
  toMeta: (options: { modules: [string, ...string[]] }) => ({
    modules: options.modules,
  }),
  toOpenApi: (options) => ({ 'x-modules': options.modules }),
  numberFields: {
    quality: z
      .strictObject({ Temporal: z.enum(['1', '2']).optional() })
      .optional()
      .default({}),
  },
  numberFieldsToMeta: ({ quality }) => ({ quality }),
});

const options = {
  name: 'Fuel used',
  description: 'Fuel used',
  modules: ['1.1'] as [string],
};

type C<U> = Container<U, DefaultRules>;
const tracks = (c: C<Mass<'CO2'>>) => ({
  method1: c.unit.store.valueMethod1?.toNumber(),
  method2: c.unit.store.valueMethod2?.toNumber(),
});

describe('numberInput', () => {
  const schema = inputs.numberInput((v) => mass('CO2', v), options);

  test('builds an input container from the value and extra fields', () => {
    const container = schema.parse({ value: 5, quality: { Temporal: '2' } });
    expectType<Equal<typeof container, C<Mass<'CO2'>>>>(true);
    expect(container.unit.store.value.toNumber()).toBe(5);
    expect(container.origin).toEqual({ kind: 'input', method: '1' });
    expect(container.meta).toEqual({
      name: 'Fuel used',
      modules: ['1.1'],
      quality: { Temporal: '2' },
    });
  });

  test('defaults the extra fields', () => {
    expect(schema.parse({ value: 5 }).meta.quality).toEqual({});
  });

  test('rejects unknown fields and non-numbers', () => {
    expect(() => schema.parse({ value: 5, other: 1 })).toThrow();
    expect(() => schema.parse({ value: '5' })).toThrow();
  });

  test('applies number validation', () => {
    const nonNegative = inputs.numberInput(
      (v) => mass('CO2', v),
      options,
      isNonNegative,
    );
    expect(() => nonNegative.parse({ value: -1 })).toThrow();
    expect(nonNegative.parse({ value: 0 }).unit.store.value.toNumber()).toBe(0);
  });

  test('a method 2 input carries its value as method 2', () => {
    const method2 = inputs.numberInput((v) => mass('CO2', v), {
      ...options,
      method: '2',
    });
    expect(tracks(method2.parse({ value: 7 }))).toEqual({
      method1: 7,
      method2: 7,
    });
  });

  test('describes the input with its units and the consumer tags', () => {
    expect(schema.meta()).toEqual({
      description: 'Fuel used (kg)',
      'x-modules': ['1.1'],
    });
    const proportion = inputs.numberInput(
      (v) => mass('CO2', v),
      options,
      isProportion,
    );
    expect(proportion.meta()?.description).toBe('Fuel used (0-1)');
  });

  test('gives the display unit the input options', () => {
    // A consumer whose inputs state the units they are supplied in, e.g. tonnes stored as kg
    const stated = createInputBuilders({
      system: defaultUnitSystem,
      enumSchema,
      displayUnit: (_factory, _tweaker, { units }) => units,
      toMeta: (_options: { units: string }) => ({}),
    });
    const tonnes = stated.numberInput((t) => mass('CO2', t * 1000), {
      name: 'Fuel used',
      description: 'Fuel used',
      units: 't',
    });
    expect(tonnes.meta()?.description).toBe('Fuel used (t)');
    // With no extra fields, the wire form is just `{ value }`
    expectType<Equal<z.input<typeof tonnes>, { value: number }>>(true);
    expect(() => tonnes.parse({ value: 1, quality: {} })).toThrow();
    expect(
      stated
        .numberInputOptional((t) => mass('CO2', t * 1000), {
          name: 'Fuel used',
          description: 'Fuel used',
          units: 't',
        })
        .meta()?.description,
    ).toBe('Fuel used (t)');
  });

  test('requires the consumer options', () => {
    // @ts-expect-error modules is missing
    inputs.numberInput((v) => mass('CO2', v), { name: 'x', description: 'x' });
  });

  test('the optional variant passes undefined through', () => {
    const optional = inputs.numberInputOptional((v) => mass('CO2', v), options);
    expect(optional.parse(undefined)).toBeUndefined();
    expect(optional.parse({ value: 2 })?.unit.store.value.toNumber()).toBe(2);
  });
});

describe('number schemas', () => {
  test('common constraints resolve to shared components', () => {
    expect(resolveNumberSchema().meta()?.id).toBe('NumberInput');
    expect(resolveNumberSchema(isNonNegative).meta()?.id).toBe(
      'NonNegativeNumberInput',
    );
    expect(resolveNumberSchema(isProportion).meta()?.id).toBe(
      'ProportionNumberInput',
    );
  });

  test('other constraints are inline', () => {
    expect(resolveNumberSchema((s) => s.max(7)).meta()?.id).toBeUndefined();
  });

  test('consumers can register more', () => {
    registerNumberSchema('UpToTenNumberInput', (s) => s.min(0).max(10));
    expect(resolveNumberSchema((s) => s.min(0).max(10)).meta()?.id).toBe(
      'UpToTenNumberInput',
    );
  });
});

describe('enums', () => {
  test('a registered enum is shared, whatever the order of its values', () => {
    const schema = enumSchema(Gases);
    expect(schema.meta()?.id).toBe('Gas');
    expect(enumSchema([...Gases].reverse())).toBe(schema);
  });

  test('unregistered values throw, with the hint', () => {
    expect(() => enumSchema(['CO2'])).toThrow(
      'are not registered. Add them to the test registry.',
    );
  });

  test('two names for the same values are rejected', () => {
    expect(() => createEnumRegistry({ A: ['x'], B: ['x'] })).toThrow(
      'Enums A and B have the same values',
    );
  });

  test('inline enums accept any values, without a component id', () => {
    const schema = inlineEnumSchema(['x', 'y'] as const);
    expect(schema.parse('x')).toBe('x');
    expect(schema.meta()?.id).toBeUndefined();
    const inline = createInputBuilders({
      system: defaultUnitSystem,
      enumSchema: inlineEnumSchema,
      displayUnit: () => 'kg',
    });
    const picked = inline
      .enumInput(['x', 'y'] as const, { name: 'Pick', description: 'Pick' })
      .parse('y');
    expectType<Equal<typeof picked, C<'x' | 'y'>>>(true);
    expect(picked.unit).toBe('y');
  });

  test('enumInput builds a string input container', () => {
    const gas = inputs.enumInput(Gases, options).parse('CH4');
    expectType<Equal<typeof gas, C<'CO2' | 'CH4'>>>(true);
    expect(gas.unit).toBe('CH4');
    expect(gas.meta).toEqual({ name: 'Fuel used', modules: ['1.1'] });
    expect(() => inputs.enumInput(Gases, options).parse('N2O')).toThrow();
    expect(
      inputs.enumInputOptional(Gases, options).parse(undefined),
    ).toBeUndefined();
  });
});

describe('literals and booleans', () => {
  test('literalInput accepts exactly one value', () => {
    const schema = inputs.literalInput('Cotton', options);
    expect(schema.parse('Cotton').unit).toBe('Cotton');
    expect(() => schema.parse('Wheat')).toThrow();
  });

  test('booleanInput builds a boolean input container', () => {
    const flag = inputs.booleanInput(options).parse(true);
    expectType<Equal<typeof flag, C<boolean>>>(true);
    expect(flag.unit).toBe(true);
    expect(inputs.booleanInputOptional(options).parse(undefined)).toBe(
      undefined,
    );
  });
});
