/*
 * What a consuming project writes to extend the unit system. In a real consumer the module
 * specifiers would be the package name (e.g. '@aginnovationaustralia/units'), not relative paths.
 *
 * Adds:
 *   - two substances, Biochar and Diesel
 *   - a new unit, MassPerDistance<S> (e.g. kg of diesel per metre travelled)
 *   - MassPerDistance<S> * Distance = Mass<S>
 *   - Mass<S> / Distance = MassPerDistance<S>
 */
import { defineDivide, defineMultiply, Rule } from '../rules';
import type { Substance } from '../substances';
import type { Distance, Mass } from '../units';
import { mass } from '../units';

export type MassPerDistance<S extends Substance = Substance> = {
  __unitType: 'MassPerDistance';
  substance: S;
};

export const massPerDistance = <S extends Substance>(
  substance: S,
): MassPerDistance<S> => ({ __unitType: 'MassPerDistance', substance });

declare module '../substances' {
  interface SubstanceRegistry {
    Biochar: true;
    Diesel: true;
  }
}

declare module '../units' {
  interface UnitRegistry {
    MassPerDistance: MassPerDistance;
  }
}

// Augmentations must repeat the type parameters exactly, even if a rule doesn't use R.
/* eslint-disable @typescript-eslint/no-unused-vars */
declare module '../rules' {
  interface MultiplyRules<L, R> {
    // MassPerDistance<S> * Distance = Mass<S>
    massPerDistanceByDistance: L extends MassPerDistance<infer S>
      ? Rule<Distance, Mass<S>>
      : never;
  }
  interface DivideRules<L, R> {
    // Mass<S> / Distance = MassPerDistance<S>
    massByDistance: L extends Mass<infer S>
      ? Rule<Distance, MassPerDistance<S>>
      : never;
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

defineMultiply('MassPerDistance', 'Distance', (l) => mass(l.substance));
defineDivide('Mass', 'Distance', (l) => massPerDistance(l.substance));
