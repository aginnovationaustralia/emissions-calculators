import { loadConstants } from '@/constants';
import { AllConstants } from '@/constants/types';
import { AsyncLocalStorage } from 'async_hooks';
import { merge } from 'ts-deepmerge';
import { PartialDeep } from 'type-fest';
import { CALCULATOR_VERSION } from '../constants';
import { Environment } from '../types';
import { packageVersion } from '../version';
import { getMixpanelInstance } from './mixpanel';

export type ConstantOverrides = PartialDeep<AllConstants>;
type CalculationEnvironmentParameters = {
  overrides?: ConstantOverrides;
  organisation?: string;
};

/**
 * The CalculationEnvironment is a wrapper around the AsyncLocalStorage API that allows for the
 * overriding of constants and organisation for a calculator execution. It is designed to wrap a calculator
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

  static getOverrides(): ConstantOverrides | undefined {
    return this.storage.getStore()?.overrides;
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
    return merge<AllConstants[]>(
      loadConstants(),
      this.getOverrides() as AllConstants,
    );
  }
}

/**
 * Create an instance of an Environment that can be used to execute a calculator in a Node.js context.
 */
class NodeEnvironment implements Environment {
  loadConstants(): AllConstants {
    return merge<AllConstants[]>(
      loadConstants(),
      CalculationEnvironment.getOverrides() as AllConstants,
    );
  }

  isMetricsEnabled(): boolean {
    return process.env.DISABLE_CALCULATOR_METRICS !== 'true';
  }

  getOrganisation(): string | undefined {
    return CalculationEnvironment.getOrganisation();
  }

  trackCalculatorExecution(calculatorName: string, failed: boolean) {
    getMixpanelInstance().track('Execute package calculation', {
      calculator: calculatorName,
      failed,
      organisation: this.getOrganisation(),
      packageVersion: packageVersion(),
      calculatorVersion: CALCULATOR_VERSION,
    });
  }
}

export { CalculationEnvironment, NodeEnvironment };
