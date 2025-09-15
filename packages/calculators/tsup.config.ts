import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/latest.ts'],
  format: ['cjs', 'esm'],
  dts: false, // We'll generate types separately with tsc
  outDir: 'dist',
  clean: false, // Don't clean since we're building types first
  sourcemap: false,
  minify: false,
  splitting: false,
  treeshake: true,
  target: 'es2020',
  // This will resolve the @/* path aliases
  esbuildOptions(options) {
    options.alias = {
      '@': './src'
    };
  }
});