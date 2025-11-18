import { AllConstants, loadConstants } from '@/constants';
import { CALCULATOR_VERSION } from '../constants';
import { Environment } from '../types';
import { packageVersion } from '../version';
import { trackCalculatorExecution } from './metrics';

export type CalculatorOptions = {
  disableMetrics?: boolean;
  organisation?: string;
};

export class BrowserEnvironment implements Environment {
  private disableMetrics: boolean;
  private organisation: string | undefined;

  constructor(options?: CalculatorOptions) {
    this.disableMetrics = options?.disableMetrics ?? false;
    this.organisation = options?.organisation ?? undefined;
  }

  loadConstants(): AllConstants {
    return loadConstants();
  }

  isMetricsEnabled(): boolean {
    return !this.disableMetrics;
  }

  getOrganisation(): string | undefined {
    return this.organisation;
  }

  trackCalculatorExecution(calculatorName: string, failed: boolean) {
    trackCalculatorExecution({
      calculator: calculatorName,
      failed,
      calculatorVersion: CALCULATOR_VERSION,
      packageVersion: packageVersion(),
      organisation: this.getOrganisation(),
    });
  }
}
