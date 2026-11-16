import { defaultUnitSystem } from '@aginnovationaustralia/calculator-units/defaults';
import { Container, units } from './containers';
import { input } from './inputs';
import { mass, Mass } from './units';

describe('VEERG containers', () => {
  test('inputs are for method 1 or 2 only', () => {
    const measured = input(mass('CO2', 7), {
      name: 'measured',
      method: '2',
      modules: ['10.1'],
    });
    expect(measured.origin).toEqual({ kind: 'input', method: '2' });
    if (measured.origin.kind === 'input') {
      const method: '1' | '2' = measured.origin.method;
      expect(method).toBe('2');
    }

    expect(() =>
      units.input(mass('CO2', 7), {
        name: 'measured',
        // @ts-expect-error VEERG has no method 3
        method: '3',
      }),
    ).toThrow('only has methods 1, 2');
  });

  test("containers from a system with other methods aren't VEERG containers", () => {
    const wide = defaultUnitSystem.root(mass('CO2', 1));
    // @ts-expect-error a container for methods 1 to 4
    const veerg: Container<Mass<'CO2'>> = wide;
    expect(veerg.unit.substance).toBe('CO2');
  });
});
