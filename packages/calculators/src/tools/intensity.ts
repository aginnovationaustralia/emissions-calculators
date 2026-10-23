import { divideBySafeFromZero } from '@/calculators/common/tools/calculate';
import { Container } from './containers';
import { extractMassAsNumber, extractRealNumberAsNumber } from './extract';
import { valueObject } from './outputs';
import { Mass, RealNumber, Substance } from './units';

/**
 * Emissions intensity in kg CO2e per kg of product, ready for output. Taking containers keeps
 * the unit checks in place right up to the division, so only a CO2e mass can be the numerator
 * and only a total mass (not, say, a mass per head) can be the denominator. Zero production
 * gives an intensity of zero rather than dividing by zero.
 */
export function generateIntensity<S extends Substance>(
  emissions: Container<Mass<'CO2e'>>,
  produced: Container<Mass<S>>,
) {
  return valueObject(
    divideBySafeFromZero(
      extractMassAsNumber(emissions),
      extractMassAsNumber(produced),
    ),
  );
}

/**
 * Emissions intensity in kg CO2e per unit produced, for products counted rather than weighed.
 * See `generateIntensity`.
 */
export function generateIntensityPerUnit(
  emissions: Container<Mass<'CO2e'>>,
  unitsProduced: Container<RealNumber>,
) {
  return valueObject(
    divideBySafeFromZero(
      extractMassAsNumber(emissions),
      extractRealNumberAsNumber(unitsProduced),
    ),
  );
}
