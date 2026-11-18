import { object } from '@/types/schemas';
import z from 'zod';
import {
  OtherPurchasedCleaningChemicalInputTransformed,
  OtherPurchasedCleaningChemicalSchema,
} from './cleaning-chemical.input';
import {
  OtherPurchasedCustomInputTransformed,
  OtherPurchasedCustomSchema,
} from './custom.input';
import {
  OtherPurchasedMiscellaneousInputTransformed,
  OtherPurchasedMiscellaneousSchema,
} from './miscellaneous.input';
import {
  OtherPurchasedPharmacyChemicalInputTransformed,
  OtherPurchasedPharmacyChemicalSchema,
} from './pharmacy-chemical.input';
import {
  OtherPurchasedSeedInputTransformed,
  OtherPurchasedSeedSchema,
} from './seed.input';

export * from './cleaning-chemical.input';
export * from './custom.input';
export * from './miscellaneous.input';
export * from './pharmacy-chemical.input';
export * from './seed.input';

export const OtherPurchasedGoodOrServiceSchema = z.xor([
  OtherPurchasedSeedSchema,
  OtherPurchasedMiscellaneousSchema,
  OtherPurchasedCleaningChemicalSchema,
  OtherPurchasedPharmacyChemicalSchema,
  OtherPurchasedCustomSchema,
]);
export type OtherPurchasedGoodOrServiceInput = z.input<
  typeof OtherPurchasedGoodOrServiceSchema
>;
export type OtherPurchasedGoodOrServiceInputTransformed = z.output<
  typeof OtherPurchasedGoodOrServiceSchema
>;

export const isOtherPurchasedSeed = (
  item: OtherPurchasedGoodOrServiceInputTransformed,
): item is OtherPurchasedSeedInputTransformed => 'seedType' in item;

export const isOtherPurchasedMiscellaneous = (
  item: OtherPurchasedGoodOrServiceInputTransformed,
): item is OtherPurchasedMiscellaneousInputTransformed =>
  'miscellaneousType' in item;

export const isOtherPurchasedCleaningChemical = (
  item: OtherPurchasedGoodOrServiceInputTransformed,
): item is OtherPurchasedCleaningChemicalInputTransformed =>
  'cleaningChemicalType' in item;

export const isOtherPurchasedPharmacyChemical = (
  item: OtherPurchasedGoodOrServiceInputTransformed,
): item is OtherPurchasedPharmacyChemicalInputTransformed =>
  'pharmacyChemicalType' in item;

export const isOtherPurchasedCustom = (
  item: OtherPurchasedGoodOrServiceInputTransformed,
): item is OtherPurchasedCustomInputTransformed => 'emissionFactor' in item;

export const OtherPurchasedGoodsAndServicesSchema = object({
  otherPurchasedGoodsAndServices: z
    .array(OtherPurchasedGoodOrServiceSchema)
    .optional()
    .meta({
      description: `Data for any additional purchased goods or services that were used within the reporting period for this enterprise that can't be captured by other inputs. Each item is either a known good (seed, miscellaneous, cleaning chemical or pharmacy chemical) with a built-in emissions factor, or any other item with a custom emissions factor.`,
    }),
});
export type OtherPurchasedGoodsAndServicesInput = z.input<
  typeof OtherPurchasedGoodsAndServicesSchema
>;
export type OtherPurchasedGoodsAndServicesInputTransformed = z.output<
  typeof OtherPurchasedGoodsAndServicesSchema
>;
