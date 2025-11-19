import { AllConstants, loadConstants } from '@/constants';
import { CALCULATOR_VERSION } from '../constants';
import { Environment } from '../types';
import { packageVersion } from '../version';
import { trackCalculatorExecution } from './metrics';

export type CalculatorOptions = {
  disableMetrics?: boolean;
  organisation?: string;
};

/**
 * The BrowserEnvironment can provide a calculator execution with all of the config and setup logic it needs,
 * without any coupling to node dependencies. It must be free to run in a browser environment, and be easy
 * for a front end style bundler to satisfy it's dependencies
 */
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
