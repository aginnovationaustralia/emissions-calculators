import { AsyncLocalStorage } from 'async_hooks';
import { PartialDeep } from 'type-fest';
import { AllConstants } from './versionedConstants';

type ConstantOverrides = PartialDeep<AllConstants>;

class ConstantsContext {
  private static storage = new AsyncLocalStorage<ConstantOverrides>();

  static run<T>(overrides: ConstantOverrides, callback: () => T): T {
    return this.storage.run(overrides, callback);
  }

  static getOverrides(): ConstantOverrides | undefined {
    return this.storage.getStore();
  }
}

export { ConstantsContext };
