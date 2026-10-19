import { HasSupplementaryCO2InputTransformed } from './supplementary-co2.input';

export const calculate12Scope1SupplementaryCO2 = (
  input: HasSupplementaryCO2InputTransformed,
) => {
  /*
    12.1.1
    (1) Emissions from the use of supplementary CO2, E (t CO2e), are calculated as:
    E = Q * 10^-3
    Where Q = quantity of supplementary CO2 used within the operations (kg CO2)
    */
  return input.supplementaryCO2Kg.named('E').reference('12.1.1 (1)');
};
