/*
 * The container features that don't depend on any particular units: method 1 and 2 values,
 * inputs, string and boolean containers, selection, sums and provenance.
 */
import Decimal from 'decimal.js-light';
import {
  DefaultContainer,
  defaultUnitSystem,
  Mass,
  mass,
  massPerMass,
} from './defaults/index.js';
import {
  br,
  captureMethod1Or2Value,
  childrenOf,
  ifTrueElse,
  max,
  min,
  RealNumber,
  selectSwitch,
  sum,
  translate,
  UnitError,
  ValueStore,
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

  test('rejects keys that are not in the table', () => {
    // @ts-expect-error no CO2 entry
    select(COMMON, 'GWP', 'CO2');
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
    const total = sum([] as C<Mass<'CO2e'>>[], zeroCO2e);
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
