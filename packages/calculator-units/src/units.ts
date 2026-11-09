/**
 * Any unit: a plain descriptor whose `__unitType` names it. Other fields (usually substances)
 * distinguish units of the same type, e.g. `{ __unitType: 'Mass', substance: 'CO2' }`.
 *
 * Units carry no value. The value lives on the container, so a unit is purely a fact about what the
 * number measures, which rules can pattern match on.
 */
export type UnitLike = { __unitType: string };

/** The dimensionless unit. Always available: the built-in scaling rules depend on it. */
export type RealNumber = { __unitType: 'RealNumber' };

export const realNumber = (): RealNumber => ({ __unitType: 'RealNumber' });

export const isRealNumber = (unit: UnitLike): unit is RealNumber =>
  unit.__unitType === 'RealNumber';

/** True when both units have the same type and the same field values. */
export const sameUnit = (left: UnitLike, right: UnitLike) => {
  const l = left as Record<string, unknown>;
  const r = right as Record<string, unknown>;
  const keys = Object.keys(l);
  return (
    keys.length === Object.keys(r).length && keys.every((k) => l[k] === r[k])
  );
};

export const describeUnit = (unit: UnitLike) => JSON.stringify(unit);
