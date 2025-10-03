import { CalculatorConfig } from './config';
import { mixPanelinstance } from './mixpanel';

export function trackCalculatorExecution(
  calculator: string,
  calculatorVersion: string,
  failed: boolean,
) {
  if (CalculatorConfig.isMetricsEnabled()) {
    mixPanelinstance?.track('Execute package calculation', {
      calculator,
      calculatorVersion,
      packageVersion: CalculatorConfig.packageVersion(),
      failed,
      organisation: CalculatorConfig.getOrganisation(),
    });
  }
}
