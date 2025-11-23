import { AllConstants } from '@/constants';
import { HasCommonConstants } from './common/constants';
import { CALCULATOR_VERSION } from './execution/constants';

type ExecutionMetadata = {
  calculator: string;
  version: string;
  timestamp: string;
  overrides?: object | undefined;
};
export interface ExecutionContext<
  T extends HasCommonConstants = HasCommonConstants,
> extends ExecutionMetadata {
  constants: T;
}

export type WithExecutionMetadata<T> = T & { metaData: ExecutionMetadata };

export function contextFor(calculator: string, constants: AllConstants) {
  return {
    calculator,
    version: CALCULATOR_VERSION,
    constants,
    timestamp: new Date().toISOString(),
  };
}
