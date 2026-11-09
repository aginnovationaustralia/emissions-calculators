import { Metadata, units } from './containers';
import { AnyUnit } from './units';

/** A named root container, e.g. a published factor. */
export const constant = <U extends AnyUnit>(
  name: string,
  unit: U,
  baseOrigin?: Metadata,
) => units.constant(name, unit, baseOrigin);

/**
 * Looks up a constant by up to five keys, each a literal or a string container. The result is
 * named after the constants table and the keys, e.g. `COMMON[GWP.CH4]`.
 */
export const { select: selectConstant } = units;
