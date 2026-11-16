/*
 * The container features that don't depend on any particular units: method 1 and 2 values,
 * inputs, string and boolean containers, selection, sums and provenance.
 */
import { Decimal } from './decimal.js';
import {
  DefaultContainer,
  DefaultRules,
  defaultUnitSystem,
  Mass,
  mass,
  massPerMass,
} from './defaults/index.js';
import {
  AnyContainer,
  br,
  captureMethod1Or2Value,
  childrenOf,
  Container,
  ContainerOf,
  Method,
  MethodsOf,
  ifTrueElse,
  max,
  min,
  RealNumber,
  selectSwitch,
  sum,
  translate,
  UnitError,
  ValueStore,
  values,
  voidUnit,
} from './index.js';
import { Equal, expectType } from './test-helpers.js';

const { root, num, input, constant, select } = defaultUnitSystem;
type C<U> = DefaultContainer<U>;

const d = (n: number) => new Decimal(n);
const tracks = (c: { unit: { store: ValueStore } }) => ({
  method1: c.unit.store.valueMethod1?.toNumber(),
  method2: c.unit.store.valueMethod2?.toNumber(),
  value: c.unit.store.value.toNumber(),
});

describe('method 1 and 2 values', () => {
  test('both tracks are carried through arithmetic', () => {
    const dual = root(
      mass('CO2', new ValueStore({ valueMethod1: d(10), valueMethod2: d(20) })),
    );
    const result = dual.multiply(num(2)).plus(root(mass('CO2', 1)));
    expect(tracks(result)).toEqual({ method1: 21, method2: 41, value: 41 });
  });

  test('a method 2 input carries its value on the method 2 track', () => {
    const measured = input(mass('CO2', 7), { name: 'measured', method: '2' });
    expect(measured.origin).toEqual({ kind: 'input', method: '2' });
    expect(tracks(measured)).toEqual({ method1: 7, method2: 7, value: 7 });
    expect(measured.meta).toEqual({ name: 'measured' });
  });

  test('a method 3 or 4 input is recorded as such, on the method 2 track', () => {
    for (const method of ['3', '4'] as const) {
      const measured = input(mass('CO2', 7), { name: 'measured', method });
      expect(measured.origin).toEqual({ kind: 'input', method });
      expect(tracks(measured)).toEqual({ method1: 7, method2: 7, value: 7 });
    }
  });

  test('a method 1 input has no method 2 track', () => {
    const supplied = input(mass('CO2', 7), { name: 'supplied' });
    expect(supplied.origin).toEqual({ kind: 'input', method: '1' });
    expect(tracks(supplied)).toEqual({
      method1: 7,
      method2: undefined,
      value: 7,
    });
  });

  test('captureMethod1Or2Value keeps method 1 when there is no method 2', () => {
    const method1 = root(mass('CO2', 10));
    expect(captureMethod1Or2Value(method1, undefined)).toBe(method1);
  });

  test('captureMethod1Or2Value merges both methods', () => {
    const method1 = root(mass('CO2', 10));
    const method2 = input(mass('CO2', 12), { name: 'm2', method: '2' });
    const both = captureMethod1Or2Value(method1, method2);
    expectType<Equal<typeof both, C<Mass<'CO2'>>>>(true);
    expect(tracks(both)).toEqual({ method1: 10, method2: 12, value: 12 });
    expect(both.origin).toEqual({ kind: 'method1and2', method1, method2 });
  });

  test('captureMethod1Or2Value handles values only method 2 can calculate', () => {
    const method2 = root(mass('CO2', 12));
    const only2 = captureMethod1Or2Value(voidUnit(), method2);
    expect(tracks(only2)).toEqual({
      method1: undefined,
      method2: 12,
      value: 12,
    });
    expect(only2.origin).toEqual({ kind: 'method2', method2 });
    // Anything calculated from it is method 2 only
    expect(
      tracks(
        only2.multiply(
          root(mass('CO2', 1))
            .divide(num(1))
            .divide(root(mass('CO2', 1))),
        ),
      ),
    ).toEqual({
      method1: undefined,
      method2: 12,
      value: 12,
    });
  });

  test('min and max apply to each track', () => {
    const dual = root(
      mass('CO2', new ValueStore({ valueMethod1: d(10), valueMethod2: d(2) })),
    );
    expect(tracks(min(dual, num(5)))).toEqual({
      method1: 5,
      method2: 2,
      value: 2,
    });
    expect(tracks(max(dual, num(5)))).toEqual({
      method1: 10,
      method2: 5,
      value: 5,
    });
  });
});

