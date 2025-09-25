import { CommonConstants } from '../../common/constants';
import { ExecutionContext } from '../../executionContext';
import { ElectricitySource, State } from '../../types/types';

// this is done once for beef, once for sheep
/**
 *
 * @param state
 * @param electricitySource
 * @param percentRenewable what % of electricity use is drawn from renewable (dataInputBeefD94)
 * @param annualElectricityUse for cattle enterprise, KWh (dataInputBeefD97)
 */
export function calculateElectricityScope2And3(
  state: State,
  electricitySource: ElectricitySource,
  percentRenewable: number,
  annualElectricityUse: number,
  context: ExecutionContext<CommonConstants>,
) {
  const { constants } = context;
  const stateGridQuantity = annualElectricityUse * (1 - percentRenewable); // (electricityD6)
  const scope2EF = constants.COMMON.ELECTRICITY[state].SCOPE2_EF; // (electricityM13)
  const scope3EF = constants.COMMON.ELECTRICITY[state].SCOPE3_EF;
  const scope2Emissions = stateGridQuantity * scope2EF; // (electricityG6)
  const scope3Emissions = stateGridQuantity * scope3EF; // (electricityG6)
  const scope2FinalEmissions =
    (electricitySource === 'Renewable' ? 0 : scope2Emissions) / 1000; // 0 is due to renewables having no emisisons, t CO2-e / kWh (electricityC9)
  const scope3FinalEmissions =
    (electricitySource === 'Renewable' ? 0 : scope3Emissions) / 1000;
  return {
    scope2: scope2FinalEmissions,
    scope3: scope3FinalEmissions,
  };
}
