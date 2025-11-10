import { CalculatorConfig } from './config';
import { mixPanelInstance } from './mixpanel';

export function trackCalculatorExecution(
  calculator: string,
  calculatorVersion: string,
  failed: boolean,
) {
  if (CalculatorConfig.isMetricsEnabled()) {
    mixPanelInstance?.track('Execute package calculation', {
      calculator,
      calculatorVersion,
      failed,
      packageVersion: CalculatorConfig.packageVersion(),
      organisation: CalculatorConfig.organisation(),
    });
  }
}
