# @aginnovationaustralia/calculator-units

Type-safe units and value containers for building calculators. Containers chain arithmetic like `factor.multiply(mass).multiply(num(0.5))`, and the compiler works out the resulting unit, down to the substance:

```ts
const emissions = root(massPerMass('CO2e', 'Refrigerant'), 1430).multiply(
  root(mass('Refrigerant'), 10),
);
//    ^? Container<Mass<'CO2e'>, DefaultRules>

root(massPerMass('CO2e', 'Refrigerant'), 1430).multiply(root(mass('Fuel'), 3));
// error: Type '"Fuel"' is not assignable to type '"Refrigerant"'
```

Substances, units and the rules relating them are all extensible. Start from the default set used by the AIA emissions calculators, from just the parts of it you want, or from nothing.

## Entry points

| Import                                             | Contains                                                                                                                       |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `@aginnovationaustralia/calculator-units`          | The core: containers, `createUnitSystem`, rule helpers, `RealNumber`. No units, substances or rules beyond RealNumber scaling. |
| `@aginnovationaustralia/calculator-units/defaults` | The default substances, units (`Mass`, `MassPerMass`, `Area`, …), rules, and a ready-made `defaultUnitSystem`.                 |

The package has no side effects. Importing `/defaults` only adds the default substances to the `SubstanceRegistry` type.

## Using the defaults

```ts
import {
  defaultUnitSystem,
  DefaultContainer,
  Mass,
  MassPerMass,
} from '@aginnovationaustralia/calculator-units/defaults';

const { root, num } = defaultUnitSystem;

const toCO2e = <S extends Substance>(
  gas: DefaultContainer<Mass<S>>,
  gwp: DefaultContainer<MassPerMass<'CO2e', S>>,
) => gas.multiply(gwp); // DefaultContainer<Mass<'CO2e'>>
```

## Extending the defaults

```ts
import {
  multiplyRule,
  Rule,
  RuleType,
  Substance,
  ContainerOf,
} from '@aginnovationaustralia/calculator-units';
import {
  defaultUnitSystem,
  Distance,
  Mass,
  mass,
} from '@aginnovationaustralia/calculator-units/defaults';

// 1. Substances: augment the registry (types only)
declare module '@aginnovationaustralia/calculator-units' {
  interface SubstanceRegistry {
    Diesel: true;
  }
}

// 2. Units: any object type with a __unitType
export type MassPerDistance<S extends Substance = Substance> = {
  __unitType: 'MassPerDistance';
  substance: S;
};
export const massPerDistance = <S extends Substance>(
  substance: S,
): MassPerDistance<S> => ({
  __unitType: 'MassPerDistance',
  substance,
});

// 3. Rules: a type, and a value implementing it
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

// 4. A unit system with the defaults plus your rules, and a container type for your code
export const units = defaultUnitSystem.extend({
  multiply: [massPerDistanceTimesDistance],
});
export type Container<U> = ContainerOf<typeof units, U>;
```

`extend` returns a new system and leaves the original unchanged. It throws if a new rule handles a pair of unit types that already has a rule.

## Picking parts of the defaults, or starting blank

```ts
import { createUnitSystem } from '@aginnovationaustralia/calculator-units';
import {
  massPerMassTimesMass,
  massPerAreaTimesArea,
} from '@aginnovationaustralia/calculator-units/defaults';

const some = createUnitSystem({
  multiply: [massPerMassTimesMass, massPerAreaTimesArea],
});
const blank = createUnitSystem({ multiply: [myRule], divide: [myOtherRule] });
```

If you never import `/defaults`, none of its substances, units or rules are in scope. While `SubstanceRegistry` is empty, `Substance` is `string`.

## Writing rules

A rule has two halves.

- **The type** is an interface extending `RuleType`. Its `rule` property is computed from `this['L']` (the left unit) and `this['R']` (the right unit). It evaluates to `Rule<AcceptedRight, Result>` when it applies to the left unit, and to `never` otherwise. Infer a type variable on the left and reuse it on the right to require matching substances. When the result depends on the right unit, test `this['R']`:
  ```ts
  // Mass<B> * MassPerMass<A, B> = Mass<A>
  interface MassTimesMassPerMass extends RuleType {
    rule: this['L'] extends Mass<infer B>
      ? Rule<
          MassPerMass<Substance, B>,
          this['R'] extends MassPerMass<infer A, Substance> ? Mass<A> : never
        >
      : never;
  }
  ```
- **The value** comes from `multiplyRule<Type>()(left, right, apply)` or `divideRule<Type>()(...)`. Annotate the parameter types of `apply`. Its return type is checked against the rule type, so the two halves can't disagree. Return `undefined` when the units don't line up at runtime; `whenSame(a, b, () => result)` helps with that.

Built in to every system: `L * RealNumber = L`, `RealNumber * R = R`, `L / RealNumber = L`, `L / L = RealNumber`, and `plus`/`minus` of the same unit or a RealNumber.

## Design notes

- **No global rule registry.** A container's operations are typed against the rules of the system that created it, and run with that same system's runtime rules. Types and runtime always come from the same rule values, so they can't diverge, and there's nothing to register by importing a module.
- **Mixing systems is safe.** An operation is checked and run against the left container's rules, so a container from a base system can be combined with one from an extended system in either order.
- **The only global is `SubstanceRegistry`.** It is types only. Two libraries augmenting it in one program both contribute substances, which is additive and harmless.
- **Values are `Decimal`s** (decimal.js-light), and metadata is `{ name, references }`.

## Known limitations

- If two rules accept the same left and right units, the result type is a union of both results rather than an error. At runtime, two rules for the same pair of unit types are rejected when the system is created.
- Defaults can't be overridden in place. To change one, build the system from the individual rules you want.
- Containers only record root values and binary operations. Other ways of producing a container, such as inputs, sums and switches, aren't provided yet.
