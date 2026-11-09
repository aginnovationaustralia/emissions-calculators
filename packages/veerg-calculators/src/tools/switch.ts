import type { Container } from './containers';

export { selectSwitch } from '@aginnovationaustralia/calculator-units';

/** A value chosen by a string container, recorded with an `origin.kind` of `switch`. */
export type SwitchContainer<_TSubject, TSelected> = Container<TSelected>;
