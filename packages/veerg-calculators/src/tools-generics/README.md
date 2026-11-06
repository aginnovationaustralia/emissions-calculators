# tools-generics (prototype)

Extensible units and containers using plain TypeScript generics and declaration merging. No build step.

## How it works

- **Substances** are the keys of `SubstanceRegistry` and **units** are the values of `UnitRegistry` (`substances.ts`, `units.ts`). Both are interfaces, so consumers extend them with `declare module`.
- **Rules** are properties of the `MultiplyRules<L, R>` and `DivideRules<L, R>` interfaces (`rules.ts`). Each property is a conditional type that evaluates to `Rule<AcceptedRight, Result>` when it applies to `L`, and to `never` when it doesn't:
  ```ts
  // MassPerMass<A, B> * Mass<B> = Mass<A>
  massPerMassByMass: L extends MassPerMass<infer A, infer B> ? Rule<Mass<B>, Mass<A>> : never;
  ```
- **`Container<U>`** (`container.ts`) is a small interface with one signature per operation:
  ```ts
  multiply<R extends MultiplyRight<U, R>>(right: Container<R>): Container<MultiplyResult<U, R>>;
  ```
  `MultiplyRight` is the union of right-hand units that any rule accepts for `U`, and `MultiplyResult` is the result of the rule that matched. Calculation code depends only on this interface. It doesn't grow as rules are added.
- **Runtime rules** are registered with `defineMultiply` / `defineDivide`. Their callbacks must return `MultiplyResult` of the two units, so registering a runtime rule without a type rule won't compile.
- `default-rules.ts` ports every existing overload. It uses the same augmentation mechanism a consumer would, and `example/consumer-units.ts` shows a consumer adding substances, a unit and rules.

## What it gets right

- Error messages name the exact mismatch: `Type '"Fuel"' is not assignable to type '"Refrigerant"'`.
- Results stay specific through generic helpers: `<S>(m: Container<Mass<S>>, ef: Container<MassPerMass<'CO2e', S>>) => ef.multiply(m)` returns `Container<Mass<'CO2e'>>`.
- Consumers can extend it through the package entry point (`declare module '@pkg'`), not only the internal file paths.

## Rough edges

- Augmentations must declare exactly `<L, R>`, even when a rule doesn't use `R` (lint needs a disable).
- The rule syntax (conditional types with `infer`) is harder to read than the overloads were.
- A type rule with no runtime rule is only caught at runtime, as a `UnitError`. A runtime rule with no type rule gives a cryptic `not assignable to type 'undefined'`.
- Augmentation is global to a TypeScript program, so two unit systems can't coexist in one compilation.
