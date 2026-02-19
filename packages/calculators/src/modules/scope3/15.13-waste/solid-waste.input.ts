import {
  OrganicWasteTypes,
  SolidWasteByVolumeType,
  SolidWasteIncinerationTypes,
  SolidWasteLandfillTypes,
} from '@/calculators/Grains/constants/enums';
import { CommonConstants } from '@/calculators/Grains/constants/types';
import { selectConstant } from '@/tools/constants';
import { Container } from '@/tools/containers';
import { input } from '@/tools/inputs';
import { cubicMetresToLitres, tonnesToKg } from '@/tools/unit-conversion';
import { Mass, mass, massPerVolume, Volume, volume } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

type MassBasedAmount = {
  massWasteTonnes: Container<Mass<'Solid Waste'>>;
};

type VolumeBasedAmount = {
  volumeWasteCubicMetres: Container<Volume<'Solid Waste'>>;
};

type WasteAmount = MassBasedAmount | VolumeBasedAmount;

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

export const convertWasteAmountToMass = (
  amount: WasteAmount,
  wasteType: SolidWasteByVolumeType,
  constants: CommonConstants,
): Container<Mass<'Solid Waste'>> => {
  if (isMassBasedAmount(amount)) {
    return amount.massWasteTonnes;
  }
  const volumeToMassConversionFactor = selectConstant(
    constants,
    (value) => massPerVolume('Solid Waste', 'Solid Waste', value),
    'SOLID_WASTE_BY_VOLUME_TO_MASS',
    wasteType,
  );
  return volumeToMassConversionFactor.multiply(amount.volumeWasteCubicMetres);
};

const createUnitSchemas = (destination: string, organicOnly: boolean) => ({
  schemaMass: {
    massWasteTonnes: z
      .number()
      .min(0)
      .meta({
        description: `Mass of ${organicOnly ? 'organic ' : ''}solid waste sent to ${destination}, in tonnes`,
      })
      .transform((val) =>
        input(
          `massWasteTonnes${destination}`,
          mass('Solid Waste', tonnesToKg(val)),
        ),
      ),
  },
  schemaVolume: {
    volumeWasteCubicMetres: z
      .number()
      .min(0)
      .meta({
        description: `Volume of ${organicOnly ? 'organic ' : ''}solid waste sent to ${destination}, in cubic metres`,
      })
      .transform((val) =>
        input(
          `volumeWasteCubicMetres${destination}`,
          volume('Solid Waste', cubicMetresToLitres(val)),
        ),
      ),
  },
});

const createTypedWasteSchema = <T extends string>(
  destination: string,
  organicOnly: boolean,
  type: readonly T[],
) => {
  const { schemaMass, schemaVolume } = createUnitSchemas(
    destination,
    organicOnly,
  );
  return z.xor([
    object({
      type: z.enum(type),
      ...schemaMass,
    }),
    object({
      type: z.enum(type),
      ...schemaVolume,
    }),
  ]);
};

export const SolidWasteLandfillInputSchema = createTypedWasteSchema(
  'landfill',
  false,
  SolidWasteLandfillTypes,
);

export const SolidWasteIncinerationInputSchema = createTypedWasteSchema(
  'incineration',
  false,
  SolidWasteIncinerationTypes,
);

export const SolidWasteCompostingInputSchema = createTypedWasteSchema(
  'composting',
  true,
  OrganicWasteTypes,
);

export const SolidWasteAnaerobicDigestionInputSchema = createTypedWasteSchema(
  'anaerobic digestion',
  true,
  OrganicWasteTypes,
);

export const SolidWasteInputSchema = object({
  landfill: z.array(SolidWasteLandfillInputSchema),
  incineration: z.array(SolidWasteIncinerationInputSchema),
  composting: z.array(SolidWasteCompostingInputSchema),
  anaerobicDigestion: z.array(SolidWasteAnaerobicDigestionInputSchema),
});

export type SolidWasteInput = z.input<typeof SolidWasteInputSchema>;
export type SolidWasteInputTransformed = z.output<typeof SolidWasteInputSchema>;
