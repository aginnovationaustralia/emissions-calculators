import { root } from './containers';
import { input } from './inputs';
import { captureMethod1Or2Value, Method2Container } from './multi';
import { makeUnique, makeUniqueByName, output, scope1Output } from './outputs';
import { mass, voidUnit } from './units';

// `output`/`scope1Output` are the single choke point every calculator result flows through:
// they decide the reported gas, the CO2e conversion, and whether a result is exposed as a
// method-1 or method-2 value. Getting any of this wrong silently mis-reports real emissions.

describe('output', () => {
  it('reports method 1 only when no method 2 value is present', () => {
    const result = output('myOutput', 1, root(mass('CO2', 5)));
    expect(result.method).toBe('1');
    expect(result.valueMethod1?.toNumber()).toBe(5);
    expect(result.valueMethod2).toBeUndefined();
    expect(result.value.toNumber()).toBe(5);
    expect(result.amountKgCO2e.toNumber()).toBe(5);
    expect(result.unit.substance).toBe('CO2');
  });

  it('reports method 2 when a method-2-only value is provided', () => {
    const method2 = new Method2Container(
      input(mass('CH4', 3), { name: 'derived', modules: [] }),
    );
    const result = output('myOutput', 1, method2);
    expect(result.method).toBe('2');
    expect(result.valueMethod1).toBeUndefined();
    expect(result.valueMethod2?.toNumber()).toBe(3);
    expect(result.value.toNumber()).toBe(3);
    expect(result.amountKgCO2e.toNumber()).toBe(3 * 28);
  });

  it('reports method 2 alongside a method 1 value when both are captured', () => {
    const method1 = root(mass('N2O', 2));
    const method2 = input(mass('N2O', 5), {
      name: 'override',
      method: '2',
      modules: [],
    });
    const captured = captureMethod1Or2Value(method1, method2);
    const result = output('myOutput', 1, captured);
    expect(result.method).toBe('2');
    expect(result.valueMethod1?.toNumber()).toBe(2);
    expect(result.valueMethod2?.toNumber()).toBe(5);
    expect(result.value.toNumber()).toBe(5);
    expect(result.amountKgCO2e.toNumber()).toBe(5 * 265);
  });

  it('treats a void value as zero CO2', () => {
    const result = output('myOutput', 1, root(voidUnit()));
    expect(result.value.toNumber()).toBe(0);
    expect(result.amountKgCO2e.toNumber()).toBe(0);
    expect(result.unit.substance).toBe('CO2');
  });

  it('dedupes references and constants collected from the container tree', () => {
    const a = input(mass('CO2', 2), { name: 'A', modules: [] }).attach({
      references: ['REF-1', 'REF-1'],
    });
    const b = input(mass('CO2', 3), { name: 'A', modules: [] }); // same input name as `a`
    const result = output('myOutput', 1, a.plus(b));
    expect(result.references).toEqual(['REF-1']);
    expect(result.inputs).toHaveLength(1);
    expect(result.inputs[0]).toMatchObject({ name: 'A', value: 2 });
  });
});

describe('scope1Output', () => {
  it('exposes the gas alongside the output fields', () => {
    const result = scope1Output('entericCH4', root(mass('CH4', 4)));
    expect(result.gas).toBe('CH4');
    expect(result.unit.substance).toBe('CH4');
    expect(result.amountKgCO2e.toNumber()).toBe(4 * 28);
  });

  it('defaults the gas to CO2 for a void value', () => {
    const result = scope1Output('nothing', root(voidUnit()));
    expect(result.gas).toBe('CO2');
    expect(result.value.toNumber()).toBe(0);
  });
});

describe('makeUnique / makeUniqueByName', () => {
  it('makeUnique removes duplicate primitive values, preserving order', () => {
    expect(makeUnique(['a', 'b', 'a', 'c', 'b'])).toEqual(['a', 'b', 'c']);
  });

  it('makeUniqueByName keeps the first occurrence for each name', () => {
    const items = [
      { name: 'A', value: 1 },
      { name: 'B', value: 2 },
      { name: 'A', value: 999 },
    ];
    expect(makeUniqueByName(items)).toEqual([
      { name: 'A', value: 1 },
      { name: 'B', value: 2 },
    ]);
  });
});
