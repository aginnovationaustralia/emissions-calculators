import {
  SolidWasteManagedTreatmentType,
  SolidWasteNonStreamTypes,
  SolidWasteOrganicTypes,
  SolidWasteUnmanagedTreatmentType,
} from '@/constants/enums';
import { object } from '@/types/schemas';
import z from 'zod';
import {
  createTypedWasteSchema,
  WasteTypesForFacility,
} from './solid-waste-units.input';

const createScope1TypedWasteSchema = <
  FType extends
    | SolidWasteManagedTreatmentType
    | SolidWasteUnmanagedTreatmentType,
  WType extends readonly WasteTypesForFacility<FType, 1>[],
>(
  facility: FType,
  wasteTypes: WType,
  amountDescription: string,
) => createTypedWasteSchema(facility, wasteTypes, amountDescription, 1);

export const SolidWasteUnmanagedBurialMethod2InputSchema =
  createScope1TypedWasteSchema(
    'Burial',
    SolidWasteNonStreamTypes,
    'Amount of solid waste disposed of through burial',
  );
export type SolidWasteUnmanagedBurialMethod2Input = z.input<
  typeof SolidWasteUnmanagedBurialMethod2InputSchema
>;
export type SolidWasteUnmanagedBurialMethod2InputTransformed = z.output<
  typeof SolidWasteUnmanagedBurialMethod2InputSchema
>;

export const SolidWasteUnmanagedDeepMethod2InputSchema =
  createScope1TypedWasteSchema(
    'Unmanaged - deep',
    SolidWasteNonStreamTypes,
    'Amount of solid waste disposed of in a deep open waste dump.',
  );
export type SolidWasteUnmanagedDeepMethod2Input = z.input<
  typeof SolidWasteUnmanagedDeepMethod2InputSchema
>;
export type SolidWasteUnmanagedDeepMethod2InputTransformed = z.output<
  typeof SolidWasteUnmanagedDeepMethod2InputSchema
>;

export const SolidWasteUnmanagedShallowMethod2InputSchema =
  createScope1TypedWasteSchema(
    'Unmanaged - shallow',
    SolidWasteNonStreamTypes,
    'Amount of solid waste disposed of in a shallow open waste dump.',
  );
export type SolidWasteUnmanagedShallowMethod2Input = z.input<
  typeof SolidWasteUnmanagedShallowMethod2InputSchema
>;
export type SolidWasteUnmanagedShallowMethod2InputTransformed = z.output<
  typeof SolidWasteUnmanagedShallowMethod2InputSchema
>;

export const SolidWasteIncinerationMethod2InputSchema =
  createScope1TypedWasteSchema(
    'Incineration',
    SolidWasteNonStreamTypes,
    'Amount of solid waste incinerated',
  );
export type SolidWasteIncinerationMethod2InputTransformed = z.output<
  typeof SolidWasteIncinerationMethod2InputSchema
>;

export const SolidWasteCompostingMethod2InputSchema =
  createScope1TypedWasteSchema(
    'Composting',
    SolidWasteOrganicTypes,
    'Amount of solid waste treated through composting',
  );
export type SolidWasteCompostingMethod2InputTransformed = z.output<
  typeof SolidWasteCompostingMethod2InputSchema
>;

export const SolidWasteAnaerobicDigestionMethod2InputSchema =
  createScope1TypedWasteSchema(
    'Anaerobic Digestion',
    SolidWasteOrganicTypes,
    'Amount of solid waste treated through anaerobic digestion',
  );
export type SolidWasteAnaerobicDigestionMethod2InputTransformed = z.output<
  typeof SolidWasteAnaerobicDigestionMethod2InputSchema
>;

export type SolidWasteSpecificScope1Method2InputTransformed =
  | SolidWasteUnmanagedBurialMethod2InputTransformed
  | SolidWasteUnmanagedDeepMethod2InputTransformed
  | SolidWasteUnmanagedShallowMethod2InputTransformed
  | SolidWasteCompostingMethod2InputTransformed
  | SolidWasteAnaerobicDigestionMethod2InputTransformed
  | SolidWasteIncinerationMethod2InputTransformed;

export const SolidWasteMethod2InputSchema = object({
  method: z.literal('2'),
  unmanagedBurial: z
    .array(SolidWasteUnmanagedBurialMethod2InputSchema)
    .optional(),
  unmanagedDeep: z.array(SolidWasteUnmanagedDeepMethod2InputSchema).optional(),
  unmanagedShallow: z
    .array(SolidWasteUnmanagedShallowMethod2InputSchema)
    .optional(),
  composting: z.array(SolidWasteCompostingMethod2InputSchema).optional(),
  anaerobicDigestion: z
    .array(SolidWasteAnaerobicDigestionMethod2InputSchema)
    .optional(),
  incineration: z.array(SolidWasteIncinerationMethod2InputSchema).optional(),
}).meta({
  title: 'Method 2',
});
export type SolidWasteMethod2Input = z.input<
  typeof SolidWasteMethod2InputSchema
>;
export type SolidWasteMethod2InputTransformed = z.output<
  typeof SolidWasteMethod2InputSchema
>;
