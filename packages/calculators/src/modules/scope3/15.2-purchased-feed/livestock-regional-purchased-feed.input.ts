import { input } from '@/tools/inputs';
import { z } from 'zod';
import { BasePurchasedFeedInputSchema } from './base-purchased-feed.input';
import {
  PurchasedFeedLivestockTypesPerRegion,
  PurchasedFeedLivestockRegionalType,
  PurchasedFeedRegion,
} from '@/constants/enums';

export const createPurchasedFeedInputSchemaForRegion = <
  R extends PurchasedFeedRegion,
>(
  region: R,
) =>
  BasePurchasedFeedInputSchema.extend({
    type: z
      .literal(PurchasedFeedLivestockTypesPerRegion[region])
      .transform((val) =>
        input(
          'purchased feed type',
          val as PurchasedFeedLivestockRegionalType<R>,
        ),
      )
      .meta({
        description: 'The type of feed purchased.',
      }),
    region: z
      .literal([region])
      .transform((val) => input('region of origin of purchased feed', val))
      .meta({ description: 'The region of origin of the purchased feed' }),
  });

export const PurchasedFeedBrazilInputSchema =
  createPurchasedFeedInputSchemaForRegion('Brazil');
export type PurchasedFeedBrazilianInput = z.input<
  typeof PurchasedFeedBrazilInputSchema
>;
export type PurchasedFeedBrazilianTransformed = z.output<
  typeof PurchasedFeedBrazilInputSchema
>;

export const PurchasedFeedAustralianInputSchema =
  createPurchasedFeedInputSchemaForRegion('Australia');
export type PurchasedFeedAustralianInput = z.input<
  typeof PurchasedFeedAustralianInputSchema
>;
export type PurchasedFeedAustraliaTransformed = z.output<
  typeof PurchasedFeedAustralianInputSchema
>;

export const PurchasedFeedNSWInputSchema =
  createPurchasedFeedInputSchemaForRegion('NSW');
export type PurchasedFeedNSWInput = z.input<typeof PurchasedFeedNSWInputSchema>;
export type PurchasedFeedNSWInputTransformed = z.output<
  typeof PurchasedFeedNSWInputSchema
>;

export const PurchasedFeedNTInputSchema =
  createPurchasedFeedInputSchemaForRegion('NT');
export type PurchasedFeedNTInput = z.input<typeof PurchasedFeedNTInputSchema>;
export type PurchasedFeedNTInputTransformed = z.output<
  typeof PurchasedFeedNTInputSchema
>;

export const PurchasedFeedQLDInputSchema =
  createPurchasedFeedInputSchemaForRegion('QLD');
export type PurchasedFeedQLDInput = z.input<typeof PurchasedFeedQLDInputSchema>;
export type PurchasedFeedQLDInputTransformed = z.output<
  typeof PurchasedFeedQLDInputSchema
>;

export const PurchasedFeedSAInputSchema =
  createPurchasedFeedInputSchemaForRegion('SA');
export type PurchasedFeedSAInput = z.input<typeof PurchasedFeedSAInputSchema>;
export type PurchasedFeedSAInputTransformed = z.output<
  typeof PurchasedFeedSAInputSchema
>;

export const PurchasedFeedTASInputSchema =
  createPurchasedFeedInputSchemaForRegion('TAS');
export type PurchasedFeedTASInput = z.input<typeof PurchasedFeedTASInputSchema>;
export type PurchasedFeedTASInputTransformed = z.output<
  typeof PurchasedFeedTASInputSchema
>;

export const PurchasedFeedVICInputSchema =
  createPurchasedFeedInputSchemaForRegion('VIC');
export type PurchasedFeedVICInput = z.input<typeof PurchasedFeedVICInputSchema>;
export type PurchasedFeedVICInputTransformed = z.output<
  typeof PurchasedFeedVICInputSchema
>;

export const PurchasedFeedWAInputSchema =
  createPurchasedFeedInputSchemaForRegion('WA');
export type PurchasedFeedWAInput = z.input<typeof PurchasedFeedWAInputSchema>;
export type PurchasedFeedWAInputTransformed = z.output<
  typeof PurchasedFeedWAInputSchema
>;

export const PurchasedFeedLivestockRegionalInputSchema = z.discriminatedUnion(
  'region',
  [
    PurchasedFeedBrazilInputSchema,
    PurchasedFeedAustralianInputSchema,
    PurchasedFeedNSWInputSchema,
    PurchasedFeedNTInputSchema,
    PurchasedFeedQLDInputSchema,
    PurchasedFeedSAInputSchema,
    PurchasedFeedTASInputSchema,
    PurchasedFeedVICInputSchema,
    PurchasedFeedWAInputSchema,
  ],
);

export type PurchasedFeedLivestockRegionalInput = z.input<
  typeof PurchasedFeedLivestockRegionalInputSchema
>;
export type PurchasedFeedLivestockRegionalInputTransformed = z.output<
  typeof PurchasedFeedLivestockRegionalInputSchema
>;

export const purchasedFeedIsBrazilian = (
  feed: PurchasedFeedLivestockRegionalInputTransformed,
): feed is PurchasedFeedBrazilianTransformed => {
  return feed.region.unit === 'Brazil';
};

export const purchasedFeedIsAustralian = (
  feed: PurchasedFeedLivestockRegionalInputTransformed,
): feed is PurchasedFeedAustraliaTransformed => {
  return feed.region.unit === 'Australia';
};

export const purchasedFeedIsNSW = (
  feed: PurchasedFeedLivestockRegionalInputTransformed,
): feed is PurchasedFeedNSWInputTransformed => {
  return feed.region.unit === 'NSW';
};

export const purchasedFeedIsNT = (
  feed: PurchasedFeedLivestockRegionalInputTransformed,
): feed is PurchasedFeedNTInputTransformed => {
  return feed.region.unit === 'NT';
};

export const purchasedFeedIsQLD = (
  feed: PurchasedFeedLivestockRegionalInputTransformed,
): feed is PurchasedFeedQLDInputTransformed => {
  return feed.region.unit === 'QLD';
};

export const purchasedFeedIsSA = (
  feed: PurchasedFeedLivestockRegionalInputTransformed,
): feed is PurchasedFeedSAInputTransformed => {
  return feed.region.unit === 'SA';
};

export const purchasedFeedIsTAS = (
  feed: PurchasedFeedLivestockRegionalInputTransformed,
): feed is PurchasedFeedTASInputTransformed => {
  return feed.region.unit === 'TAS';
};

export const purchasedFeedIsVIC = (
  feed: PurchasedFeedLivestockRegionalInputTransformed,
): feed is PurchasedFeedVICInputTransformed => {
  return feed.region.unit === 'VIC';
};

export const purchasedFeedIsWA = (
  feed: PurchasedFeedLivestockRegionalInputTransformed,
): feed is PurchasedFeedWAInputTransformed => {
  return feed.region.unit === 'WA';
};
