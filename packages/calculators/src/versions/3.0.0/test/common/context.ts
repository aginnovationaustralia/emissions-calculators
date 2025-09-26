import { loadAllConstants } from '../../constants/constantsLoader';
import { AllConstants } from '../../constants/versionedConstants';
import { ExecutionContext } from '../../executionContext';

export const V3_0_0 = '3.0.0' as const;

export const testContext = (
  version: '3.0.0',
  calculator: string = 'testcalculator',
): ExecutionContext<AllConstants> => {
  const constants = loadAllConstants();
  return {
    calculator,
    version,
    constants,
    timestamp: '2000-01-01T00:00:00Z',
  };
};
