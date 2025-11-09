import { loadConstants } from '@/constants/constantsLoader';
import { AllConstants } from '@/constants/versionedConstants';
import { ExecutionContext } from '../../calculators/executionContext';

export const testContext = (
  calculator: string = 'testcalculator',
): ExecutionContext<AllConstants> => {
  const constants = loadConstants();
  return {
    calculator,
    version: global.CURRENT_VERSION,
    constants,
    timestamp: '2000-01-01T00:00:00Z',
  };
};
