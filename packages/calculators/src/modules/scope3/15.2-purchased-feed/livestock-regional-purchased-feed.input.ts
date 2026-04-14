import { input } from '@/tools/inputs';
import { z } from 'zod';
import { BasePurchasedFeedInputSchema } from './base-purchased-feed.input';
import {
  PurchasedFeedLivestockTypesPerRegion,
  PurchasedFeedLivestockRegionalType,
} from '@/constants/enums';

export const PurchasedFeedBrazilInputSchema =
  BasePurchasedFeedInputSchema.extend({
    type: z
      .literal(PurchasedFeedLivestockTypesPerRegion.Brazil)
      .transform((val) => input('purchased feed type', val))
      .meta({
        description: 'The type of feed purchased.',
      }),
    region: z
      .literal(['Brazil'])
      .transform((val) => input('region of origin of purchased feed', val)),
  });
export type PurchasedFeedBrazilianInput = z.input<
  typeof PurchasedFeedBrazilInputSchema
>;
export type PurchasedFeedBrazilianTransformed = z.output<
  typeof PurchasedFeedBrazilInputSchema
>;

export const PurchasedFeedAustralianInputSchema =
  BasePurchasedFeedInputSchema.extend({
    type: z
      .literal(PurchasedFeedLivestockTypesPerRegion.Australia)
      .transform((val) =>
        input(
          'purchased feed type',
          val as PurchasedFeedLivestockRegionalType<'Australia'>,
        ),
      )
      .meta({
        description: 'The type of feed purchased.',
      }),
    region: z
      .literal(['Australia'])
      .transform((val) => input('region of origin of purchased feed', val)),
  });
export type PurchasedFeedAustralianInput = z.input<
  typeof PurchasedFeedAustralianInputSchema
>;
export type PurchasedFeedAustraliaTransformed = z.output<
  typeof PurchasedFeedAustralianInputSchema
>;

export const PurchasedFeedNSWInputSchema = BasePurchasedFeedInputSchema.extend({
  type: z
    .literal(PurchasedFeedLivestockTypesPerRegion.NSW)
    .transform((val) =>
      input(
        'purchased feed type',
        val as PurchasedFeedLivestockRegionalType<'NSW'>,
      ),
    )
    .meta({
      description: 'The type of feed purchased.',
    }),
  region: z
    .literal(['NSW'])
    .transform((val) => input('region of origin of purchased feed', val)),
});
export type PurchasedFeedNSWInput = z.input<typeof PurchasedFeedNSWInputSchema>;
export type PurchasedFeedNSWInputTransformed = z.output<
  typeof PurchasedFeedNSWInputSchema
>;

export const PurchasedFeedNTInputSchema = BasePurchasedFeedInputSchema.extend({
  type: z
    .literal(PurchasedFeedLivestockTypesPerRegion.NT)
    .transform((val) =>
      input(
        'purchased feed type',
        val as PurchasedFeedLivestockRegionalType<'NT'>,
      ),
    )
    .meta({
      description: 'The type of feed purchased.',
    }),
  region: z
    .literal(['NT'])
    .transform((val) => input('region of origin of purchased feed', val)),
});
export type PurchasedFeedNTInput = z.input<typeof PurchasedFeedNTInputSchema>;
export type PurchasedFeedNTInputTransformed = z.output<
  typeof PurchasedFeedNTInputSchema
>;

export const PurchasedFeedQLDInputSchema = BasePurchasedFeedInputSchema.extend({
  type: z
    .literal(PurchasedFeedLivestockTypesPerRegion.QLD)
    .transform((val) =>
      input(
        'purchased feed type',
        val as PurchasedFeedLivestockRegionalType<'QLD'>,
      ),
    )
    .meta({
      description: 'The type of feed purchased.',
    }),
  region: z
    .literal(['QLD'])
    .transform((val) => input('region of origin of purchased feed', val)),
});
export type PurchasedFeedQLDInput = z.input<typeof PurchasedFeedQLDInputSchema>;
export type PurchasedFeedQLDInputTransformed = z.output<
  typeof PurchasedFeedQLDInputSchema
>;

export const PurchasedFeedSAInputSchema = BasePurchasedFeedInputSchema.extend({
  type: z
    .literal(PurchasedFeedLivestockTypesPerRegion.SA)
    .transform((val) =>
      input(
        'purchased feed type',
        val as PurchasedFeedLivestockRegionalType<'SA'>,
      ),
    )
    .meta({
      description: 'The type of feed purchased.',
    }),
  region: z
    .literal(['SA'])
    .transform((val) => input('region of origin of purchased feed', val)),
});
export type PurchasedFeedSAInput = z.input<typeof PurchasedFeedSAInputSchema>;
export type PurchasedFeedSAInputTransformed = z.output<
  typeof PurchasedFeedSAInputSchema
>;

export const PurchasedFeedTASInputSchema = BasePurchasedFeedInputSchema.extend({
  type: z
    .literal(PurchasedFeedLivestockTypesPerRegion.TAS)
    .transform((val) =>
      input(
        'purchased feed type',
        val as PurchasedFeedLivestockRegionalType<'TAS'>,
      ),
    )
    .meta({
      description: 'The type of feed purchased.',
    }),
  region: z
    .literal(['TAS'])
    .transform((val) => input('region of origin of purchased feed', val)),
});
export type PurchasedFeedTASInput = z.input<typeof PurchasedFeedTASInputSchema>;
export type PurchasedFeedTASInputTransformed = z.output<
  typeof PurchasedFeedTASInputSchema
>;

export const PurchasedFeedVICInputSchema = BasePurchasedFeedInputSchema.extend({
  type: z
    .literal(PurchasedFeedLivestockTypesPerRegion.VIC)
    .transform((val) =>
      input(
        'purchased feed type',
        val as PurchasedFeedLivestockRegionalType<'VIC'>,
      ),
    )
    .meta({
      description: 'The type of feed purchased.',
    }),
  region: z
    .literal(['VIC'])
    .transform((val) => input('region of origin of purchased feed', val)),
});
export type PurchasedFeedVICInput = z.input<typeof PurchasedFeedVICInputSchema>;
export type PurchasedFeedVICInputTransformed = z.output<
  typeof PurchasedFeedVICInputSchema
>;

export const PurchasedFeedWAInputSchema = BasePurchasedFeedInputSchema.extend({
  type: z
    .literal(PurchasedFeedLivestockTypesPerRegion.WA)
    .transform((val) =>
      input(
        'purchased feed type',
        val as PurchasedFeedLivestockRegionalType<'WA'>,
      ),
    )
    .meta({
      description: 'The type of feed purchased.',
    }),
  region: z
    .literal(['WA'])
    .transform((val) => input('region of origin of purchased feed', val)),
});
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
