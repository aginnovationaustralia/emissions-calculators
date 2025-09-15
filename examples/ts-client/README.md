# TypeScript Client Example

This is a TypeScript client example that demonstrates how to consume the `@aginnovationaustralia/emissions-calculators` npm package.

## Overview

This example shows how to:
- Install and import the emissions calculators package
- Use both versioned imports (`/versions/3.0.0/`) and top-level aliases (`/calculators`, `/types`)
- Create input data for beef emissions calculations
- Call the `calculateBeef` function from different import paths
- Compare results from different import methods

## Prerequisites

- Node.js v22.19.0 or higher
- npm or pnpm package manager
- Access to the private `@aginnovationaustralia/emissions-calculators` package

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure NPM Authentication

While this is a private package, you need to authenticate with npm:

#### Option A: Using NPM Token (Recommended)

1. Get your npm token from [npmjs.com](https://www.npmjs.com/settings/tokens)
2. Set the token as an environment variable:

```bash
export NPM_TOKEN=your_npm_token_here
```

#### Option B: Using NPM Login

```bash
npm login
```

### 3. Build the Project

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

The example will calculate beef emissions for a sample farm using both import methods:

1. **Top-level alias imports** (`/calculators`, `/types`) - demonstrates the simplified import paths
2. **Versioned imports** (`/versions/3.0.0/`) - demonstrates the explicit version path

Both methods should produce identical results, showing the flexibility of the package's export configuration.

## Project Structure

```
ts-client/
├── src/
│   ├── beef/                 # Beef calculator examples
│   │   ├── input.ts          # Sample beef input data
│   │   ├── latest.ts         # Example using top-level aliases
│   │   └── v300.ts           # Example using versioned imports
│   └── index.ts              # Main example file
├── dist/                     # Compiled JavaScript output
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── .npmrc                    # NPM configuration for private packages
└── README.md                 # This file
```

## API Usage

### Method 1: Top-level Aliases (Recommended)

```typescript
import { calculateBeef } from '@aginnovationaustralia/emissions-calculators/calculators';
import { BeefInput } from '@aginnovationaustralia/emissions-calculators/types/Beef/input';

const result = calculateBeef(beefInputData);
```

### Method 2: Versioned Imports

```typescript
import { calculateBeef } from '@aginnovationaustralia/emissions-calculators/versions/3.0.0/calculators';
import { BeefInput } from '@aginnovationaustralia/emissions-calculators/versions/3.0.0/types/Beef/input';

const result = calculateBeef(beefInputData);
```

### Legacy Method: Main Entry Point

```typescript
import { calculateEmissions } from '@aginnovationaustralia/emissions-calculators';

const result = calculateEmissions(
  'beef',           // Calculator type
  '3.0.0',         // Version
  beefInputData     // Input data object
);
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

## Troubleshooting

### Authentication Issues

If you get authentication errors:

1. Verify your npm token is set: `echo $NPM_TOKEN`
2. Check your `.npmrc` file is configured correctly
3. Try logging in again: `npm login`

### Package Not Found

If the package cannot be found:

1. Ensure you have access to the `@aginnovationaustralia` organization on npm
2. Verify the package version exists: `npm view @aginnovationaustralia/emissions-calculators versions`

### Type Errors

If you encounter TypeScript errors:

1. Ensure you're using the correct input data structure
2. Check the package documentation for the latest API
3. Verify your TypeScript version is compatible

## Development

### Adding New Examples

To add examples for other calculators:

1. Create a new folder in `src/` (e.g., `src/dairy/`)
2. Create an `input.ts` file with sample data
3. Create example files using both import methods:
   - `latest.ts` - using top-level aliases (`/calculators`, `/types`)
   - `v300.ts` - using versioned imports (`/versions/3.0.0/`)
4. Import the necessary types and functions
5. Call the appropriate calculator function
6. Update `src/index.ts` to run your examples

### Building

```bash
# Clean previous build
npm run clean

# Build TypeScript
npm run build
```

## License

This example is provided under the MIT License. The underlying `@aginnovationaustralia/emissions-calculators` package is licensed under Creative Commons Attribution No Derivatives 4.0.
