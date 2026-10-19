# emissions-calculator-research

Run the emissions calculators with custom values that override the constants defined in
`@aginnovationaustralia/emissions-calculators`. This is intended for research use, and is the only way to run a calculator with overridden constants.

Results produced with overridden constants are not aligned with any official guidance, and should only be used for research and sensitivity analysis.

## Installation

```bash
npm install @aginnovationaustralia/emissions-calculators @aginnovationaustralia/emissions-calculator-research
```

The calculators package provides the input schemas, which are used to validate and transform inputs
before they are passed to a calculator.

## Usage

```ts
import { CroppingInputSchema } from '@aginnovationaustralia/emissions-calculators';
import {
  calculateCropping,
  executeCalculator,
  ResearchEnvironment,
} from '@aginnovationaustralia/emissions-calculator-research';

const input = CroppingInputSchema.parse(rawInput);

const options: ResearchCalculatorOptions = {
  overrides: {
    COMMON: {
      TRANSPORT_FUEL_FACTORS: {
        'Cars and light commercial vehicles': {
          'Diesel oil': { SCOPE1_EF: { CO2: 0.00007 } },
        },
      },
    },
  },
}

const result = executeCalculator(calculateCropping, input, 'cropping', options)
```

Override values are plain numbers, written directly into the constant's value store, so they must
be expressed in the constant's storage units. Overrides that do not match the shape of the
constants are skipped, and a warning is logged.

Each calculator in this package (`calculateBeef`, `calculateGrains`, `calculateHorticulture`, ...)
takes a validated and transformed input, which is the output of the matching `*InputSchema.parse()`.
Pass the calculator name that matches the calculator to `executeCalculator`.

A complete example is available in the [ts-client example](../../examples/ts-client/src/grains/research-overrides.ts).

## Versioning

This package depends on the exact version of `@aginnovationaustralia/emissions-calculators` that it was
published with, as it is built on internal APIs of that package.

## Data and metrics collection

Calculator executions are tracked in the same way as the calculators package. Pass
`{ disableMetrics: true }` as the options to `executeCalculator` to disable this for an execution.
