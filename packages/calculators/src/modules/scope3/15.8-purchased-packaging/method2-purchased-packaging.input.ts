import { numberInput } from '@/tools/inputs';
import { PACKAGING_15_8 } from '@/tools/modules';
import { mass, massPerMass } from '@/tools/units';
import { z } from 'zod';
import {
  BasePurchasedPackagingByMassInputSchema,
  BasePurchasedPackagingByUnitsInputSchema,
} from './base-purchased-packaging.input';

export const PurchasedPackagingByUnitsMethod2InputSchema =
  BasePurchasedPackagingByUnitsInputSchema.extend({
    customEmissionsFactor: numberInput(
      (val) => mass('CO2e', val),
      {
        name: 'custom emissions factor',
        method: '2',
        scope: '3',
        description:
          'Method 2: Emission factor of the type of packaging purchased.',
        modules: [PACKAGING_15_8],
      },
      (s) => s.min(0),
    ),
  }).meta({ title: 'Quantity by units' });

export type PurchasedPackagingByUnitsMethod2Input = z.input<
  typeof PurchasedPackagingByUnitsMethod2InputSchema
>;
export type PurchasedPackagingByUnitsMethod2InputTransformed = z.output<
  typeof PurchasedPackagingByUnitsMethod2InputSchema
>;

export const PurchasedPackagingByMassMethod2InputSchema =
  BasePurchasedPackagingByMassInputSchema.extend({
    customEmissionsFactor: numberInput(
      (val) => massPerMass('CO2e', 'Packaging', val),
      {
        name: 'custom emissions factor',
        method: '2',
        scope: '3',
        description:
          'Method 2: Emission factor of the type of packaging purchased.',
        modules: [PACKAGING_15_8],
      },
      (s) => s.min(0),
    ),
  }).meta({ title: 'Quantity by mass' });

export type PurchasedPackagingByMassMethod2Input = z.input<
  typeof PurchasedPackagingByMassMethod2InputSchema
>;
export type PurchasedPackagingByMassMethod2InputTransformed = z.output<
  typeof PurchasedPackagingByMassMethod2InputSchema
>;

export const PurchasedPackagingMethod2InputSchema = z
  .xor([
    PurchasedPackagingByUnitsMethod2InputSchema,
    PurchasedPackagingByMassMethod2InputSchema,
  ])
  .meta({ title: 'Method 2 (custom emissions factor)' });

export type PurchasedPackagingMethod2Input = z.input<
  typeof PurchasedPackagingMethod2InputSchema
>;
export type PurchasedPackagingMethod2InputTransformed = z.output<
  typeof PurchasedPackagingMethod2InputSchema
>;
