import type { RuleSet } from '../container.js';
import { createUnitSystem, RuleModule, UnitSystem } from '../system.js';
import { UnitError } from '../errors.js';
import { Equal, expectType } from '../test-helpers.js';
import {
  days,
  defaultDivideRules,
  defaultMultiplyRules,
  energy,
  energyRules,
  head,
  Mass,
  massPerEnergy,
  massPerHeadPerDay,
  materialRules,
  ruleModules,
} from './index.js';

const pairs = (rules: readonly { left: string; right: string }[]) =>
  rules.map((r) => `${r.left}|${r.right}`);

describe('rule modules', () => {
  test('together, the modules are exactly the default rules', () => {
    const modules = Object.values(ruleModules);
    expect(modules.flatMap((m) => m.multiply)).toHaveLength(
      defaultMultiplyRules.length,
    );
    expect(modules.flatMap((m) => m.divide)).toHaveLength(
      defaultDivideRules.length,
    );
  });

  test('no two modules handle the same pair of units, so any combination works', () => {
    const multiply = Object.values(ruleModules).flatMap((m) =>
      pairs(m.multiply),
    );
    const divide = Object.values(ruleModules).flatMap((m) => pairs(m.divide));
    expect(new Set(multiply).size).toBe(multiply.length);
    expect(new Set(divide).size).toBe(divide.length);
    // createUnitSystem throws on duplicates
    expect(() => {
      // Widened: each extend changes the system's type
      let system: UnitSystem<RuleSet> = createUnitSystem();
      for (const module of Object.values(ruleModules) as RuleModule[]) {
        system = system.extend(module) as UnitSystem<RuleSet>;
      }
    }).not.toThrow();
  });

  test('a system only has the modules it was built from', () => {
    const units = createUnitSystem(materialRules).extend(energyRules);
    const co2e = units
      .root(massPerEnergy('CO2e', 2))
      .multiply(units.root(energy(3)));
    expectType<Equal<(typeof co2e)['unit'], Mass<'CO2e'>>>(true);
    expect(co2e.unit.store.value.toNumber()).toBe(6);

    const intake = units.root(massPerHeadPerDay('DryMatter', 10));
    // @ts-expect-error livestock rules were not included
    expect(() => intake.multiply(units.root(head(5)))).toThrow(UnitError);
    // @ts-expect-error nor were time rules
    expect(() => intake.multiply(units.root(days(5)))).toThrow(UnitError);
  });
});
