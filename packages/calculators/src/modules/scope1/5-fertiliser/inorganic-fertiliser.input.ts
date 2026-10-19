import { z } from 'zod';
import { InorganicFertiliserInputScope3Method1Schema } from './inorganic-fertiliser-method1.input';
import {
  InorganicFertiliserInputScope3Method2OtherTransformed,
  InorganicFertiliserInputScope3Method2Schema,
  otherFertilisers,
} from './inorganic-fertiliser-method2.input';

export const InorganicFertiliserInputSchema = z.discriminatedUnion(
  'calculationMethodScope3',
  [
    InorganicFertiliserInputScope3Method1Schema,
    InorganicFertiliserInputScope3Method2Schema,
  ],
);

export type InorganicFertiliserInput = z.input<
  typeof InorganicFertiliserInputSchema
>;
export type InorganicFertiliserInputTransformed = z.output<
  typeof InorganicFertiliserInputSchema
>;

export type InorganicFertiliserInputScope3Method2Transformed = z.output<
  typeof InorganicFertiliserInputScope3Method2Schema
>;

export type InorganicFertiliserInputScope3Method1 = z.input<
  typeof InorganicFertiliserInputScope3Method1Schema
>;

export type InorganicFertiliserInputScope3Method1Transformed = z.output<
  typeof InorganicFertiliserInputScope3Method1Schema
>;

export const isInorganicFertiliserInputScope3Method1 = (
  input: InorganicFertiliserInputTransformed,
): input is InorganicFertiliserInputScope3Method1Transformed => {
  return input.calculationMethodScope3 === '1';
};

export const isInorganicFertiliserInputScope3Method2 = (
  input: InorganicFertiliserInputTransformed,
): input is InorganicFertiliserInputScope3Method2Transformed => {
  return input.calculationMethodScope3 === '2';
};

export const isInorganicFertiliserTypeOther = (
  input: InorganicFertiliserInputTransformed,
): input is InorganicFertiliserInputScope3Method2OtherTransformed => {
  return (
    isInorganicFertiliserInputScope3Method2(input) &&
    input.fertiliserType.unit === otherFertilisers
  );
};
