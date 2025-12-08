import { ElectricitySource, State } from '@/types/enums';
import { ExecutionContext } from '../../executionContext';

/**
 *
 * @param state
 * @param electricitySource
 * @param percentRenewable what % of electricity use is drawn from renewable
 * @param annualElectricityUse for cattle enterprise, KWh
 */
export function calculateElectricityScope2And3(
  state: State,
  electricitySource: ElectricitySource,
  percentRenewable: number,
  annualElectricityUse: number,
  context: ExecutionContext,
) {
  const { constants } = context;
  const stateGridQuantity = annualElectricityUse * (1 - percentRenewable);
  const scope2EF = constants.COMMON.ELECTRICITY[state].SCOPE2_EF;
  const scope3EF = constants.COMMON.ELECTRICITY[state].SCOPE3_EF;
  const scope2Emissions = stateGridQuantity * scope2EF;
  const scope3Emissions = stateGridQuantity * scope3EF;
  const scope2FinalEmissions =
    (electricitySource === 'Renewable' ? 0 : scope2Emissions) / 1000; // 0 is due to renewables having no emissions, t CO2-e / kWh
  const scope3FinalEmissions =
    (electricitySource === 'Renewable' ? 0 : scope3Emissions) / 1000;
  return {
    scope2: scope2FinalEmissions,
    scope3: scope3FinalEmissions,
  };
}
