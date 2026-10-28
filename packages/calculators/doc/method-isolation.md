# Isolating method 1 vs 2 from units and containers

Status: steps 1 and 3 are implemented. Steps 2 and 4 were dropped to keep the change small. Unit factories and `switchUnit` are unchanged (see step 2), and the method containers stay in the container unions (see step 4).

## Goal

The units and containers in `src/tools/` are exported under `internal/*`, so code outside this package can build small calculations with them (see `examples/ts-client/src/units/`). Today, anyone using them has to deal with method 1 vs 2. It is built into `ValueStore`, the unit factories accept stores and seeds, and the container unions include the method containers.

After this change, someone outside the package can use units, containers and the generic inputs without knowing that method 1 vs 2 exists. Method handling stays in this repo, in the calculator input layer, `multi.ts` and output formatting. Every calculator result must stay exactly the same.

## Where method 1 vs 2 lives today

| Place | What it does |
|---|---|
| `tools/value-store.ts` | Every `ValueStore` holds a `ValueSeed` (`{ valueMethod1, valueMethod2? }` or `{ valueMethod2 }`). Each binary operation runs `applyBinary`, which merges the method 1 and 2 values of both operands. `applyMethod2()` copies the method 1 value into the method 2 slot. |
| `tools/units.ts` | Unit factories accept `number \| Decimal` (and some accept `ValueStore`), and pass them to `values()`. |
| 45 `switchUnit` call sites | Relabels pass the old store into a factory, e.g. `.switchUnit((v) => massPerHeadPerDay('CH4', v.store))`, so the method values carry over. None of them do arithmetic. |
| `tools/inputs.ts` | `method: '2'` on a number input calls `unit.store.applyMethod2()`. `method` is on `GenericInputOptions`. |
| `tools/multi.ts` | `Method1And2Container` and `Method2Container` build stores from seeds (`mergeSeeds`). |
| `tools/outputs.ts` | `output()` reads `store.seed` to fill `method`, `valueMethod1` and `valueMethod2`. |
| `tools/containers.ts` | `NumberContainer` and `Container` include `Method1And2Container` and `Method2Container`. |

Apart from these, code only reads `store.value` or `store.toNumber()`, and does arithmetic through containers.

## Design

### 1. Two value stores

**`ValueStore` (in `tools/value-store.ts`)** holds a single `Decimal`. It has no seeds and no method terms.

```ts
class ValueStore {
  constructor(readonly value: Decimal) {}
  toNumber(): number;
  multiply(other: ValueStore): ValueStore;
  divide(other: ValueStore): ValueStore;
  plus(other: ValueStore): ValueStore;
  minus(other: ValueStore): ValueStore;
  power(other: ValueStore): ValueStore;
  squared(): ValueStore;
  min(limit: Decimal): ValueStore;
  max(limit: Decimal): ValueStore;
}
```

**`MethodValueStore extends ValueStore` (new file, `tools/method-value-store.ts`)** holds the current `ValueSeed` and the current `applyBinary` logic. `value` keeps its current meaning: method 2 when present, otherwise method 1.

**Combining a plain store with a method store.** `ValueStore` has a generic extension point, and a subclass takes over when either operand is a `MethodValueStore`. `ValueStore` itself never mentions methods:

```ts
// ValueStore
protected combine(other: ValueStore, fn: (a: Decimal, b: Decimal) => Decimal) {
  return other.combineAsRight(this, fn);
}
protected combineAsRight(left: ValueStore, fn: ...) {
  return new ValueStore(fn(left.value, this.value));
}
protected map(fn: (a: Decimal) => Decimal) {
  return new ValueStore(fn(this.value));
}
```

- `MethodValueStore` overrides `combine`, `combineAsRight` and `map`. `combineAsRight` keeps the operand order, which matters for `minus`, `divide` and `power`.
- A plain `ValueStore` is treated as the seed `{ valueMethod1: value }`. This is exactly how a method-1-only value behaves in `applyBinary` today, so results don't change.
- If a `MethodValueStore` result has no method 2 track, it collapses back to a plain `ValueStore`, so a method store only exists while a method 2 value is involved.

### 2. Unit factories: unchanged

`units.ts`, `containers.ts` and every `switchUnit` call site are the same as before. Factories still accept `number | Decimal`, and the ones that did before still accept a `ValueStore`. They build their store with `values()`, which passes a store through or wraps a number in a plain `ValueStore`.

