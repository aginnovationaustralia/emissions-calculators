import { input } from '@/tools/inputs';
import { z } from 'zod';
import {
  BasePurchasedGrowMediaByMassInputSchema,
  BasePurchasedGrowMediaByVolumeInputSchema,
} from './base-purchased-grow-media.input';
import {
  PurchasedGrowMediaByMassType,
  PurchasedGrowMediaByMassTypes,
  PurchasedGrowMediaByVolumeType,
  PurchasedGrowMediaByVolumeTypes,
} from '@/constants/enums';

export const PurchasedGrowMediaByMassMethod1InputSchema =
  BasePurchasedGrowMediaByMassInputSchema.extend({
    type: z
      .literal(PurchasedGrowMediaByMassTypes)
      .transform((val) =>
        input('purchased grow media type', val as PurchasedGrowMediaByMassType),
      )
      .meta({
        description: 'The type of grow media purchased.',
      }),
  });
export type PurchasedGrowMediaByMassMethod1Input = z.input<
  typeof PurchasedGrowMediaByMassMethod1InputSchema
>;
export type PurchasedGrowMediaByMassMethod1InputTransformed = z.output<
  typeof PurchasedGrowMediaByMassMethod1InputSchema
>;

export const PurchasedGrowMediaByVolumeMethod1InputSchema =
  BasePurchasedGrowMediaByVolumeInputSchema.extend({
    type: z
      .literal(PurchasedGrowMediaByVolumeTypes)
      .transform((val) =>
        input(
          'purchased grow media type',
          val as PurchasedGrowMediaByVolumeType,
        ),
      )
      .meta({
        description: 'The type of grow media purchased.',
      }),
  });
export type PurchasedGrowMediaByVolumeMethod1Input = z.input<
  typeof PurchasedGrowMediaByVolumeMethod1InputSchema
>;
export type PurchasedGrowMediaByVolumeMethod1InputTransformed = z.output<
  typeof PurchasedGrowMediaByVolumeMethod1InputSchema
>;

export const PurchasedGrowMediaMethod1InputSchema = z.discriminatedUnion(
  'type',
  [
    PurchasedGrowMediaByMassMethod1InputSchema,
    PurchasedGrowMediaByVolumeMethod1InputSchema,
  ],
);
export type PurchasedGrowMediaMethod1Input = z.input<
  typeof PurchasedGrowMediaMethod1InputSchema
>;
export type PurchasedGrowMediaMethod1InputTransformed = z.output<
  typeof PurchasedGrowMediaMethod1InputSchema
>;

export const purchasedGrowMediaMethod1IsByMass = (
  growMedia: PurchasedGrowMediaMethod1InputTransformed,
): growMedia is PurchasedGrowMediaByMassMethod1InputTransformed => {
  return PurchasedGrowMediaByMassTypes.includes(
    growMedia.type.unit as PurchasedGrowMediaByMassType,
  );
};

export const purchasedGrowMediaMethod1IsByVolume = (
  growMedia: PurchasedGrowMediaMethod1InputTransformed,
): growMedia is PurchasedGrowMediaByVolumeMethod1InputTransformed => {
  return PurchasedGrowMediaByVolumeTypes.includes(
    growMedia.type.unit as PurchasedGrowMediaByVolumeType,
  );
};
