import { readFileSync } from 'fs';
import { defineConfig } from 'tsup';

// Read package.json to get version
const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

export default defineConfig({
  entry: {
    'versions/3.0.0/calculators': 'src/versions/3.0.0/calculators.ts'
  },
  format: ['cjs', 'esm'],
  dts: false, // We'll generate types separately with tsc
  outDir: 'dist',
  clean: false, // Don't clean since we're building types first
  sourcemap: false,
  minify: false,
  splitting: false,
  treeshake: true,
  target: 'es2020',
  // Inject package version at build time
  define: {
    PACKAGE_VERSION: JSON.stringify(packageJson.version)
  },
  // This will resolve the @/* path aliases
  esbuildOptions(options) {
    options.alias = {
      '@': './src'
    };
  }
});