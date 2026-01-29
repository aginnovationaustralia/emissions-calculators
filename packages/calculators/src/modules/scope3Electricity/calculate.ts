import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { selectConstant } from '@/tools/constants';
import { massPerElectricity } from '@/tools/units';
import { GrainsCropTransformed } from '@/types/Grains/crop.input';
import { GrainsInputTransformed } from '@/types/Grains/input';

export const calculateElectricityScope3 = (
  crop: GrainsCropTransformed,
  input: GrainsInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;

  /*
  Scope 3 emissions from purchased electricity, 𝐸3,𝑒𝑙𝑒𝑐 (t CO2e), under the location-
  based approach are estimated as:
  𝐸3,𝑒𝑙𝑒𝑐 = 𝑄𝑒𝑙𝑒𝑐 × 𝐸𝐹 3,𝑒𝑙𝑒𝑐 × 10−3
  Where Qelec = amount of electricity purchased from the grid (kWh) (same as that
  used in Section 14.1)
  EF3,elec = Scope 3 emission factor for purchased electricity (kg CO2e/kWh)
  */
  const qelec = input.electricityUse;
  const ef3elec = selectConstant(
    constants.COMMON,
    (value) => massPerElectricity('CO2e', value),
    'ELECTRICITY',
    input.state,
    'SCOPE3_EF',
  );

  const e3elec = qelec.multiply(ef3elec);

  // REVISIT: Do we need to add market based Scope 3 emissions as well?

  return e3elec;
};