Relabels keep passing the store, e.g. `.switchUnit((v) => massPerHeadPerDay('CH4', v.store))`. A `MethodValueStore` is a `ValueStore`, so it passes through `values()` unchanged and both method values carry over. `units.ts` still only refers to the base `ValueStore`.

We tried taking `ValueStore` out of the factory parameters, with `switchUnit` carrying the store across instead. It worked, but it rewrote 47 call sites for no change in behaviour, so we reverted it to keep this change small.

### 3. Method handling only where it's needed

**Inputs.** `method` moves from `GenericInputOptions` to `TypedInputOptions`. The generic inputs never set a method. The calculator inputs already add modules with `.overwrite(...)`, and they apply the method the same way:
- For a number input with `method: '2'`, they replace the container's store with `MethodValueStore.fromMethod2Input(value)`, which is the seed `{ valueMethod1: v, valueMethod2: v }`, the same as `applyMethod2()` today.
- They set `InputContainer.method`.

`applyMethod2()` is removed from `ValueStore`.

**`multi.ts`.** `Method1And2Container` and `Method2Container` build `MethodValueStore`s. `mergeSeeds` reads each side through `seedOf(store)`.

**Reading values out.** A single helper in `method-value-store.ts` reads method values from any store:

```ts
export const seedOf = (store: ValueStore): ValueSeed =>
  store instanceof MethodValueStore ? store.seed : { valueMethod1: store.value };
```

- `outputs.ts` replaces `from.unit.store.seed` with `seedOf(from.unit.store)`.
- `totals.ts` already reads from `Output`, so it doesn't change.

### 4. Container types: not split

`Method1And2Container` and `Method2Container` stay members of `NumberContainer` and `Container`, so `captureMethod1Or2Value` returns them as they are, with no casts.

We tried two ways of taking them out of the union, and neither was worth it:
- **Casting them to `NumberContainer`** in `captureMethod1Or2Value`. The type lies about `originType`, so an exhaustive `switch` could look complete to the compiler but still receive a method container at runtime.
- **An honest wider return type.** This gives 185 type errors across 55 files. About 120 of them are calculator annotations, which are easy to widen. The rest are `tools/` APIs: arithmetic operands, `sum()`, and the child fields on container classes. Those can't name the method containers without `containers.ts` depending on `multi.ts` again.

Consumers never create method containers, so including them in the union costs nothing in practice. What keeps method 1 vs 2 out of a consumer's way is steps 1 and 3: plain stores, and generic inputs without a `method` key.

## Open questions

`outputs.ts` (`output`, `scope1Output`) reports method values by design, so it is calculator-only. Outside consumers read values straight from containers, as the ts-client example does.

1. **`InputContainer.method` and `.modules`.** Both fields are still on every `InputContainer`, including generic ones (`'1'` and `[]`). To hide them completely, a `CalculatorInputContainer extends InputContainer` would hold them, and `collectInputs` would read them from that.
2. **Hiding `method-value-store` from the `internal/*` export.** The `./internal/*` wildcard exports every file in `tools/`, including the new one. Mapping `"./internal/method-value-store": null` in `package.json` removes it from the public paths if we want that.
3. **Reading values as `Decimal` or `number`.** `ValueStore.value` stays a `Decimal`. If outside consumers should only ever see numbers, we could add a `number` getter and keep `Decimal` internal. That needs the same precision checks as the change to factory inputs.

## Verification

- **Behaviour:**
  - All calculator results must match exactly. The full Jest suite covers this, including the sheet-comparison module tests and `modules/test/method2-propagation.ts`.
  - The OpenAPI files must not change. Inputs keep the same schemas; only how they set the method changes.
- **New tests in `value-store.test.ts` / `method-value-store.test.ts`:**
  - A plain store combined with a method store, with the plain store on each side, for `minus` and `divide` where order matters.
  - A method result with no method 2 track collapses to a plain `ValueStore`.
  - `seedOf` on a plain store gives `{ valueMethod1 }`.
  - Method 2 inputs produce the same seed as `applyMethod2()` did.
- **Types and examples:**
  - `examples/ts-client` typechecks using only `internal/units`, `internal/containers` and the generic inputs, with no method terms.
  - The test files that read `seed` today (`value-store.test.ts`, `multi.test.ts`, `outputs.test.ts`, two in Cropping) switch to `seedOf`.

## Suggested order

1. Step 1. Checkpoint: all tests pass.
2. Step 3. Checkpoint: all tests pass and the OpenAPI files are unchanged.
3. Open question 1, if we want it.
