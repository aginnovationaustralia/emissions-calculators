import { Constants } from './constants/versionedConstants';

type ExecutionMetadata = {
  calculator: string;
  version: string;
  timestamp: string;
  overrides?: object | undefined;
};
export interface ExecutionContext<T = Constants> extends ExecutionMetadata {
  constants: T;
}

export type WithExecutionMetadata<T> = T & { metaData: ExecutionMetadata };
