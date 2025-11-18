import { loadConstants } from '@/constants';
import { AllConstants } from '@/constants/types';
import { AsyncLocalStorage } from 'async_hooks';
import { merge } from 'ts-deepmerge';
import { PartialDeep } from 'type-fest';

export type ConstantOverrides = PartialDeep<AllConstants>;
type CalculationEnvironmentParameters = {
  overrides?: ConstantOverrides;
  organisation?: string;
};

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

export { CalculationEnvironment };
