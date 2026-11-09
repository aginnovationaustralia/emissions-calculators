/*
 * Point 1 in action: types and runtime come from different places.
 *
 * This module never imports ./units, so the MassPerDistance rule is never registered at runtime.
 * But ./units is part of the same TypeScript program, so its augmentation is in scope here anyway
 * and the multiply below typechecks. Run it with `pnpm units:globals:pitfall` and it throws.
 *
 * Whether this works at runtime depends on whether some other module happened to import ./units
 * first, e.g. if this ran after the farm calculation in the same process, it would succeed.
 */
import {
  root,
  UnitError,
} from '@aginnovationaustralia/calculator-units-globals';
import { distance } from '@aginnovationaustralia/calculator-units-globals/defaults';

const dieselRate = root(
  { __unitType: 'MassPerDistance', substance: 'Diesel' } as const,
  0.00025,
);

try {
  const fuel = dieselRate.multiply(root(distance(), 1000));
  console.log('Succeeded:', fuel.unit);
} catch (error) {
  if (!(error instanceof UnitError)) throw error;
  console.log(`Typechecked, but threw at runtime: ${error.message}`);
}
