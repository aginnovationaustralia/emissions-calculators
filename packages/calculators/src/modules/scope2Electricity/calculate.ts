import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { selectConstant } from '@/tools/constants';
import { massPerElectricity } from '@/tools/units';
import { GrainsCropTransformed } from '@/types/Grains/crop.input';
import { GrainsInputTransformed } from '@/types/Grains/input';

export const calculateElectricityScope2 = (
  crop: GrainsCropTransformed,
  input: GrainsInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;

  /*
  The location-based Scope 2 emissions from purchased electricity, 𝐸2,𝑒𝑙𝑒𝑐 (t CO2e),
  are estimated by:
  Where 𝐸2,𝑒𝑙𝑒𝑐 = 𝑄𝑒𝑙𝑒𝑐 × 𝐸𝐹2,𝑒𝑙𝑒𝑐 × 10−3
  𝑄𝑒𝑙𝑒𝑐 = amount of electricity purchased from the grid (kWh)
  𝐸𝐹 2,𝑒𝑙𝑒𝑐 = location-based Scope 2 emission factor for electricity (kg CO2e
  /kWh)
  */

  const qelec = input.electricityUse;
  const ef2elec = selectConstant(
    constants.COMMON,
    (value) => massPerElectricity('CO2e', value),
    'ELECTRICITY',
    input.state,
    'SCOPE2_EF',
  );

  const e2elec = qelec.multiply(ef2elec);

  // REVISIT: Do we need to add market based Scope 2 emissions as well?

  return e2elec;
};
