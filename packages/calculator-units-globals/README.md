# @aginnovationaustralia/calculator-units-globals

The same units, containers and default rules as [`@aginnovationaustralia/calculator-units`](../calculator-units), built on global registries instead of explicit unit systems. It exists to compare the developer experience of the two designs. Prefer `calculator-units` unless that comparison says otherwise.

## How it differs

|                              | `calculator-units`                                    | `calculator-units-globals`                                                                                 |
| ---------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Rules                        | Values passed to `createUnitSystem` / `extend`        | `MultiplyRules<L, R>` / `DivideRules<L, R>` interface augmentation, plus `defineMultiply` / `defineDivide` |
| Units                        | Any object type with a `__unitType`                   | Must also be added to `UnitRegistry`                                                                       |
| Containers                   | `Container<U, Rules>`, created by a system's `root`   | `Container<U>`, created by the global `root`                                                               |
| Rule syntax                  | `this['L']`, `this['R']`, `multiplyRule<Type>()(...)` | `L`, `R`, `defineMultiply('A', 'B', (l, r) => ...)`                                                        |
| Picking some of the defaults | Yes                                                   | No: `/defaults` is all or nothing                                                                          |
| Side effects                 | None                                                  | Importing `/defaults` or your own rules module registers rules                                             |

## Usage

```ts
import {
  defineMultiply,
  Rule,
  root,
  Substance,
} from '@aginnovationaustralia/calculator-units-globals';
import {
  Distance,
  Mass,
  mass,
} from '@aginnovationaustralia/calculator-units-globals/defaults';

type MassPerDistance<S extends Substance = Substance> = {
  __unitType: 'MassPerDistance';
  substance: S;
};

declare module '@aginnovationaustralia/calculator-units-globals' {
  interface SubstanceRegistry {
    Diesel: true;
  }
  interface UnitRegistry {
    MassPerDistance: MassPerDistance;
  }
  interface MultiplyRules<L, R> {
    // MassPerDistance<S> * Distance = Mass<S>
    massPerDistanceTimesDistance: L extends MassPerDistance<infer S>
      ? Rule<Distance, Mass<S>>
      : never;
  }
}

defineMultiply('MassPerDistance', 'Distance', (l) => mass(l.substance));
```

## Known problems

These are inherent to the design and are the reason `calculator-units` exists.

1. **Types and runtime can disagree.** Augmentations apply to the whole TypeScript program, but a runtime rule only exists once its module has been imported somewhere in the process. Code can typecheck and then throw a `UnitError`, depending on import order elsewhere.
2. **Side effects and global state.** Rules register by side-effect import into one registry per loaded copy of the package. Registering a pair again silently replaces the rule for every container in the process. `package.json` marks `dist/defaults` as having side effects so bundlers keep it.
3. **One unit system per program.** Everything that augments the registries shares them. Rule property names must be unique across the program, and defaults can't be left out.
4. **Duplicate installs split the registry.** Two copies of the package each have their own registries.
