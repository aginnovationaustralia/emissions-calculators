import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { selectConstant } from '@/tools/constants';
import { sum } from '@/tools/sum';
import { massPerMass } from '@/tools/units';
import { AgrichemicalsInputTransformed } from './agrichemicals.input';

export const calculateScope3Agrichemicals = (
  crop: AgrichemicalsInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  /*
Total emissions from purchased agrichemicals 𝐸 (t CO2e) are calculated as:
𝐸 = ∑ 𝑄ℎ × 𝐸𝐹 ℎ × 10−3
ℎ
Where Qh = quantity of agrichemical type h purchased (kg)
𝐸𝐹 ℎ = emission factor of purchased agrichemical (kg CO2e/kg)
*/
  const emissionsFromPurchases = crop.chemicals.map((chemical) => {
    const type = chemical.type;
    const qh = chemical.amountKg;
    const customEmissionsFactor = chemical.customEmissionsFactor;
    const emissionsFactor = selectConstant(
      constants.COMMON,
      (val) => massPerMass('CO2e', 'Chemical', val),
      'AGROCHEMICAL_FACTORS',
      type,
    );
    return qh.multiply(customEmissionsFactor ?? emissionsFactor);
  });

  const herbicide = sum(emissionsFromPurchases);
  return {
    herbicide,
  };
};
