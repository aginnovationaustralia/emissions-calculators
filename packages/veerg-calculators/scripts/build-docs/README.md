# Build Constants Documentation

This folder contains scripts for automatically generating documentation from JSDoc comments embedded in the constants files used by the emissions calculators.

## Purpose

The `BuildConstantsDocs` class extracts specific JSDoc tags from constant definitions and generates markdown documentation. This helps maintain up-to-date documentation for the numerous constants used across different calculator versions without manual maintenance.

## How It Works

### Input
- Reads `constant_values.ts` files from specific calculator versions
- Parses TypeScript AST to extract JSDoc comments and constant values
- Processes nested object structures and enum references

### JSDoc Tags Supported
The system extracts these specific JSDoc tags:
- `@description` - Describes what the constant represents
- `@units` - Units of measurement (e.g., "kg CO2-e/kg")
- `@link` - Related links or references
- `@inventory2018` - References to 2018 GHG inventory data
- `@inventory2022` - References to 2022 GHG inventory data
- `@reference` - General reference information
- `@type` - TypeScript type information

### Output
Generates `CONSTANTS.md` files containing:
- Organized sections for each constant group
- Markdown tables showing constant paths, values, and metadata
- Formatted comments with proper labels

## Usage

### Basic Usage
```typescript
import { BuildConstantsDocs } from './build-docs';

const enumLookups = {
  'STATES': { NSW: 'nsw', VIC: 'vic', /* ... */ },
  'FreightTypes': { TRUCK: 'Truck', RAIL: 'Rail', /* ... */ }
};

const builder = new BuildConstantsDocs('src/versions/3.0.0', enumLookups);
await builder.buildConstantsDocs();
```

### Version-Specific Builders
Each calculator version has its own builder file (e.g., `300.ts`) that:
- Defines enum lookups specific to that version
- Provides a convenient function to build docs for that version

## Example JSDoc Format

```typescript
/**
 * @description Emission factor for diesel fuel combustion
 * @units kg CO2-e/L
 * @inventory2022 Table 3.2.1
 * @reference IPCC Guidelines 2019
 */
export const constants = {
  dieselEmissionFactor: 2.68,
  // ... more constants
};
```

## File Structure

- `build-docs.ts` - Main `BuildConstantsDocs` class implementation
- `300.ts` - Version 3.0.0 specific configuration and enum lookups
- `render.ts` - Markdown rendering utilities
- `types.ts` - TypeScript type definitions
- `util.ts` - Utility functions
- `index.ts` - Entry point for the build process

## Key Features

- **Enum Resolution**: Handles complex enum references in constant paths
- **Nested Structures**: Processes deeply nested constant objects
- **Flexible Output**: Generates clean markdown tables with conditional formatting
- **Version Support**: Easy to extend for new calculator versions

## Running the Build

The documentation build is typically run as part of the main build process:
```bash
npm run build:docs
```

This generates updated `CONSTANTS.md` files in the appropriate version directories, ensuring documentation stays synchronized with the actual constant values and their metadata.
