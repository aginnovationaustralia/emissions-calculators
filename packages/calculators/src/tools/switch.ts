import {
  BaseContainer,
  Metadata,
  NumberContainer,
  StringContainer,
} from './containers';
import { InputContainer } from './inputs';
import { StringUnit } from './units';
import { AnyNumberUnit } from './generic';

export class SwitchContainer<
  TSubject extends StringUnit,
  TSelected extends AnyNumberUnit,
> extends BaseContainer<TSelected> {
  originType: 'switch';
  subject: StringContainer<TSubject>;
  selected: NumberContainer<TSelected>;
  constructor(
    selected: NumberContainer<TSelected>,
    subject: StringContainer<TSubject>,

    baseOrigin?: Metadata,
  ) {
    super(selected.unit, baseOrigin);
    this.originType = 'switch';
    this.selected = selected;
    this.subject = subject;
  }

  switchUnit<
    UN extends (TSelected extends AnyNumberUnit ? TSelected : never),
    V extends AnyNumberUnit,
  >(converter: (from: UN) => V): SwitchContainer<TSubject, V> {
    return new SwitchContainer(
      this.selected.switchUnit(converter),
      this.subject,
      this.core,
    );
  }
}

export const selectSwitch = <
  TSubject extends StringUnit,
  TSelected extends AnyNumberUnit,
>(
  subject: InputContainer<TSubject>,
  cases: Record<TSubject, NumberContainer<TSelected>>,
): SwitchContainer<TSubject, TSelected> => {
  const selected = cases[subject.unit];
  return new SwitchContainer<TSubject, TSelected>(selected, subject, cases);
};
