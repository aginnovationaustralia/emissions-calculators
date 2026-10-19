import { object } from '@/types/schemas';
import z from 'zod';
import { BeefPurchasedLivestockSchema } from './purchased-beef.input';
import { DairyPurchasedLivestockSchema } from './purchased-dairy.input';
import { OtherPurchasedLivestockSchema } from './purchased-other.input';
import { PigPurchasedLivestockSchema } from './purchased-pig.input';
import { PoultryPurchasedLivestockSchema } from './purchased-poultry.input';
import { SheepPurchasedLivestockSchema } from './purchased-sheep.input';

// `BeefPurchasedLivestockSchema` is itself a `z.xor` (method 1's `category` vs
// method 2's `emissionFactorMethod2`), and `z.xor` options don't expose the
// propValues `z.discriminatedUnion` needs to fast-path on `type` - so every
// option here has to be combined the same way, via `z.xor`, rather than
// `z.discriminatedUnion('type', [...])`. Both render identically in the
// generated OpenAPI (an exclusive `oneOf`).
export const PurchasedLivestockInputSchema = z.xor([
  BeefPurchasedLivestockSchema,
  DairyPurchasedLivestockSchema,
  OtherPurchasedLivestockSchema,
  PigPurchasedLivestockSchema,
  PoultryPurchasedLivestockSchema,
  SheepPurchasedLivestockSchema,
]);

export const HasPurchasedLivestockInputSchema = object({
  purchasedLivestock: z.array(PurchasedLivestockInputSchema),
});

export type HasPurchasedLivestockInput = z.input<
  typeof HasPurchasedLivestockInputSchema
>;
export type HasPurchasedLivestockInputTransformed = z.output<
  typeof HasPurchasedLivestockInputSchema
>;

export type PurchasedLivestockInput = z.input<
  typeof PurchasedLivestockInputSchema
>;
export type PurchasedLivestockInputTransformed = z.output<
  typeof PurchasedLivestockInputSchema
>;

/*
 * The single-species calculators (Beef, Dairy, Feedlot, OtherLivestock, Pigs,
 * Poultry, Sheep) only ever buy livestock of their own kind, so each gets a
 * `purchasedLivestock` restricted to just its own schema rather than the full
 * `PurchasedLivestockInputSchema` union above (which stays for AllModules,
 * where any combination of species can appear).
 */
export const HasBeefPurchasedLivestockInputSchema = object({
  purchasedLivestock: z.array(BeefPurchasedLivestockSchema),
});
export type HasBeefPurchasedLivestockInput = z.input<
  typeof HasBeefPurchasedLivestockInputSchema
>;
export type HasBeefPurchasedLivestockInputTransformed = z.output<
  typeof HasBeefPurchasedLivestockInputSchema
>;

export const HasDairyPurchasedLivestockInputSchema = object({
  purchasedLivestock: z.array(DairyPurchasedLivestockSchema),
});
export type HasDairyPurchasedLivestockInput = z.input<
  typeof HasDairyPurchasedLivestockInputSchema
>;
export type HasDairyPurchasedLivestockInputTransformed = z.output<
  typeof HasDairyPurchasedLivestockInputSchema
>;

export const HasOtherPurchasedLivestockInputSchema = object({
  purchasedLivestock: z.array(OtherPurchasedLivestockSchema),
});
export type HasOtherPurchasedLivestockInput = z.input<
  typeof HasOtherPurchasedLivestockInputSchema
>;
export type HasOtherPurchasedLivestockInputTransformed = z.output<
  typeof HasOtherPurchasedLivestockInputSchema
>;

export const HasPigPurchasedLivestockInputSchema = object({
  purchasedLivestock: z.array(PigPurchasedLivestockSchema),
});
export type HasPigPurchasedLivestockInput = z.input<
  typeof HasPigPurchasedLivestockInputSchema
>;
export type HasPigPurchasedLivestockInputTransformed = z.output<
  typeof HasPigPurchasedLivestockInputSchema
>;

export const HasPoultryPurchasedLivestockInputSchema = object({
  purchasedLivestock: z.array(PoultryPurchasedLivestockSchema),
});
export type HasPoultryPurchasedLivestockInput = z.input<
  typeof HasPoultryPurchasedLivestockInputSchema
>;
export type HasPoultryPurchasedLivestockInputTransformed = z.output<
  typeof HasPoultryPurchasedLivestockInputSchema
>;

export const HasSheepPurchasedLivestockInputSchema = object({
  purchasedLivestock: z.array(SheepPurchasedLivestockSchema),
});
export type HasSheepPurchasedLivestockInput = z.input<
  typeof HasSheepPurchasedLivestockInputSchema
>;
export type HasSheepPurchasedLivestockInputTransformed = z.output<
  typeof HasSheepPurchasedLivestockInputSchema
>;
