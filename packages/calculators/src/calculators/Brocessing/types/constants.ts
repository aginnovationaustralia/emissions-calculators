import { HasMetadata, ValueMetadata } from './metadata';
import { AnyUnit, CanPrint, NumberUnit } from './values';

export interface HasValue<T extends AnyUnit & CanPrint> {
  name: string;
  value: T;
}

export interface HasNumberValue<T extends NumberUnit & CanPrint> {
  name: string;
  value: T;
}

export interface Constant<T extends AnyUnit> extends HasValue<T>, HasMetadata {
  valueType: 'constant';
}
export const constant = <U extends AnyUnit>(
  name: string,
  value: U,
  metadata?: ValueMetadata,
): Constant<U> => {
  return {
    valueType: 'constant',
    name,
    value,
    metadata,
  };
};
