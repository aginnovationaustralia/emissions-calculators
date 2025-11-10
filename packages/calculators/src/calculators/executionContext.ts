import { HasCommonConstants } from './common/constants';

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
