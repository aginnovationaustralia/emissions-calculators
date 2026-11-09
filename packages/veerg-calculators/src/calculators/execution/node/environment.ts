import { loadConstants } from '@/calculators/executionContext';
import { AllConstants } from '@/constants/types';
import { AsyncLocalStorage } from 'async_hooks';
import { CalculatorOptions, Environment } from '../types';
import { packageVersion } from '../version';
import { getMixpanelInstance } from './mixpanel';

type CalculationEnvironmentParameters = {
  organisation?: string;
};

/**
 * The CalculationEnvironment is a wrapper around the AsyncLocalStorage API that allows for the
 * overriding of the organisation for a calculator execution. It is designed to wrap a calculator
 * execution in a web server context.
 */
class CalculationEnvironment {
  private static storage =
    new AsyncLocalStorage<CalculationEnvironmentParameters>();

  static run<T>(
    parameters: CalculationEnvironmentParameters,
    callback: () => T,
  ): T {
    return this.storage.run(parameters, callback);
  }

  static getOrganisation(): string | undefined {
    return (
      this.storage.getStore()?.organisation ??
      process.env.CALCULATOR_METRICS_ORGANISATION
    );
  }

  static isMetricsEnabled(): boolean {
    return process.env.DISABLE_CALCULATOR_METRICS !== 'true';
  }

  static loadConstants(): AllConstants {
    return loadConstants();
  }
}

/**
 * Create an instance of an Environment that can be used to execute a calculator in a Node.js context.
 */
class NodeEnvironment implements Environment {
  private disableMetrics: boolean | undefined;
  private organisation: string | undefined;

  constructor(options?: CalculatorOptions) {
    this.disableMetrics = options?.disableMetrics;
    this.organisation = options?.organisation ?? undefined;
  }

  loadConstants(): AllConstants {
    return CalculationEnvironment.loadConstants();
  }

  isMetricsEnabled(): boolean {
    if (this.disableMetrics === true) {
      return false;
    }

    return process.env.DISABLE_CALCULATOR_METRICS !== 'true';
  }

  getOrganisation(): string | undefined {
    if (this.organisation !== undefined) {
      return this.organisation;
    }

    return CalculationEnvironment.getOrganisation();
  }

  trackCalculatorExecution(calculatorName: string, failed: boolean) {
    getMixpanelInstance().track('Execute package calculation', {
      calculator: calculatorName,
      failed,
      organisation: this.getOrganisation(),
      packageVersion: packageVersion(),
      calculatorVersion: packageVersion(),
    });
  }
}

export { CalculationEnvironment, NodeEnvironment };
