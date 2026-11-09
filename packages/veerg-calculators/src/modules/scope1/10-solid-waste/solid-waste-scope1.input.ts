import { z } from 'zod';
import {
  SolidWasteMethod1InputSchema,
  SolidWasteMethod1InputTransformed,
} from './solid-waste-method1.input';
import {
  SolidWasteMethod2InputSchema,
  SolidWasteMethod2InputTransformed,
} from './solid-waste-method2.input';

export const SolidWasteScope1InputSchema = z.discriminatedUnion('method', [
  SolidWasteMethod1InputSchema,
  SolidWasteMethod2InputSchema,
]);
export type SolidWasteScope1Input = z.input<typeof SolidWasteScope1InputSchema>;
export type SolidWasteScope1InputTransformed = z.output<
  typeof SolidWasteScope1InputSchema
>;

export const solidWasteScope1InputSchemaIsMethod1 = (
  input: SolidWasteScope1InputTransformed,
): input is SolidWasteMethod1InputTransformed => {
  return input.method === '1';
};

export const solidWasteScope1InputSchemaIsMethod2 = (
  input: SolidWasteScope1InputTransformed,
): input is SolidWasteMethod2InputTransformed => {
  return input.method === '2';
};
