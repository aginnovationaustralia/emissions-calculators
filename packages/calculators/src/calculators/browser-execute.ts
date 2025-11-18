import { loadConstants } from '@/constants/loader';
import { AllConstants } from '@/constants/types';
import mixpanel from 'mixpanel-browser';
import { packageVersion } from './execution/version';
import { ExecutionContext } from './executionContext';
import { CalculatorNames } from './strings';

function contextFor(calculator: string, version: string) {
  return {
    calculator,
    version,
    constants: loadConstants(),
    timestamp: new Date().toISOString(),
  };
}

export type CalculatorOptions = {
  disableMetrics?: boolean;
  organisation?: string;
};

type CalculatorProperties = {
  calculator: string;
  calculatorVersion: string;
  failed: boolean;
  packageVersion: string;
  organisation: string | undefined;
};

const mixpanelKey = 'ed361d81702b467cfa90128d3969bb06';

export function trackCalculatorExecution(properties: CalculatorProperties) {
  mixpanel.init(mixpanelKey);
  mixpanel.track('Execute package calculation', properties);
}

export function executeCalculator<Input extends object, Output extends object>(
  calculator: (input: Input, context: ExecutionContext<AllConstants>) => Output,
  input: Input,
  calculatorName: CalculatorNames,
  options?: CalculatorOptions,
): Output {
  const calculatorVersion = '3.0.0';
  const context = contextFor(calculatorName, calculatorVersion);
  let result: Output;
  let failed = false;

  const trackingDisabled = Boolean(options && options.disableMetrics === false);

  try {
    result = calculator(input, context);
  } catch (error) {
    failed = true;
    throw error;
  } finally {
    if (!trackingDisabled) {
      trackCalculatorExecution({
        calculator: calculatorName,
        calculatorVersion,
        failed,
        packageVersion: packageVersion(),
        organisation: options?.organisation,
      });
    }
  }

  return result;
}
