import { ExecutionContext } from '@/calculators/executionContext';
import { HasCommonConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { captureMethod1Or2Value } from '@/tools/multi';
import { zeroCO2e } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { AgrichemicalsInputTransformed } from './agrichemicals.input';

export const calculateScope3Agrichemicals = (
  crop: AgrichemicalsInputTransformed,
  context: ExecutionContext<HasCommonConstants>,
) => {
  const { constants } = context;
  /*
15.5.1.1 Method 1 -- Purchased Agrichemicals
(1) Total emissions from purchased agrichemicals E (t CO2e) are calculated as:
E = SUMh Qh * EF h * 10^-3
Where Qh = quantity of agrichemical type h purchased (kg)
EF h = emission factor of purchased agrichemical (kg CO2e/kg)
*/
  const emissionsFromPurchases = crop.chemicals.map((chemical) => {
    const type = chemical.type;
    const qh = chemical.amountKg;
    const emissionsFactor = captureMethod1Or2Value(
      selectConstant(constants.COMMON, 'AGROCHEMICAL_FACTORS', type),
      chemical.customEmissionsFactor,
    ).named('EFh');
    return qh.multiply(emissionsFactor).named('E').reference('15.5.1.1 (1)');
  });

  const agrichemicals = sum(emissionsFromPurchases, zeroCO2e);
  return agrichemicals;
};
