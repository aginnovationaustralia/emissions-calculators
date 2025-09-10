import { Constants } from './constants/versionedConstants';

type ExecutionMetadata = {
  calculator: string;
  version: string;
  timestamp: string;
  overrides?: object | undefined;
};
export interface ExecutionContext extends ExecutionMetadata {
  constants: Constants;
}

export type WithExecutionMetadata<T> = T & { metaData: ExecutionMetadata };
