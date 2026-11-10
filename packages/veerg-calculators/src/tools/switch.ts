import {
  BaseContainer,
  Metadata,
  NumberContainer,
  StringContainer,
} from './containers';
import { InputContainer } from './inputs';
import { NumberUnit, StringUnit } from './units';

export class SwitchContainer<
  TSubject extends StringUnit,
  TSelected extends NumberUnit,
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
    UN extends TSelected extends NumberUnit ? TSelected : never,
    V extends NumberUnit,
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
  TSelected extends NumberUnit,
>(
  subject: InputContainer<TSubject>,
  cases: Record<TSubject, NumberContainer<TSelected>>,
): SwitchContainer<TSubject, TSelected> => {
  const selected = cases[subject.unit];
  return new SwitchContainer<TSubject, TSelected>(selected, subject, cases);
};
