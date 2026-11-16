/*
 * The MassPerDistance rule only exists on the `units` system in ./units, so a container from a
 * system without it can't use it, and the compiler says so. Types and runtime agree whatever has been imported.
 */
import { UnitError, values } from '@aginnovationaustralia/calculator-units';
import {
  defaultUnitSystem,
  distance,
} from '@aginnovationaustralia/calculator-units/defaults';

const dieselRate = defaultUnitSystem.root({
  __unitType: 'MassPerDistance' as const,
  substance: 'Diesel' as const,
  store: values(0.00025),
});

try {
  // @ts-expect-error the default system has no MassPerDistance * Distance rule
  const fuel = dieselRate.multiply(defaultUnitSystem.root(distance(1000)));
  console.log('Succeeded:', fuel.unit);
} catch (error) {
  if (!(error instanceof UnitError)) throw error;
  console.log(
    `Rejected by the compiler, and threw at runtime: ${error.message}`,
  );
}
