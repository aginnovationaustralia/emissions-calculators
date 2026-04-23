import { input } from '@/tools/inputs';
import { massPerMass, massPerVolume } from '@/tools/units';
import { z } from 'zod';
import {
  BasePurchasedGrowMediaByMassInputSchema,
  BasePurchasedGrowMediaByVolumeInputSchema,
} from './base-purchased-grow-media.input';
import { perCubicMetresToPerLitres } from '@/tools/unit-conversion';

export const PurchasedGrowMediaByMassMethod2InputSchema =
  BasePurchasedGrowMediaByMassInputSchema.extend({
    customEmissionsFactorByMass: z
      .number()
      .min(0)
      .transform((val) =>
        input(
          'custom emissions factor',
          massPerMass('CO2e', 'Grow Media', val),
        ),
      )
      .meta({
        description:
          'Method 2: Emission factor of the type of grow media purchased, in kg CO2e/kg.',
      }),
  });

export type PurchasedGrowMediaByMassMethod2Input = z.input<
  typeof PurchasedGrowMediaByMassMethod2InputSchema
>;
export type PurchasedGrowMediaByMassMethod2InputTransformed = z.output<
  typeof PurchasedGrowMediaByMassMethod2InputSchema
>;

export const PurchasedGrowMediaByVolumeMethod2InputSchema =
  BasePurchasedGrowMediaByVolumeInputSchema.extend({
    customEmissionsFactorByVolume: z
      .number()
      .min(0)
      .transform((val) =>
        input(
          'custom emissions factor',
          massPerVolume('CO2e', 'Grow Media', perCubicMetresToPerLitres(val)),
        ),
      )
      .meta({
        description:
          'Method 2: Emission factor of the type of grow media purchased, in kg CO2e/m^3.',
      }),
  });

export type PurchasedGrowMediaByVolumeMethod2Input = z.input<
  typeof PurchasedGrowMediaByVolumeMethod2InputSchema
>;
export type PurchasedGrowMediaByVolumeMethod2InputTransformed = z.output<
  typeof PurchasedGrowMediaByVolumeMethod2InputSchema
>;

export const PurchasedGrowMediaMethod2InputSchema = z.xor([
  PurchasedGrowMediaByMassMethod2InputSchema,
  PurchasedGrowMediaByVolumeMethod2InputSchema,
]);

export type PurchasedGrowMediaMethod2Input = z.input<
  typeof PurchasedGrowMediaMethod2InputSchema
>;
export type PurchasedGrowMediaMethod2InputTransformed = z.output<
  typeof PurchasedGrowMediaMethod2InputSchema
>;

export const purchasedGrowMediaMethod2IsByMass = (
  growMedia: PurchasedGrowMediaMethod2InputTransformed,
): growMedia is PurchasedGrowMediaByMassMethod2InputTransformed => {
  return (
    (growMedia as PurchasedGrowMediaByMassMethod2InputTransformed)
      .customEmissionsFactorByMass !== undefined
  );
};

export const purchasedGrowMediaMethod2IsByVolume = (
  growMedia: PurchasedGrowMediaMethod2InputTransformed,
): growMedia is PurchasedGrowMediaByVolumeMethod2InputTransformed => {
  return (
    (growMedia as PurchasedGrowMediaByVolumeMethod2InputTransformed)
      .customEmissionsFactorByVolume !== undefined
  );
};
