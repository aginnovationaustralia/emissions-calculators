import { getMixpanelInstance } from './mixpanel';

type CalculatorProperties = {
  calculator: string;
  calculatorVersion: string;
  failed: boolean;
  packageVersion: string;
  organisation: string | undefined;
};

export function trackCalculatorExecution(properties: CalculatorProperties) {
  getMixpanelInstance()?.track('Execute package calculation', properties);
}