describe('void', () => {
  // Void is not in any rule, so these bypass the types to check the runtime behaviour
  const voidValue = root(voidUnit());
  const co2 = root(mass('CO2', 3));

  test("is the identity for plus and minus, keeping the other side's unit", () => {
    const plusVoid = co2.plus(voidValue as never);
    expect(plusVoid.unit).toMatchObject({
      __unitType: 'Mass',
      substance: 'CO2',
    });
    expect(tracks(plusVoid).value).toBe(3);

    const voidPlus = voidValue.plus(co2 as never);
    expect(voidPlus.unit).toMatchObject({
      __unitType: 'Mass',
      substance: 'CO2',
    });
    expect(tracks(voidPlus).value).toBe(3);

    const minusVoid = co2.minus(voidValue as never);
    expect(minusVoid.unit).toMatchObject({
      __unitType: 'Mass',
      substance: 'CO2',
    });
    expect(tracks(minusVoid).value).toBe(3);
  });

  test('makes a product or quotient void', () => {
    expect(co2.multiply(voidValue as never).unit).toMatchObject({
      __unitType: 'Void',
    });
    expect(voidValue.divide(co2 as never).unit).toMatchObject({
      __unitType: 'Void',
    });
  });
});

describe('min and max', () => {
  test('limit each method track by the same track of the limit', () => {
    const value = root(mass('CO2', values(d(10), d(10))));
    const limit = root(mass('CO2', values(d(8), d(3))));
    expect(tracks(min(value, limit))).toMatchObject({ method1: 8, method2: 3 });
    expect(
      tracks(max(root(mass('CO2', values(d(1), d(1)))), limit)),
    ).toMatchObject({
      method1: 8,
      method2: 3,
    });
  });
});

describe('string and boolean containers', () => {
  const fertiliser = input<'Urea' | 'Lime'>('Urea', { name: 'fertiliser' });
  const irrigated = input(true, { name: 'irrigated' });

  test('hold their value as the unit', () => {
    expectType<Equal<typeof fertiliser, C<'Urea' | 'Lime'>>>(true);
    expect(fertiliser.unit).toBe('Urea');
    expect(irrigated.unit).toBe(true);
  });

  test('cannot be used in arithmetic', () => {
    // @ts-expect-error strings have no arithmetic
    expect(() => fertiliser.multiply(num(2))).toThrow(UnitError);
    // @ts-expect-error booleans have no arithmetic
    expect(() => irrigated.plus(num(1))).toThrow(UnitError);
    // @ts-expect-error numbers can't be multiplied by strings
    expect(() => num(2).multiply(fertiliser)).toThrow(UnitError);
  });

  test('selectSwitch picks a case by a string container', () => {
    const factor = selectSwitch(fertiliser, {
      Urea: root(massPerMass('CO2', 'Urea', 0.2)),
      Lime: root(massPerMass('CO2', 'Urea', 0.12)),
    });
    expect(tracks(factor).value).toBe(0.2);
    expect(factor.origin.kind).toBe('switch');
    expect(childrenOf(factor)[0]).toBe(fertiliser);
  });

  test('ifTrueElse picks a value by a boolean container', () => {
    const chosen = ifTrueElse(irrigated, num(1.5), num(1));
    expectType<Equal<typeof chosen, C<RealNumber>>>(true);
    expect(tracks(chosen).value).toBe(1.5);
    expect(childrenOf(chosen)).toHaveLength(3);
  });

  test('translate derives a number from a string', () => {
    const count = translate(
      {
        __unitType: 'RealNumber' as const,
        store: new ValueStore({ valueMethod1: d(3) }),
      },
      fertiliser,
    );
    expectType<Equal<typeof count, C<RealNumber>>>(true);
    expect(count.origin).toEqual({ kind: 'translation', from: fertiliser });
  });
});

