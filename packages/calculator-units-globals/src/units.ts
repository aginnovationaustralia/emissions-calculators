/** The dimensionless unit. Always registered: the built-in scaling rules depend on it. */
export type RealNumber = { __unitType: 'RealNumber' };

/**
 * Every unit known to the program, keyed by its `__unitType`. Add units with module augmentation:
 *
 *   declare module '@aginnovationaustralia/calculator-units-globals' {
 *     interface UnitRegistry {
 *       MassPerDistance: MassPerDistance;
 *     }
 *   }
 *
 * The key must equal the unit's `__unitType`, which `UnitRegistryIsConsistent` checks. Importing
 * `/defaults` registers the default units.
 */
export interface UnitRegistry {
  RealNumber: RealNumber;
}

export type UnitType = keyof UnitRegistry;
export type NumberUnit = UnitRegistry[UnitType];

/** Fails to compile if a registry key does not match its unit's `__unitType`. */
type UnitRegistryIsConsistent = {
  [K in UnitType]: UnitRegistry[K]['__unitType'] extends K ? true : K;
}[UnitType];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const unitRegistryIsConsistent: UnitRegistryIsConsistent = true;

export const realNumber = (): RealNumber => ({ __unitType: 'RealNumber' });

export const isRealNumber = (unit: NumberUnit): unit is RealNumber =>
  unit.__unitType === 'RealNumber';

/** True when both units have the same type and the same field values. */
export const sameUnit = (left: NumberUnit, right: NumberUnit) => {
  const l = left as Record<string, unknown>;
  const r = right as Record<string, unknown>;
  const keys = Object.keys(l);
  return (
    keys.length === Object.keys(r).length && keys.every((k) => l[k] === r[k])
  );
};

export const describeUnit = (unit: NumberUnit) => JSON.stringify(unit);
