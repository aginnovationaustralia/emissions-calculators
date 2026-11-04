import { numberInput } from '@/tools/inputs';
import { PURCH_LIVESTOCK_15_1 } from '@/tools/modules';
import { head, liveweight, massPerMass } from '@/tools/units';
import { object } from '@/types/schemas';

/**
 * Just the input every purchased livestock type needs, regardless of how it
 * establishes liveweight or emission factor - each type builds its own
 * method 1 / method 2 split for both on top of this (see
 * `purchased-beef.input.ts` for the pattern every other type follows).
 */
export const HeadPurchasedSchema = object({
  headPurchased: numberInput(
    (v) => head(v),
    {
      name: 'Nco',
      description: 'Number of animals purchased',
      modules: [PURCH_LIVESTOCK_15_1],
    },
    (s) => s.gt(0),
  ),
});

export const PurchasedLivestockEmissionFactorMethod2Schema = object({
  method2EmissionFactor: numberInput(
    (v) => massPerMass('CO2e', 'Liveweight', v),
    {
      name: 'EFco',
      description: 'Emission factor for purchased livestock',
      method: '2',
      modules: [PURCH_LIVESTOCK_15_1],
    },
    (s) => s.gt(0),
  ),
});

export const PurchasedLivestockLiveweightMethod2Schema = object({
  method2LiveweightKilograms: numberInput(
    (v) => liveweight(v),
    {
      name: 'Wco',
      description: 'Liveweight of purchased livestock',
      method: '2',
      modules: [PURCH_LIVESTOCK_15_1],
    },
    (s) => s.gt(0),
  ),
});

/**
 * Every purchase type's method 1 / method 2 xor uses these exact two key
 * names for its override fields (see `PurchasedLivestockEmissionFactorMethod2Schema`
 * / `PurchasedLivestockLiveweightMethod2Schema` above), so one generic pair of
 * guards - narrowing on `T` inferred per call site - covers every type,
 * instead of each purchased-*.input.ts redefining its own.
 */
export const emissionFactorIsMethod2 = <T extends object>(
  purchase: T,
): purchase is Extract<T, { method2EmissionFactor: unknown }> => {
  return 'method2EmissionFactor' in purchase;
};

export const liveweightIsMethod2 = <T extends object>(
  purchase: T,
): purchase is Extract<T, { method2LiveweightKilograms: unknown }> => {
  return 'method2LiveweightKilograms' in purchase;
};
