/*
 * The default substances, units and rules.
 *
 * Importing this entry point (or anything that imports it) has two global effects:
 *
 * - types: the default substances, units and rules are added to the registries for the whole
 *   TypeScript program, including files that never import it;
 * - runtime: the default rules are registered with the package's rule registry for the whole
 *   process, including containers created by code that never imports it.
 *
 * There is no way to use only some of the defaults.
 */
import './rules.js';

export * from './units.js';
