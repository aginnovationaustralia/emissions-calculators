import type { z } from 'zod';
import type {
  SolidWasteAnaerobicDigestionMethod2InputSchema,
  SolidWasteCompostingMethod2InputSchema,
  SolidWasteIncinerationMethod2InputSchema,
} from '@/modules/scope1/10-solid-waste/solid-waste-method2.input';
import type { SolidWasteInputSchema } from '@/modules/scope1/shared/solid-waste/input';
import type {
  SolidWasteAnaerobicDigestionScope3InputSchema,
  SolidWasteCompostingScope3InputSchema,
  SolidWasteIncinerationScope3InputSchema,
} from '@/modules/scope3/15.12-waste/solid-waste-scope3.input';

export type { SolidWasteMethod1Input } from '@/modules/scope1/10-solid-waste/solid-waste-method1.input';
export type {
  SolidWasteMethod2Input,
  SolidWasteUnmanagedBurialMethod2Input,
  SolidWasteUnmanagedDeepMethod2Input,
  SolidWasteUnmanagedShallowMethod2Input,
} from '@/modules/scope1/10-solid-waste/solid-waste-method2.input';
export type { SolidWasteScope1Input } from '@/modules/scope1/10-solid-waste/solid-waste-scope1.input';
export type {
  SolidWasteLandfillWithGasRecoveryScope3Input,
  SolidWasteLandfillWithoutGasRecoveryScope3Input,
  SolidWasteScope3Input,
} from '@/modules/scope3/15.12-waste/solid-waste-scope3.input';
export type SolidWasteInput = z.input<typeof SolidWasteInputSchema>;
export type SolidWasteIncinerationMethod2Input = z.input<
  typeof SolidWasteIncinerationMethod2InputSchema
>;
export type SolidWasteCompostingMethod2Input = z.input<
  typeof SolidWasteCompostingMethod2InputSchema
>;
export type SolidWasteAnaerobicDigestionMethod2Input = z.input<
  typeof SolidWasteAnaerobicDigestionMethod2InputSchema
>;
export type SolidWasteIncinerationScope3Input = z.input<
  typeof SolidWasteIncinerationScope3InputSchema
>;
export type SolidWasteCompostingScope3Input = z.input<
  typeof SolidWasteCompostingScope3InputSchema
>;
export type SolidWasteAnaerobicDigestionScope3Input = z.input<
  typeof SolidWasteAnaerobicDigestionScope3InputSchema
>;
