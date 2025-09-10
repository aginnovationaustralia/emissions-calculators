import { ClassConstructor, Transform, plainToClass } from 'class-transformer';
import {
  CustomisedFertiliser,
  CustomisedFertiliserWithLegacyKeys,
} from '../../types/types';

export function singleToArray<T>(value: T | T[], C: ClassConstructor<T>) {
  return Array.isArray(value)
    ? value.map((p) => plainToClass(C, p, { exposeDefaultValues: true }))
    : [plainToClass(C, value, { exposeDefaultValues: true })];
}

export const TransformSingleOrArray = <T extends object>(
  C: ClassConstructor<T>,
) => Transform(({ value }: { value: T | T[] }) => singleToArray(value, C));

export const TransformCustomisedFertiliser = () =>
  Transform(
    ({
      value,
    }: {
      value: CustomisedFertiliserWithLegacyKeys;
    }): CustomisedFertiliser => {
      if (value === ' Urea-Ammonium Nitrate (UAN)') {
        return 'Urea-Ammonium Nitrate (UAN)';
      }
      return value;
    },
  );
