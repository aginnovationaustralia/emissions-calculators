import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { ExecutionContext } from '@/calculators/Grains/constants/executionContext';
import { selectConstant } from '@/tools/constants';
import { sum } from '@/tools/sum';
import { AgrichemicalsInputTransformed } from './agrichemicals.input';

export const calculateScope3Agrichemicals = (
  crop: AgrichemicalsInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
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
    const customEmissionsFactor = chemical.customEmissionsFactor;
    const emissionsFactor = selectConstant(
      constants.COMMON,
      'AGROCHEMICAL_FACTORS',
      type,
    );
    return qh.multiply(customEmissionsFactor ?? emissionsFactor);
  });

  const agrichemicals = sum(emissionsFromPurchases);
  return {
    agrichemicals,
  };
};
