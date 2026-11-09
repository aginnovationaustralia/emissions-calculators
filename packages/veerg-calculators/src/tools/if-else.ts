import {
  BaseContainer,
  BooleanContainer,
  Metadata,
  NumberContainer,
} from './containers';
import { BooleanUnit, NumberUnit } from './units';

export class IfElseContainer<U extends NumberUnit> extends BaseContainer<U> {
  originType: 'if_else';
  condition: BooleanContainer<BooleanUnit>;
  selected: NumberContainer<U>;
  whenTrue: NumberContainer<U>;
  whenFalse: NumberContainer<U>;

  constructor(
    condition: BooleanContainer<BooleanUnit>,
    selected: NumberContainer<U>,
    whenTrue: NumberContainer<U>,
    whenFalse: NumberContainer<U>,
    baseOrigin?: Metadata,
  ) {
    super(selected.unit, baseOrigin);
    this.originType = 'if_else';
    this.condition = condition;
    this.selected = selected;
    this.whenTrue = whenTrue;
    this.whenFalse = whenFalse;
  }

  switchUnit<UN extends U extends NumberUnit ? U : never, V extends NumberUnit>(
    converter: (from: UN) => V,
  ): IfElseContainer<V> {
    return new IfElseContainer(
      this.condition,
      this.selected.switchUnit(converter),
      this.whenTrue.switchUnit(converter),
      this.whenFalse.switchUnit(converter),
      this.core,
    );
  }
}

export const ifTrueElse = <U extends NumberUnit>(
  condition: BooleanContainer<BooleanUnit>,
  whenTrue: NumberContainer<U>,
  whenFalse: NumberContainer<U>,
  baseOrigin?: Metadata,
): IfElseContainer<U> => {
  const selected = condition.unit ? whenTrue : whenFalse;
  return new IfElseContainer(
    condition,
    selected,
    whenTrue,
    whenFalse,
    baseOrigin,
  );
};
