import {
  PurchasedPackagingByMassTypes,
  PurchasedPackagingByUnitsTypes,
} from '@/constants/enums';
import { createValueCheck } from './domain';

export const checkPurchasedPackagingByUnitsType = createValueCheck(
  PurchasedPackagingByUnitsTypes,
  'Purchased packaging by units type',
);

export const checkPurchasedPackagingByMassType = createValueCheck(
  PurchasedPackagingByMassTypes,
  'Purchased packaging by mass type',
);
