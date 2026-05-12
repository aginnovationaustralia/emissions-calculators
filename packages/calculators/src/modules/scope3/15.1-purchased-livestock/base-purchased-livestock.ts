import { input } from '@/tools/inputs';
import { head, massPerHead, massPerMass } from '@/tools/units';
import { mapOptional } from '@/tools/zod';
import { object } from '@/types/schemas';
import z from 'zod';

export const BasePurchasedLivestockMethod1InputSchema = object({
  calculationMethod: z.literal('1'),
  headPurchased: z
    .number()
    .min(0)
    .transform((val) => input('head purchased', head(val))),
  averageLiveweight: z
    .number()
    .min(0)
    .optional()
    .transform(
      mapOptional((val) =>
        input('head purchased', massPerHead('Liveweight', val)),
      ),
    ),
});

export const BasePurchasedLivestockMethod2InputSchema = object({
  calculationMethod: z.literal('2'),
  headPurchased: z
    .number()
    .min(0)
    .transform((val) => input('head purchased', head(val))),
  averageLiveweight: z
    .number()
    .min(0)
    .transform((val) =>
      input('head purchased', massPerHead('Liveweight', val)),
    ),
  emissionsFactor: z
    .number()
    .min(0)
    .transform((val) =>
      input('custom emissions factor', massPerMass('CO2e', 'Liveweight', val)),
    ),
});
