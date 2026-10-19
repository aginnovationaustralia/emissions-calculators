import {
  SolidWasteManagedTreatmentType,
  SolidWasteOrganicTypes,
  SolidWasteScope3IncinerationTypes,
  SolidWasteScope3LandfillTypes,
} from '@/constants/enums';
import { createTypedWasteSchema } from '@/modules/scope1/10-solid-waste';
import { WasteTypesForFacility } from '@/modules/scope1/10-solid-waste/solid-waste-units.input';
import { object } from '@/types/schemas';
import z from 'zod';

const createScope3TypedWasteSchema = <
  FType extends SolidWasteManagedTreatmentType,
  WType extends readonly WasteTypesForFacility<FType, 3>[],
>(
  facility: FType,
  wasteTypes: WType,
  amountDescription: string,
) => createTypedWasteSchema(facility, wasteTypes, amountDescription, 3);

export const SolidWasteLandfillWithoutGasRecoveryScope3InputSchema =
  createScope3TypedWasteSchema(
    'Landfill (without gas recovery)',
    SolidWasteScope3LandfillTypes,
    'Amount of solid waste sent to landfill (without gas recovery)',
  );
export type SolidWasteLandfillWithoutGasRecoveryScope3Input = z.input<
  typeof SolidWasteLandfillWithoutGasRecoveryScope3InputSchema
>;
export type SolidWasteLandfillWithoutGasRecoveryScope3InputTransformed =
  z.output<typeof SolidWasteLandfillWithoutGasRecoveryScope3InputSchema>;

export const SolidWasteLandfillWithGasRecoveryScope3InputSchema =
  createScope3TypedWasteSchema(
    'Landfill (with gas recovery)',
    SolidWasteScope3LandfillTypes,
    'Amount of solid waste sent to landfill (without gas recovery)',
  );
export type SolidWasteLandfillWithGasRecoveryScope3Input = z.input<
  typeof SolidWasteLandfillWithGasRecoveryScope3InputSchema
>;
export type SolidWasteLandfillWithGasRecoveryScope3InputTransformed = z.output<
  typeof SolidWasteLandfillWithGasRecoveryScope3InputSchema
>;

export const SolidWasteIncinerationScope3InputSchema =
  createScope3TypedWasteSchema(
    'Incineration',
    SolidWasteScope3IncinerationTypes,
    'Amount of solid waste incinerated',
  );
export type SolidWasteIncinerationScope3InputTransformed = z.output<
  typeof SolidWasteIncinerationScope3InputSchema
>;

export const SolidWasteCompostingScope3InputSchema =
  createScope3TypedWasteSchema(
    'Composting',
    SolidWasteOrganicTypes,
    'Amount of solid waste treated through composting',
  );
export type SolidWasteCompostingScope3InputTransformed = z.output<
  typeof SolidWasteCompostingScope3InputSchema
>;

export const SolidWasteAnaerobicDigestionScope3InputSchema =
  createScope3TypedWasteSchema(
    'Anaerobic Digestion',
    SolidWasteOrganicTypes,
    'Amount of solid waste treated through anaerobic digestion',
  );
export type SolidWasteAnaerobicDigestionScope3InputTransformed = z.output<
  typeof SolidWasteAnaerobicDigestionScope3InputSchema
>;

export type SolidWasteSpecificScope3InputTransformed =
  | SolidWasteLandfillWithoutGasRecoveryScope3InputTransformed
  | SolidWasteLandfillWithGasRecoveryScope3InputTransformed
  | SolidWasteIncinerationScope3InputTransformed
  | SolidWasteCompostingScope3InputTransformed
  | SolidWasteAnaerobicDigestionScope3InputTransformed;

export const SolidWasteScope3InputSchema = object({
  landfillWithoutGasRecovery: z
    .array(SolidWasteLandfillWithoutGasRecoveryScope3InputSchema)
    .optional()
    .meta({
      description:
        'Waste sent offsite to landfill (without methane gas recovery)',
    }),
  landfillWithGasRecovery: z
    .array(SolidWasteLandfillWithGasRecoveryScope3InputSchema)
    .optional()
    .meta({
      description: 'Waste sent offsite to landfill with methane gas recovery',
    }),
  incineration: z
    .array(SolidWasteIncinerationScope3InputSchema)
    .optional()
    .meta({
      description: 'Waste sent offsite to be incinerated',
    }),
  composting: z.array(SolidWasteCompostingScope3InputSchema).optional().meta({
    description: 'Organic waste sent offsite to be composted',
  }),
  anaerobicDigestion: z
    .array(SolidWasteAnaerobicDigestionScope3InputSchema)
    .optional()
    .meta({
      description:
        'Organic waste sent offsite to be treated through anaerobic digestion',
    }),
});
export type SolidWasteScope3Input = z.input<typeof SolidWasteScope3InputSchema>;
export type SolidWasteScope3InputTransformed = z.output<
  typeof SolidWasteScope3InputSchema
>;
