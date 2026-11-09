/*
 * The project's unit setup for @aginnovationaustralia/calculator-units-globals: the defaults plus
 * one extra substance, unit and rule. Calculation code imports everything from here.
 *
 * Everything here is global. The augmentations apply to every file in the TypeScript program, and
 * the runtime rules are registered for the whole process when this module is first imported.
 */
import {
  defineMultiply,
  Rule,
  Substance,
} from '@aginnovationaustralia/calculator-units-globals';
import {
  Distance,
  Mass,
  mass,
} from '@aginnovationaustralia/calculator-units-globals/defaults';

export * from '@aginnovationaustralia/calculator-units-globals';
export * from '@aginnovationaustralia/calculator-units-globals/defaults';

export type MassPerDistance<S extends Substance = Substance> = {
  __unitType: 'MassPerDistance';
  substance: S;
};

export const massPerDistance = <S extends Substance>(
  substance: S,
): MassPerDistance<S> => ({ __unitType: 'MassPerDistance', substance });

// Augmentations must repeat the type parameters exactly, even where a rule doesn't use R
/* eslint-disable @typescript-eslint/no-unused-vars */
declare module '@aginnovationaustralia/calculator-units-globals' {
  interface SubstanceRegistry {
    Diesel: true;
  }

  interface UnitRegistry {
    MassPerDistance: MassPerDistance;
  }

  interface MultiplyRules<L, R> {
    // MassPerDistance<S> * Distance = Mass<S>
    massPerDistanceTimesDistance: L extends MassPerDistance<infer S>
      ? Rule<Distance, Mass<S>>
      : never;
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

// The runtime half, registered globally as a side effect of importing this module
defineMultiply('MassPerDistance', 'Distance', (l) => mass(l.substance));
