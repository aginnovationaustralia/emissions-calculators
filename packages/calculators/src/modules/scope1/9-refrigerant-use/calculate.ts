import { ExecutionContext } from '@/calculators/executionContext';
import { HasCommonConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { sum } from '@/tools/sum';
import { RefrigerantsInputTransformed } from './refrigerants.input';
import { zeroCO2e } from '@/tools/sentinels';

export const calculateScope1RefrigerantUse = (
  input: RefrigerantsInputTransformed,
  context: ExecutionContext<HasCommonConstants>,
) => {
  const { constants } = context;
  /*
    9.1.1 Method 1 - Refrigerant use
    (1) The emissions of refrigerant leaking, ER (tonnes of gas R), is estimated for each refrigerant gas R as:
    
    ER = SUMa chargeRa * (leakageRatea / 100) * 10^-3
    Where:
    chargeRa = amount of refrigerant R contained in appliance a (kg)
    leakageRatea = percentage of total charge leaked each year (%)
*/

  const emissionsRecords = input.refrigerants.map((refrigerant) => {
    const chargeRa = refrigerant.chargeSize.named('chargeRa');
    const leakageRatea = selectConstant(
      constants.COMMON,
      'REFRIGERATION_LEAKAGE_RATES',
      refrigerant.refrigerationType,
    );
    // NOTE: The equation technically generates a mass of a specific gas
    // Based on feedback, we have converted all emissions to CO2e for simplicity
    const gwp = selectConstant(
      constants.COMMON,
      'REFRIGERANT_GWP',
      refrigerant.refrigerant,
    );
    return gwp.multiply(chargeRa).multiply(leakageRatea);
  });

  return sum(emissionsRecords, zeroCO2e, {
    name: 'Er',
    references: ['9.1.1 (1)'],
  });
};
