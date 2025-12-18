# TypeScript Client Example

This is a TypeScript client example that demonstrates how to consume the `@aginnovationaustralia/emissions-calculators` npm package.

## Overview

This example shows how to:

- Install and import the emissions calculators package
- Use the top-level `calculateEmissions` function for quick calculations
- Use nested imports (`/beef`, `/grains`, etc.) for smaller bundle sizes
- Create input data for beef emissions calculations
- Validate input data using the provided schemas

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Project

```bash
npm run build
```

## Usage

### Run the Example

```bash
# Using the compiled JavaScript
npm start

# Or run directly with ts-node (for development)
npm run dev
```

### Example Output

The example will calculate beef emissions for a sample farm using three different approaches:

1. **Simple calculation** (`calculate-emissions.ts`) - uses the top-level `calculateEmissions` function
2. **Top-level exports** (`top-level.ts`) - uses calculator-specific functions from the main entry point
3. **Nested exports** (`nested-exports.ts`) - uses nested import paths for better tree shaking

All methods produce identical results, showing the flexibility of the package's export configuration.

## Project Structure

```
ts-client/
├── src/
│   ├── beef/                       # Beef calculator examples
│   │   ├── input.ts                # Sample beef input data
│   │   ├── calculate-emissions.ts  # Example using calculateEmissions
│   │   ├── top-level.ts            # Example using top-level exports
│   │   └── nested-exports.ts       # Example using nested exports
│   └── index.ts                    # Main example file
├── dist/                           # Compiled JavaScript output
├── package.json                    # Project dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # This file
```

## API Usage

### Method 1: Simple Calculation (Recommended for getting started)

The simplest way to calculate emissions using the top-level `calculateEmissions` function:

```typescript
import { calculateEmissions } from '@aginnovationaustralia/emissions-calculators';
import type { BeefInput } from '@aginnovationaustralia/emissions-calculators/beef';

const beefInputData: BeefInput = {
  state: 'nsw',
  northOfTropicOfCapricorn: true,
  rainfallAbove600: true,
  beef: [
    /* ... beef enterprise data ... */
  ],
};

const result = calculateEmissions('beef', beefInputData);

if (result.status === 'OK') {
  console.log('Emissions calculated:', result.emissions);
} else if (result.status === 'INVALID_INPUT') {
  console.error('Input was not valid:', result.message);
} else {
  console.error('Error calculating emissions:', result.error.message);
}
```

### Method 2: Top-level Exports

Use calculator-specific functions and types from the main entry point:

```typescript
import {
  BeefInputSchema,
  calculateBeef,
  validateCalculatorInput,
} from '@aginnovationaustralia/emissions-calculators';

const validatedInput = validateCalculatorInput(BeefInputSchema, beefInputData);

if (validatedInput.valid) {
  const result = calculateBeef(validatedInput.result);
  console.log('Emissions calculated:', result);
} else {
  console.error('Validation errors:', validatedInput.issues);
}
```

### Method 3: Nested Exports (Recommended for production)

Use nested import paths for smaller bundle sizes via tree shaking:

```typescript
import {
  BeefInputSchema,
  calculateBeef,
} from '@aginnovationaustralia/emissions-calculators/beef';
import { validateCalculatorInput } from '@aginnovationaustralia/emissions-calculators/validate';

const validatedInput = validateCalculatorInput(BeefInputSchema, beefInputData);

if (validatedInput.valid) {
  const result = calculateBeef(validatedInput.result);
  console.log('Emissions calculated:', result);
}
```

### Available Calculators

The package includes calculators for:

- `beef` - Beef cattle emissions
- `dairy` - Dairy cattle emissions
- `sheep` - Sheep emissions
- `pork` - Pig emissions
- `poultry` - Poultry emissions
- `grains` - Grain crop emissions
- `cotton` - Cotton crop emissions
- `sugar` - Sugar cane emissions
- `rice` - Rice crop emissions
- `horticulture` - Horticultural crop emissions
- `aquaculture` - Aquaculture emissions
- `buffalo` - Buffalo emissions
- `deer` - Deer emissions
- `feedlot` - Feedlot operations
- `goat` - Goat emissions
- `processing` - Food processing
- `vineyard` - Vineyard operations
- `wildCatchFishery` - Wild catch fisheries
- `wildSeaFisheries` - Wild sea fisheries

### Building

```bash
# Clean previous build
npm run clean

# Build TypeScript
npm run build
```

# License

[Creative Commons Attribution](./assets/by.png)

This project is licensed under a [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/) license.
