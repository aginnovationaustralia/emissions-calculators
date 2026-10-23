import { valueObject } from './outputs';
import { Mass, RealNumber, Substance } from './units';

/**
 * Unwraps the stored value of a container holding a total mass, in kg.
 *
 * Intensity calculations work on plain numbers, so once a value leaves its container the
 * unit checks that guard container arithmetic no longer apply. Use this instead of
 * `.unit.store.toNumber()` so that passing a container of any other unit (e.g. mass per
 * head) is a type error rather than a silently wrong intensity.
 */
export function extractMassAsNumber<S extends Substance>(container: {
  unit: Mass<S>;
}): number {
  return container.unit.store.toNumber();
}

/** A total mass in kg, wrapped as an output value. See `extractMassAsNumber` */
export function exposeMassValue<S extends Substance>(container: {
  unit: Mass<S>;
}) {
  return valueObject(extractMassAsNumber(container));
}

/**
 * Unwraps the stored value of a container holding a dimensionless number, such as an
 * allocation proportion or a count of units produced. See `extractMassAsNumber`.
 */
export function extractRealNumberAsNumber(container: {
  unit: RealNumber;
}): number {
  return container.unit.store.toNumber();
}
