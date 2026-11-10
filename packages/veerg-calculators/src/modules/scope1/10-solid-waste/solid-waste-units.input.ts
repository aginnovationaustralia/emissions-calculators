import {
  SolidWasteManagedTreatmentType,
  SolidWasteNonStreamType,
  SolidWasteOrganicManagedTreatmentType,
  SolidWasteOrganicType,
  SolidWasteScope3IncinerationType,
  SolidWasteScope3LandfillType,
  SolidWasteUnmanagedTreatmentType,
} from '@/constants/enums';
import { Container, root } from '@/tools/containers';
import { enumInput, NonEmptyArray, numberInput } from '@/tools/inputs';
import { ModuleNames, SOLID_WASTE_10_1, WASTE_15_12 } from '@/tools/modules';
import { cubicMetresToLitres, tonnesToKg } from '@/tools/unit-conversion';
import { mass, Mass, volume, Volume } from '@/tools/units';
import z, { object } from 'zod';

type MassBasedAmount = {
  massWasteTonnes: Container<Mass<'Solid Waste'>>;
};

type VolumeBasedAmount = {
  volumeWasteCubicMetres: Container<Volume<'Solid Waste'>>;
};

export type WasteAmount = MassBasedAmount | VolumeBasedAmount;

export const isMassBasedAmount = (
  amount: object,
): amount is MassBasedAmount => {
  return 'massWasteTonnes' in amount;
};

export const isVolumeBasedAmount = (
  amount: object,
): amount is VolumeBasedAmount => {
  return 'volumeWasteCubicMetres' in amount;
};

/**
 * Type check to make sure the right waste types are permitted for each schema:
 * - Regardless of scope, biological treatment facilities can only take organic waste
 * - For scope 1, all waste has to be characterised as one of the 'non-stream' types
 * - For scope 3, the available types change depending on if the facility is landfill
 * or incineration
 */
export type WasteTypesForFacility<
  FType extends
    SolidWasteManagedTreatmentType | SolidWasteUnmanagedTreatmentType,
  Scope extends 1 | 3,
> = FType extends SolidWasteOrganicManagedTreatmentType
  ? SolidWasteOrganicType
  : Scope extends 1
    ? SolidWasteNonStreamType
    : FType extends 'Incineration'
      ? SolidWasteScope3IncinerationType
      : SolidWasteScope3LandfillType;

export const createUnitSchemas = (
  description: string,
  method: '1' | '2',
  modules: NonEmptyArray<ModuleNames>,
) => {
  return {
    schemaMass: {
      massWasteTonnes: numberInput(
        (val) => mass('Solid Waste', tonnesToKg(val)),
        {
          name: `Q`,
          method,
          description,
          modules,
        },
        (s) => s.min(0),
      ),
    },
    schemaVolume: {
      volumeWasteCubicMetres: numberInput(
        (val) => volume('Solid Waste', cubicMetresToLitres(val)),
        {
          name: `V`,
          method,
          description,
          modules,
        },
        (s) => s.min(0),
      ),
    },
  };
};

export const createTypedWasteSchema = <
  FType extends
    SolidWasteManagedTreatmentType | SolidWasteUnmanagedTreatmentType,
  Scope extends 1 | 3,
  WType extends readonly WasteTypesForFacility<FType, Scope>[],
>(
  facility: FType,
  wasteTypes: WType,
  amountDescription: string,
  scope: Scope,
) => {
  // In Scope 1, method 1 only allows total mass. Scope 3 has no method 2 specific options.
  const method = scope === 1 ? '2' : '1';
  const modules: NonEmptyArray<ModuleNames> =
    scope === 1 ? [SOLID_WASTE_10_1] : [WASTE_15_12];
  const { schemaMass, schemaVolume } = createUnitSchemas(
    amountDescription,
    method,
    modules,
  );

  const wasteType = enumInput(wasteTypes, {
    name: 'w',
    description: `Type of solid waste treated at this facility (${facility})`,
    modules,
    method,
  });

  return z
    .xor([
      object({
        wasteType,
        ...schemaMass,
      }).meta({ title: 'Quantity by mass' }),
      object({
        wasteType,
        ...schemaVolume,
      }).meta({ title: 'Quantity by volume' }),
    ])
    .transform((val) => ({
      facilityType: root(facility),
      ...val,
    }));
};
