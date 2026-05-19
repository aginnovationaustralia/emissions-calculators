import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { ExecutionContext } from '@/calculators/executionContext';
import { selectConstant } from '@/tools/constants';
import { sum } from '@/tools/sum';
import { RefrigerantInputsTransformed } from './refrigerants.input';

export const calculateScope1RefrigerantUse = (
  input: RefrigerantInputsTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  /*
    9.1.1 Method 1 - Refrigerant use
    (1) The emissions of refrigerant leaking, ER (tonnes of gas R), is estimated for each refrigerant gas R as:
    
    Where ER = SUMa chargeRa * (leakageRatea / 100) * 10^-3
    chargeRa = amount of refrigerant R contained in appliance a (kg)
    leakageRatea = percentage of total charge leaked each year (%)
*/

  // REVISIT: The guidelines are returning tonnes of gas R, not tonnes of CO2e. I have doen rhe obvious thing
  // and included gwp of the refrigerant. This needs to be reviewed.
  const emissionsRecords = input.refrigerants.map((refrigerant) => {
    const chargeRa = refrigerant.chargeSize.named('chargeRa');
    const leakageRatea = selectConstant(
      constants.COMMON,
      'REFRIGERATION_LEAKAGE_RATES',
      refrigerant.refrigerationType,
    );
    // NOTE: the current guidelines don't convert to CO2e using GWP. We have assumed this is an oversight, and have done the conversion
    const gwp = selectConstant(
      constants.COMMON,
      'REFRIGERANT_GWP',
      refrigerant.refrigerant,
    );
    return gwp.multiply(chargeRa).multiply(leakageRatea);
  });

  return sum(emissionsRecords, { name: 'Er', references: ['9.1.1 (138)'] });
};