describe('selection', () => {
  const COMMON = {
    name: 'COMMON',
    GWP: {
      CH4: massPerMass('CO2e', 'CH4', 28),
      N2O: massPerMass('CO2e', 'N2O', 265),
    },
  };

  test('looks up a unit by literal keys', () => {
    const gwp = select(COMMON, 'GWP', 'CH4');
    expectType<
      Equal<typeof gwp, C<ReturnType<typeof massPerMass<'CO2e', 'CH4'>>>>
    >(true);
    expect(tracks(gwp).value).toBe(28);
    expect(gwp.meta.name).toBe('COMMON[GWP.CH4]');
  });

  test('looks up a unit by a string container, which is kept as history', () => {
    const gas = input<'CH4' | 'N2O'>('N2O', { name: 'gas' });
    const gwp = select(COMMON, 'GWP', gas);
    expect(tracks(gwp).value).toBe(265);
    expect(gwp.origin).toEqual({ kind: 'selection', selectors: ['GWP', gas] });
    expect(childrenOf(gwp)).toEqual([gas]);
  });

  test('rejects keys that are not in the table, at compile time and runtime', () => {
    // @ts-expect-error no CO2 entry
    expect(() => select(COMMON, 'GWP', 'CO2')).toThrow(
      'Cannot select COMMON[GWP.CO2]: COMMON[GWP] has no entry "CO2"',
    );
    // @ts-expect-error no Fuel table
    expect(() => select(COMMON, 'Fuel', 'CO2')).toThrow(
      'Cannot select COMMON[Fuel.CO2]: COMMON has no entry "Fuel"',
    );
  });

  test('rejects a string container whose value is not in the table', () => {
    // The type allows CO2, but the table has no entry for it, as with an unexpected input value
    const gas = input<'CH4' | 'N2O'>('CO2' as 'CH4', { name: 'gas' });
    expect(() => select(COMMON, 'GWP', gas)).toThrow(UnitError);
  });

  test('rejects a path that stops at a table, not a unit', () => {
    // @ts-expect-error GWP is a table of units
    expect(() => select(COMMON, 'GWP')).toThrow(
      'Cannot select COMMON[GWP]: it is not a unit',
    );
  });
});

describe('sum', () => {
  const zeroCO2e = constant('zeroCO2e', mass('CO2e', 0));

  test('adds items of the same unit', () => {
    const total = sum([root(mass('CO2e', 1)), root(mass('CO2e', 2))], zeroCO2e);
    expectType<Equal<typeof total, C<Mass<'CO2e'>>>>(true);
    expect(tracks(total).value).toBe(3);
    expect(total.origin.kind).toBe('sum');
  });

  test('an empty sum is the fallback', () => {
    const total = sum([], zeroCO2e);
    expect(total.unit).toMatchObject({ __unitType: 'Mass', substance: 'CO2e' });
    expect(tracks(total).value).toBe(0);
  });

  test('items of different units are rejected', () => {
    const items = [root(mass('CO2e', 1)), root(mass('CH4', 1))];
    // @ts-expect-error mixed units
    expect(() => sum(items, zeroCO2e)).toThrow(UnitError);
  });
});

describe('provenance', () => {
  test('constants are named roots', () => {
    const gwp = constant('GWP_CH4', massPerMass('CO2e', 'CH4', 28));
    expect(gwp.meta.name).toBe('GWP_CH4');
    expect(gwp.origin).toEqual({ kind: 'root' });
  });

  test('br groups a value for display', () => {
    const inner = num(1).plus(num(2));
    const grouped = br(inner);
    expect(tracks(grouped).value).toBe(3);
    expect(grouped.origin).toEqual({ kind: 'bracketed', inner });
  });

  test('childrenOf walks every kind of node', () => {
    const a = num(2).named('a');
    const b = num(3).named('b');
    const names = (c: Parameters<typeof childrenOf>[0]): string[] => [
      ...(c.meta.name ? [c.meta.name] : []),
      ...childrenOf(c).flatMap(names),
    ];
    expect(names(br(a.multiply(b)).plus(a).named('total'))).toEqual([
      'total',
      'a',
      'b',
      'a',
    ]);
  });
});

