import { loadConstants } from '../../constants/constantsLoader';
import { ExecutionContext } from '../../executionContext';

export const V2_0_0 = '2.0.0' as const;

export const testContext = (
  version: '2.0.0',
  calculator: string = 'testcalculator',
): ExecutionContext => {
  const constants = loadConstants();
  return {
    calculator,
    version,
    constants,
    timestamp: '2000-01-01T00:00:00Z',
  };
};
