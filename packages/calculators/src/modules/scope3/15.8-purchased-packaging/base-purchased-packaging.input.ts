import { numberInput } from '@/tools/inputs';
import { PACKAGING_15_8 } from '@/tools/modules';
import { mass, realNumber } from '@/tools/units';
import { object } from '@/types/schemas';
import z from 'zod';

export const BasePurchasedPackagingByUnitsInputSchema = object({
  amountUnits: numberInput(
    (val) => realNumber(val),
    {
      name: 'Qp (units)',
      description: 'Quantity of packaging units purchased.',
      modules: [PACKAGING_15_8],
    },
    (s) => s.min(0),
  ),
});

export const BasePurchasedPackagingByMassInputSchema = object({
  amountMass: numberInput(
    (val) => mass('Packaging', val),
    {
      name: 'Qp (mass)',
      description: 'Quantity of packaging mass purchased.',
      modules: [PACKAGING_15_8],
    },
    (s) => s.min(0),
  ),
});

export type BasePurchasedPackagingByUnitsInputTransformed = z.output<
  typeof BasePurchasedPackagingByUnitsInputSchema
>;

export type BasePurchasedPackagingByMassInputTransformed = z.output<
  typeof BasePurchasedPackagingByMassInputSchema
>;

export const isPurchasedPackagingByUnits = (
  packaging:
    | BasePurchasedPackagingByUnitsInputTransformed
    | BasePurchasedPackagingByMassInputTransformed,
): packaging is BasePurchasedPackagingByUnitsInputTransformed => {
  return 'amountUnits' in packaging;
};
