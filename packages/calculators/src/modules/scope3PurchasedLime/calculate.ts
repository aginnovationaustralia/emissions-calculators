import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { selectConstant } from '@/tools/constants';
import { massPerMass } from '@/tools/units';
import { LimeInputTransformed } from '../scope1FertiliserUse/lime.input';

export const calculateScope3Lime = (
  crop: LimeInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  /*
  The embedded emissions for purchased lime 𝐸 (t CO2e) are calculated as:
𝐸 = 𝑀𝑙𝑖𝑚𝑒 × 𝐸𝐹 𝑙
Where 𝑀𝑙𝑖𝑚𝑒 = total quantity of lime applied to soils (t)
𝐸𝐹 𝑙 = emission factor for purchased lime (t CO2e/t)
*/
  const mlime = crop.limestone;
  const efl = selectConstant(
    constants.COMMON,
    (val) => massPerMass('CO2e', 'Lime', val),
    'LIME_SCOPE3_EF',
  );
  const lime = mlime.multiply(efl);
  // TODO: Should we allow custom emissions factor for lime?

  return {
    lime,
  };
};
