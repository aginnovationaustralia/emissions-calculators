import { collectConstants, collectInputs, collectReferences } from './collect';
import { br, num } from './containers';
import { selectConstant } from './constants';
import { ifTrueElse } from './if-else';
import { input } from './inputs';
import { captureMethod1Or2Value } from './multi';
import { selectSwitch } from './switch';
import { sum } from './sum';
import { mass, realNumber } from './units';
import { zero } from './sentinels';

// These tree-walkers back every calculator's `output()` provenance (references/constants/
// inputs shown to end users), and they dispatch on `originType` with no default case. A branch
// silently missing a container kind, or double-visiting one, would corrupt that provenance
// without ever failing a calculation.

describe('collectReferences', () => {
  it('returns [] for an undefined container', () => {
    expect(collectReferences(undefined)).toEqual([]);
  });

  it('returns [] when nothing in the tree carries references', () => {
    expect(collectReferences(num(5))).toEqual([]);
  });

  it('collects references attached directly to a node', () => {
    const withRef = num(5).attach({ references: ['REF-A'] });
    expect(collectReferences(withRef)).toEqual(['REF-A']);
  });

  it('collects references from both sides of a binary node', () => {
    const left = num(2).attach({ references: ['REF-A'] });
    const right = num(3).attach({ references: ['REF-B'] });
    expect(collectReferences(left.multiply(right))).toEqual(['REF-A', 'REF-B']);
  });

  it('passes through a bracketed node', () => {
    const inner = num(2).attach({ references: ['REF-A'] });
    expect(collectReferences(br(inner))).toEqual(['REF-A']);
  });

  it('collects references from every item in a sum', () => {
    const items = [
      num(1).attach({ references: ['REF-A'] }),
      num(2).attach({ references: ['REF-B'] }),
      num(3),
    ];
    expect(collectReferences(sum(items, zero))).toEqual(['REF-A', 'REF-B']);
  });

  it('only visits the method-2 branch of a method1and2 node when method 2 is present', () => {
    const method1 = num(10).attach({ references: ['METHOD-1'] });
    const method2 = input(realNumber(20), {
      name: 'm2',
      method: '2',
      modules: [],
    }).attach({
      references: ['METHOD-2'],
    });
    const captured = captureMethod1Or2Value(method1, method2);
    expect(collectReferences(captured)).toEqual(['METHOD-2']);
  });

  it('falls back to the method-1 branch when method 2 is absent', () => {
    const method1 = num(10).attach({ references: ['METHOD-1'] });
    const captured = captureMethod1Or2Value(method1, undefined);
    expect(collectReferences(captured)).toEqual(['METHOD-1']);
  });

  it('collects the subject and selected branches of a switch node', () => {
    const subject = input('A' as const, {
      name: 'subject',
      modules: [],
    }).attach({
      references: ['SUBJECT-REF'],
    });
    const cases = {
      A: num(1).attach({ references: ['CASE-A'] }),
      B: num(2).attach({ references: ['CASE-B'] }),
    };
    const selected = selectSwitch(subject, cases);
    // Only the selected case's references should show up, not the unselected case's.
    expect(collectReferences(selected)).toEqual(['SUBJECT-REF', 'CASE-A']);
  });

  it('collects the condition and selected branches of an if_else node, not the unselected one', () => {
    const condition = input(true, { name: 'flag', modules: [] }).attach({
      references: ['COND-REF'],
    });
    const whenTrue = num(1).attach({ references: ['TRUE-REF'] });
    const whenFalse = num(2).attach({ references: ['FALSE-REF'] });
    const branch = ifTrueElse(condition, whenTrue, whenFalse);

    expect(collectReferences(branch)).toEqual(['COND-REF', 'TRUE-REF']);
  });
});

describe('collectConstants', () => {
  const testConstants = {
    name: 'TestConstants',
    FACTOR: mass('CO2', 5),
  };

  it('returns [] for an undefined container', () => {
    expect(collectConstants(undefined)).toEqual([]);
  });

  it('returns [] when nothing in the tree is a constant selection', () => {
    expect(collectConstants(num(5))).toEqual([]);
  });

  it('collects a constant_selection node with its name, value and formatted units', () => {
    const constant = selectConstant(testConstants, 'FACTOR');
    expect(collectConstants(constant)).toEqual([
      { name: 'TestConstants[FACTOR]', value: 5, units: 'Mass(CO2)' },
    ]);
  });

  it('collects nested constant selections through a binary node', () => {
    const constant = selectConstant(testConstants, 'FACTOR');
    const result = num(2).multiply(constant);
    expect(collectConstants(result)).toEqual([
      { name: 'TestConstants[FACTOR]', value: 5, units: 'Mass(CO2)' },
    ]);
  });
});

describe('collectInputs', () => {
  it('returns [] for an undefined container', () => {
    expect(collectInputs(undefined)).toEqual([]);
  });

  it('returns [] for a root container (not an input)', () => {
    expect(collectInputs(num(5))).toEqual([]);
  });

  it('collects a numeric input, resolving the value via the store', () => {
    const container = input(mass('CO2', 5), { name: 'my number', modules: [] });
    expect(collectInputs(container)).toEqual([
      { name: 'my number', value: 5, method: '1', modules: [] },
    ]);
  });

  it('collects a string input, using the raw string value', () => {
    const container = input('A' as const, {
      name: 'my string',
      method: '2',
      modules: [],
    });
    expect(collectInputs(container)).toEqual([
      { name: 'my string', value: 'A', method: '2', modules: [] },
    ]);
  });

  it('collects a boolean input, using the raw boolean value', () => {
    const container = input(true, { name: 'my flag', modules: [] });
    expect(collectInputs(container)).toEqual([
      { name: 'my flag', value: true, method: '1', modules: [] },
    ]);
  });

  it('collects multiple inputs nested through a binary node', () => {
    const a = input(mass('CO2', 2), { name: 'A', modules: [] });
    const b = input(realNumber(3), { name: 'B', modules: [] });
    expect(collectInputs(a.multiply(b))).toEqual([
      { name: 'A', value: 2, method: '1', modules: [] },
      { name: 'B', value: 3, method: '1', modules: [] },
    ]);
  });
});
