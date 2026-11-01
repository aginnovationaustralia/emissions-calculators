import {
  BaseContainer,
  BooleanContainer,
  Metadata,
  NumberContainer,
} from './containers';
import { BooleanUnit } from './units';
import { AnyNumberUnit } from './generic';

export class IfElseContainer<U extends AnyNumberUnit> extends BaseContainer<U> {
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

  switchUnit<V extends AnyNumberUnit>(
    converter: (from: NoInfer<U>) => V,
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

export const ifTrueElse = <U extends AnyNumberUnit>(
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
