# @aginnovationaustralia/calculator-units

Type-safe units and value containers for building calculators. Containers chain arithmetic like `factor.multiply(mass).multiply(num(0.5))`, the compiler works out the resulting unit down to the substance, and every container records how its value was calculated.

```ts
const emissions = root(massPerMass('CO2e', 'Refrigerant', 1430)).multiply(
  root(mass('Refrigerant', 10)),
);
//    ^? Container<Mass<'CO2e'>, DefaultRules>, holding 14300

root(massPerMass('CO2e', 'Refrigerant', 1430)).multiply(root(mass('Fuel', 3)));
// error: Type '"Fuel"' is not assignable to type '"Refrigerant"'
```

Substances, units and the rules relating them are all extensible. Start from the default set used by the AIA emissions calculators, from just the parts of it you want, or from nothing.

## Entry points

| Import                                             | Contains                                                                                                                                                              |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@aginnovationaustralia/calculator-units`          | The core: containers, unit systems, rule helpers, method 1/2 values, string and boolean units, `RealNumber`. No units, substances or rules beyond RealNumber scaling. |
| `@aginnovationaustralia/calculator-units/defaults` | The default substances, units (`Mass`, `MassPerMass`, `Area`, …), rules, a ready-made `defaultUnitSystem`, and `relabelMass`.                                         |

The package has no side effects. Importing `/defaults` only adds the default substances to the `SubstanceRegistry` type.

## Units and values

A number unit is a descriptor plus its value: `{ __unitType: 'Mass', substance: 'CO2', store }`. Unit constructors take an optional initial value, e.g. `mass('CO2', 5)`. Rules only look at the descriptor; operations calculate the result's `store`.

The store is a `ValueStore`, which tracks two values:

- **method 1**, the default calculation;
- **method 2**, an optional alternative, e.g. calculated from more specific data the user supplied.

Every operation combines both tracks, so a method 2 value supplied anywhere carries through to the results. `store.value` is the method 2 value where there is one, otherwise method 1.

String and boolean units are the values themselves: a `Container<'Urea' | 'Lime', RS>` holds `'Urea'`. They can be used to choose values (`selectSwitch`, `ifTrueElse`, `select`) but not in arithmetic, which the compiler rejects.

## Creating containers

Through a unit system (`defaultUnitSystem`, or one you build):

| Method                                    | Creates                                                                                                                                               |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `root(unit, meta?)`                       | A value with no history.                                                                                                                              |
| `num(value, meta?)`                       | A `RealNumber`.                                                                                                                                       |
| `constant(name, unit, meta?)`             | A named root, e.g. a published factor.                                                                                                                |
| `input(unit, { name, method?, ...meta })` | A user supplied value. A method 2 input carries its value on the method 2 track.                                                                      |
| `select(table, key1, …key5)`              | A unit looked up from a nested table. Keys can be literals or string containers. Named after the table's `name` and the keys, e.g. `COMMON[GWP.CH4]`. |

## Operations

On any number container:

| Operation                           | Result                                                                                 |
| ----------------------------------- | -------------------------------------------------------------------------------------- |
| `multiply`, `divide`                | The unit a rule gives for the pair, checked at compile time and runtime.               |
| `plus`, `minus`                     | The same unit; both sides must match, or one is a `RealNumber`.                        |
| `power(realNumber)`                 | A `RealNumber`.                                                                        |
| `squared()`                         | The same unit (not squared), matching existing calculations.                           |
| `min(limit)`, `max(limit)`          | The same unit, limited per method track by a value of the same unit or a `RealNumber`. |
| `switchUnit(u => newUnit(u.store))` | The same value and history in another unit, for relationships no rule describes.       |
| `named`, `reference`, `attach`      | The same container with extra metadata.                                                |

And as functions, which take the unit system from the containers given:

| Function                                     | Purpose                                                                                                                 |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `sum(items, zero)`                           | Adds containers of one unit. `zero` is the result for an empty list. Mixed units don't compile.                         |
| `captureMethod1Or2Value(m1, m2)`             | Merges a method 1 value with an optional method 2 value. Pass `voidUnit()` as `m1` when only method 2 can calculate it. |
| `selectSwitch(subject, cases)`               | Picks a case by a string container.                                                                                     |
| `ifTrueElse(condition, whenTrue, whenFalse)` | Picks a value by a boolean container.                                                                                   |
| `translate(unit, from)`                      | A value in a new unit, recorded as derived from `from`.                                                                 |
| `br(inner)`                                  | The same value, grouped for display.                                                                                    |
| `min`, `max`, `multiplyAllValuesBy`          | Conveniences.                                                                                                           |

## Provenance

Every container has an `origin` saying how it was made (`root`, `input`, `binary`, `sum`, `selection`, `bracketed`, `translation`, `method1and2`, `method2`, `switch` or `if_else`), and `meta` with its name and references. `childrenOf(container)` returns the containers it was calculated from, for walking a calculation to report inputs, constants, references or formulas. `AnyContainer` is the type for that kind of code.

`Metadata` is an interface consumers can extend, like `SubstanceRegistry`:

```ts
declare module '@aginnovationaustralia/calculator-units' {
  interface Metadata {
    quality?: QualityTable;
  }
}
```

## Unit systems

```ts
import {
  defaultUnitSystem,
  DefaultContainer,
} from '@aginnovationaustralia/calculator-units/defaults';

