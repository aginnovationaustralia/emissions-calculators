/*
 * decimal.js-light is CommonJS without an `exports` map, so its default import differs by loader:
 * - Node ESM loads the CommonJS build, whose module.exports is the class (with `.default` pointing
 *   back to itself). TypeScript types this default import as the module namespace.
 * - Bundlers load decimal.mjs, whose default export is the class itself, with no `.default`.
 * Every module in this package imports Decimal from here so this is handled once.
 */
import decimalModule from 'decimal.js-light';
import type { Decimal as DecimalClass } from 'decimal.js-light';

type DecimalConstructor = typeof DecimalClass;
const loaded = decimalModule as unknown as DecimalConstructor & {
  default?: DecimalConstructor;
};

export const Decimal: DecimalConstructor = loaded.default ?? loaded;
export type Decimal = DecimalClass;
