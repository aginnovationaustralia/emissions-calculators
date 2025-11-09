import { AllConstants } from '@/constants/versionedConstants';
import { AsyncLocalStorage } from 'async_hooks';
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
    return this.storage.getStore()?.organisation;
  }
}

export { CalculationEnvironment };