const { root, num, input, select } = defaultUnitSystem;
```

A system's containers can only do what its rules allow, at compile time and at runtime. There is no global rule registry. You can:

- use `defaultUnitSystem` as it is, with `DefaultContainer<U>`;
- extend it: `defaultUnitSystem.extend({ multiply: [myRule], divide: [...] })`, which throws if a new rule handles a pair of unit types that already has one;
- pick individual default rules: `createUnitSystem({ multiply: [massPerMassTimesMass, ...] })`;
- start blank: `createUnitSystem()`, without importing `/defaults`. While `SubstanceRegistry` is empty, `Substance` is `string`.

For a project's own system, name its rule set so types and errors stay short:

```ts
const extended = defaultUnitSystem.extend({
  multiply: [massPerDistanceTimesDistance],
});
export interface FarmRules extends RuleSetOf<typeof extended> {}
export const units: UnitSystem<FarmRules> = extended;
export type Container<U> = BaseContainer<U, FarmRules>;
```

## Adding substances, units and rules

```ts
import {
  multiplyRule,
  Rule,
  RuleType,
  Substance,
  values,
  ValueStore,
  InitialValue,
} from '@aginnovationaustralia/calculator-units';
import {
  Distance,
  Mass,
  mass,
} from '@aginnovationaustralia/calculator-units/defaults';

// Substances: augment the registry (types only)
declare module '@aginnovationaustralia/calculator-units' {
  interface SubstanceRegistry {
    Diesel: true;
  }
}

// Units: a descriptor with a __unitType, plus a store
export type MassPerDistance<S extends Substance = Substance> = {
  __unitType: 'MassPerDistance';
  substance: S;
  store: ValueStore;
};
export const massPerDistance = <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
): MassPerDistance<S> => ({
  __unitType: 'MassPerDistance',
  substance,
  store: values(initialValue),
});

// Rules: a type, and a value implementing it
// MassPerDistance<S> * Distance = Mass<S>
interface MassPerDistanceTimesDistance extends RuleType {
  rule: this['L'] extends MassPerDistance<infer S>
    ? Rule<Distance, Mass<S>>
    : never;
}
const massPerDistanceTimesDistance =
  multiplyRule<MassPerDistanceTimesDistance>()(
    'MassPerDistance',
    'Distance',
    (l: MassPerDistance, _r: Distance) => mass(l.substance),
  );
```

A rule's type is an interface extending `RuleType`, whose `rule` is computed from `this['L']` and `this['R']`. It evaluates to `Rule<AcceptedRight, Result>` when it applies to the left unit, and to `never` otherwise. Reuse an inferred substance on the right to require matching substances.

A rule's value comes from `multiplyRule<Type>()(left, right, apply)` or `divideRule`. `apply` only builds the result's descriptor (its store is replaced with the calculated value), and its return type is checked against the rule type. Return `undefined` when the units don't line up at runtime; `whenSame(a, b, () => result)` helps.

Built in to every system: `L * RealNumber = L`, `RealNumber * R = R`, `L / RealNumber = L`, `L / L = RealNumber`, and `plus`/`minus` of the same unit or a RealNumber.

## Migrating from the calculators' `tools`

| `tools`                                                   | This package                                                                            |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `Container<U>`, `NumberContainer<U>`, `TypedContainer<U>` | `Container<U, Rules>`, usually through a project alias                                  |
| `BaseContainer` subclasses and `originType`               | One container type; `origin.kind`                                                       |
| `container.core`                                          | `container.meta`                                                                        |
| `container.left`, `.from`, `.inner`, …                    | `container.origin.left`, …, or `childrenOf(container)`                                  |
| `root(unit, meta)`, `num`, `constant`                     | `units.root`, `units.num`, `units.constant`                                             |
| `input(unit, options)`                                    | `units.input(unit, options)`; extra fields such as `modules` and `quality` go to `meta` |
| `selectConstant(constants, …keys)`                        | `units.select(constants, …keys)`                                                        |
| `Method1And2Container`, `Method2Container`                | `captureMethod1Or2Value`, with `origin.kind` of `method1and2` / `method2`               |
| `NumberUnit` (union of all units)                         | `DefaultNumberUnit`; `NumberUnit` is now the base shape of any number unit              |
| `switchUnit` on each container class                      | `switchUnit` keeps the history; children aren't converted                               |

Unit constructors, `ValueStore`, `values`, `percentage`, `voidUnit`, `sum`, `br`, `translate`, `relabelMass`, `selectSwitch`, `ifTrueElse`, `min` and `max` keep their names and arguments.

## Known limitations

- If two rules accept the same left and right units, the result type is a union of both results rather than an error. At runtime, two rules for the same pair of unit types are rejected when the system is created.
- Defaults can't be overridden in place. To change one, build the system from the individual rules you want.
- Unit equality ignores values but compares every other field, so `plus` of two masses of different substances is rejected at runtime as well as at compile time.
