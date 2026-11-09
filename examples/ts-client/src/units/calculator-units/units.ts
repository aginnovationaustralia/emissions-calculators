/*
 * The project's unit setup for @aginnovationaustralia/calculator-units: the defaults plus one
 * extra substance, unit and rule. Calculation code imports everything from here.
 *
 * Nothing is global except the substance: the rules only apply to containers created by `units`.
 */
import {
  Container as BaseContainer,
  InitialValue,
  multiplyRule,
  Rule,
  RuleSetOf,
  RuleType,
  Substance,
  UnitSystem,
  values,
  ValueStore,
} from '@aginnovationaustralia/calculator-units';
import {
  defaultUnitSystem,
  Distance,
  Mass,
  mass,
} from '@aginnovationaustralia/calculator-units/defaults';

export * from '@aginnovationaustralia/calculator-units/defaults';
export type {
  RealNumber,
  Substance,
} from '@aginnovationaustralia/calculator-units';

declare module '@aginnovationaustralia/calculator-units' {
  interface SubstanceRegistry {
    Diesel: true;
  }
}

export type MassPerDistance<S extends Substance = Substance> = {
  __unitType: 'MassPerDistance';
  substance: S;
  store: ValueStore;
};

export const massPerDistance = <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
): MassPerDistance<S> => ({
  __unitType: 'MassPerDistance',
  substance,
  store: values(initialValue),
});

// MassPerDistance<S> * Distance = Mass<S>
interface MassPerDistanceTimesDistance extends RuleType {
  rule: this['L'] extends MassPerDistance<infer S>
    ? Rule<Distance, Mass<S>>
    : never;
}
const massPerDistanceTimesDistance =
  multiplyRule<MassPerDistanceTimesDistance>()(
    'MassPerDistance',
    'Distance',
    (l: MassPerDistance, _r: Distance) => mass(l.substance),
  );

const extended = defaultUnitSystem.extend({
  multiply: [massPerDistanceTimesDistance],
});

/** Named so types and errors read `Container<Mass<'CO2e'>, FarmRules>`. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FarmRules extends RuleSetOf<typeof extended> {}

export const units: UnitSystem<FarmRules> = extended;
export const root: typeof units.root = units.root;
export const num: typeof units.num = units.num;

export type Container<U> = BaseContainer<U, FarmRules>;
