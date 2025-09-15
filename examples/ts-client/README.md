# TypeScript Client Example

This is a TypeScript client example that demonstrates how to consume the `@aginnovationaustralia/emissions-calculators` npm package.

## Overview

This example shows how to:
- Install and import the emissions calculators package
- Create input data for beef emissions calculations
- Call the `calculateEmissions` function
- Display the results in a structured format

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

Since this is a private package, you need to authenticate with npm:

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

The example will calculate beef emissions for a sample farm and display:

- Input data summary
- Scope 1, 2, and 3 emissions
- Carbon sequestration
- Net emissions
- Emission intensities

## Project Structure

```
ts-client/
├── src/
│   └── index.ts          # Main example file
├── dist/                 # Compiled JavaScript output
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── .npmrc               # NPM configuration for private packages
└── README.md            # This file
```

## API Usage

The main function to use is `calculateEmissions`:

```typescript
import { calculateEmissions } from '@aginnovationaustralia/emissions-calculators';

const result = calculateEmissions(
  'beef',           // Calculator type
  '3.0.0',         // Version
  beefInputData     // Input data object
);
```

### Available Calculators

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
- And many more...

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

1. Create a new file in `src/` (e.g., `dairy-example.ts`)
2. Import the necessary types and functions
3. Create sample input data
4. Call `calculateEmissions` with the appropriate parameters
5. Add a script to `package.json` to run your example

### Building

```bash
# Clean previous build
npm run clean

# Build TypeScript
npm run build
```

## License

This example is provided under the MIT License. The underlying `@aginnovationaustralia/emissions-calculators` package is licensed under Creative Commons Attribution No Derivatives 4.0.
