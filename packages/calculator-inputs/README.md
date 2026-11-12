# @aginnovationaustralia/calculator-inputs

Zod schemas that validate user supplied values and turn them into input containers from [`@aginnovationaustralia/calculator-units`](../calculator-units), with clean OpenAPI output: common number constraints and named enums become shared components referenced by `$ref`.

You decide the shape of your inputs: the options each input takes, what of them is recorded on its container and emitted to OpenAPI, and what fields sit beside a number's `value`.

## Peer dependencies

`zod` (v4) and `@aginnovationaustralia/calculator-units` are peer dependencies, and your project must have exactly one copy of each:

- zod keeps schema metadata (component ids, descriptions) in a registry inside the zod module. Tools such as `zod-openapi` only see metadata registered with their own copy of zod.
- `calculator-units` recognises existing `ValueStore`s with `instanceof`.

## Setting up

```ts
import {
  createEnumRegistry,
  createInputBuilders,
} from '@aginnovationaustralia/calculator-inputs';
import { defaultUnitSystem } from '@aginnovationaustralia/calculator-units/defaults';
import { z } from 'zod';

// Named enums, each emitted once as an OpenAPI component
const { enumSchema } = createEnumRegistry({ Gas: ['CO2', 'CH4', 'N2O'] });

// Record extra metadata on input containers
declare module '@aginnovationaustralia/calculator-units' {
  interface Metadata {
    modules?: string[];
    quality?: Quality;
  }
}

export const inputs = createInputBuilders({
  system: defaultUnitSystem,
  enumSchema,
  // Describes a number input's unit, e.g. 'kilograms'. Added to its description and as `x-units`.
  displayUnit: (unitFactory, tweaker) => describe(unitFactory(1)),
  // Your options: their type is inferred from this parameter, and required on every input
  toMeta: (options: { modules: [string, ...string[]] }) => ({
    modules: options.modules,
  }),
  toOpenApi: (options) => ({ 'x-modules': options.modules }),
  // Fields beside `value` on number inputs, and what they record
  numberFields: { quality: QualitySchema.optional().default({}) },
  numberFieldsToMeta: ({ quality }) => ({ quality }),
});
```

## Building schemas

```ts
const FuelSchema = z.strictObject({
  dieselLitres: inputs.numberInput(
    (v) => volume('Fuel', v),
    { name: 'Diesel', description: 'Diesel used', modules: ['1.1'] },
    isNonNegative,
  ),
  gas: inputs.enumInput(['CO2', 'CH4'], {
    name: 'Gas',
    description: 'The gas',
    modules: ['1.1'],
  }),
  irrigated: inputs.booleanInputOptional({
    name: 'Irrigated',
    description: 'Whether irrigated',
    modules: ['6.1'],
  }),
});

FuelSchema.parse({
  dieselLitres: { value: 1200, quality: { Temporal: '2' } },
  gas: 'CO2',
});
// { dieselLitres: Container<Volume<'Fuel'>>, gas: Container<'CO2' | 'CH4'>, irrigated: undefined }
```

| Builder                                       | Accepts                                     | Returns                 |
| --------------------------------------------- | ------------------------------------------- | ----------------------- |
| `numberInput(unitFactory, options, tweaker?)` | `{ value, ...numberFields }`                | a container of the unit |
| `enumInput(values, options)`                  | one of a registered list of strings         | a string container      |
| `literalInput(value, options)`                | exactly one string (inline, not registered) | a string container      |
| `booleanInput(options)`                       | a boolean                                   | a boolean container     |

Each has an `…Optional` variant (except `literalInput`) that also accepts `undefined`. Every input takes `name`, `description` and an optional `method` (`'1'` to `'4'`) as well as your options. A number input for any method other than 1 also carries its value on the method 2 track. Inputs take the methods of the unit system you give: for fewer methods, narrow the system, e.g. `system: defaultUnitSystem.withMethods('1', '2')`, and inputs for any other method won't compile.

## Number validation

`isNonNegative`, `isPositive`, `isProportion` and `isPercentage` add validation to a number input. Constraints that match a registered number schema are emitted as a `$ref` to a shared component: `NumberInput`, `NonNegativeNumberInput`, `ProportionNumberInput`, `PercentageNumberInput`, `PositiveNumberInput` and `MinOneNumberInput` are built in. Register more with `registerNumberSchema(id, tweaker)`.

## Enums

`createEnumRegistry(namedEnums, { unregisteredHint? })` returns `enumSchema(values)`, which gives the shared schema for a registered list of values in any order. Unregistered values throw, which fails a build that generates OpenAPI specs; registering the same values under two names throws too.
