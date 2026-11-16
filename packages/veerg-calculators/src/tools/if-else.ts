import type { Container } from './containers';

export { ifTrueElse } from '@aginnovationaustralia/calculator-units';

/** A value chosen by a boolean container, recorded with an `origin.kind` of `if_else`. */
export type IfElseContainer<U> = Container<U>;
