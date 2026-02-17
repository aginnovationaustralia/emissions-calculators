import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { ExecutionContext } from '@/calculators/Grains/constants/executionContext';
import { selectConstant } from '@/tools/constants';
import { massPerMass } from '@/tools/units';
import { LimeInputTransformed } from '../../scope1/5-fertiliser/lime.input';

export const calculateScope3Lime = (
  crop: LimeInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  /*
  15.6.1.1 Method 1 -- Purchased Lime
  The embedded emissions for purchased lime E (t CO2e) are calculated as:
  E = Mlime * EF l
  Where Mlime = total quantity of lime applied to soils (t)
  EF l = emission factor for purchased lime (t CO2e/t)
  */
  const mlime = crop.limestone;
  const customEmissionsFactor = crop.customEmissionsFactor;
  const efl = selectConstant(
    constants.COMMON,
    (val) => massPerMass('CO2e', 'Lime', val),
    'LIME_SCOPE3_EF',
  );
  const lime = mlime.multiply(customEmissionsFactor ?? efl);

  return lime.attachContext({ references: ['15.6.1.1 (391)'] });
};
