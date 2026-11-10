import { num, root } from './containers';
import { ifTrueElse, IfElseContainer } from './if-else';
import { input } from './inputs';
import { mass } from './units';

// `ifTrueElse` is the core conditional-branching primitive used throughout the calculators
// (e.g. selecting a factor by state, method, or livestock class). Picking the wrong branch, or
// evaluating both eagerly in a way that leaks the unselected branch's unit, would be a silent
// correctness bug.

describe('ifTrueElse', () => {
  it('selects the whenTrue branch when the condition is true', () => {
    const condition = input(true, { name: 'flag', modules: [] });
    const whenTrue = root(mass('CO2', 1)).named('true branch');
    const whenFalse = root(mass('CO2', 2)).named('false branch');

    const result = ifTrueElse(condition, whenTrue, whenFalse);

    expect(result).toBeInstanceOf(IfElseContainer);
    expect(result.originType).toBe('if_else');
    expect(result.selected).toBe(whenTrue);
    expect(result.unit.store.toNumber()).toBe(1);
  });

  it('selects the whenFalse branch when the condition is false', () => {
    const condition = input(false, { name: 'flag', modules: [] });
    const whenTrue = root(mass('CO2', 1));
    const whenFalse = root(mass('CO2', 2));

    const result = ifTrueElse(condition, whenTrue, whenFalse);

    expect(result.selected).toBe(whenFalse);
    expect(result.unit.store.toNumber()).toBe(2);
  });

  it('retains both branches for provenance regardless of which is selected', () => {
    const condition = input(true, { name: 'flag', modules: [] });
    const whenTrue = num(1);
    const whenFalse = num(2);

    const result = ifTrueElse(condition, whenTrue, whenFalse);

    expect(result.whenTrue).toBe(whenTrue);
    expect(result.whenFalse).toBe(whenFalse);
    expect(result.condition).toBe(condition);
  });

  it('switchUnit converts the selected/whenTrue/whenFalse branches consistently', () => {
    const condition = input(true, { name: 'flag', modules: [] });
    const whenTrue = root(mass('CO2', 3));
    const whenFalse = root(mass('CO2', 4));
    const branch = ifTrueElse(condition, whenTrue, whenFalse);

    const switched = branch.switchUnit((u) => ({ ...u, __unitType: 'RealNumber' as const }));

    expect(switched).toBeInstanceOf(IfElseContainer);
    expect(switched.unit.__unitType).toBe('RealNumber');
    expect(switched.unit.store.toNumber()).toBe(3);
  });
});