/*
 * A consumer adding its own metadata, as the emissions calculators do for data quality and the
 * modules that read each input.
 */
declare module './metadata.js' {
  interface Metadata {
    quality?: { Temporal?: '1' | '2' | '3' };
    modules?: string[];
  }
}

describe('consumer metadata', () => {
  test('is accepted by inputs and kept on containers', () => {
    const area = input(mass('Lime', 3), {
      name: 'lime applied',
      quality: { Temporal: '2' },
      modules: ['3.1'],
    });
    expect(area.meta).toEqual({
      name: 'lime applied',
      quality: { Temporal: '2' },
      modules: ['3.1'],
    });
    expect(area.named('renamed').meta.quality).toEqual({ Temporal: '2' });
  });
});

describe('method width', () => {
  const twoMethods = defaultUnitSystem.withMethods('1', '2');
  type C2<U> = ContainerOf<typeof twoMethods, U>;

  test('narrows the methods of a system, its inputs and its containers', () => {
    expectType<Equal<MethodsOf<typeof twoMethods>, '1' | '2'>>(true);
    expectType<Equal<MethodsOf<typeof defaultUnitSystem>, Method>>(true);
    expect(twoMethods.methods).toEqual(['1', '2']);

    const measured = twoMethods.input(mass('CO2', 7), {
      name: 'measured',
      method: '2',
    });
    expectType<Equal<typeof measured, C2<Mass<'CO2'>>>>(true);
    if (measured.origin.kind === 'input') {
      expectType<Equal<typeof measured.origin.method, '1' | '2'>>(true);
    }
  });

  test('rejects an input for another method, at compile time and runtime', () => {
    expect(() =>
      twoMethods.input(mass('CO2', 7), {
        name: 'measured',
        // @ts-expect-error this system has no method 3
        method: '3',
      }),
    ).toThrow(
      'measured is for method 3, but this system only has methods 1, 2',
    );
  });

  test('keeps the width through arithmetic, combinators and extend', () => {
    const a = twoMethods.root(mass('CO2', 1));
    const total = sum(
      [a, a.multiply(twoMethods.num(2))],
      twoMethods.root(mass('CO2', 0)),
    );
    expectType<Equal<typeof total, C2<Mass<'CO2'>>>>(true);
    const chosen = ifTrueElse(twoMethods.root(true), a, br(a));
    expectType<Equal<typeof chosen, C2<Mass<'CO2'>>>>(true);
    expect(total.unit.store.toNumber()).toBe(3);
    expect(chosen.unit.store.toNumber()).toBe(1);

    const extended = twoMethods.extend({});
    expectType<Equal<MethodsOf<typeof extended>, '1' | '2'>>(true);
    expect(extended.methods).toEqual(['1', '2']);
  });

  test('walkers see the narrow method too', () => {
    const measured = twoMethods.input(mass('CO2', 7), {
      name: 'm',
      method: '2',
    });
    const children: AnyContainer<'1' | '2'>[] = childrenOf(
      measured.multiply(twoMethods.num(2)),
    );
    expect(children).toHaveLength(2);
  });

  test('narrow containers are still containers of every method', () => {
    const narrow: C2<Mass<'CO2'>> = twoMethods.root(mass('CO2', 1));
    const wide: Container<Mass<'CO2'>, DefaultRules> = narrow;
    expect(wide.unit.substance).toBe('CO2');
  });

  test("doesn't mix containers of different methods", () => {
    const narrow = twoMethods.root(mass('CO2', 1));
    const wide = defaultUnitSystem.root(mass('CO2', 1));
    // @ts-expect-error a system for methods 1 to 4 is not a system for methods 1 and 2
    const widened: C2<Mass<'CO2'>> = wide;
    expect(narrow.plus(widened).unit.store.toNumber()).toBe(2);
  });

  test("can't widen, or narrow to methods it doesn't have", () => {
    // @ts-expect-error method 3 isn't one of this system's methods
    expect(() => twoMethods.withMethods('3')).toThrow(UnitError);
    expect(twoMethods.withMethods('1').methods).toEqual(['1']);
  });
});
