import { loadConstants } from '@/constants/loader';
import { AllConstants } from '@/constants/types';
import { merge } from 'ts-deepmerge';
import { packageVersion } from '../execution/version';
import { ExecutionContext } from '../executionContext';
import { CalculatorNames } from '../strings';
import { CalculationEnvironment } from './environment';
import { trackCalculatorExecution } from './metrics';

function contextFor(calculator: string, version: string) {
  return {
    calculator,
    version,
    constants: loadOverrideConstants(),
    timestamp: new Date().toISOString(),
  };
}

function isMetricsEnabled(): boolean {
  return process.env.DISABLE_CALCULATOR_METRICS !== 'true';
}

function organisation(): string | undefined {
  return (
    CalculationEnvironment.getOrganisation() ??
    process.env.CALCULATOR_METRICS_ORGANISATION
  );
}

function loadOverrideConstants(): AllConstants {
  const overrides = CalculationEnvironment.getOverrides();
  return merge<AllConstants[]>(loadConstants(), overrides as AllConstants);
}

export function executeCalculator<Input extends object, Output extends object>(
  calculator: (input: Input, context: ExecutionContext<AllConstants>) => Output,
  input: Input,
  calculatorName: CalculatorNames,
): Output {
  const calculatorVersion = '3.0.0';
  const context = contextFor(calculatorName, calculatorVersion);
  let result: Output;
  let failed = false;

  try {
    result = calculator(input, context);
  } catch (error) {
    failed = true;
    throw error;
  } finally {
    if (isMetricsEnabled()) {
      trackCalculatorExecution({
        calculator: calculatorName,
        calculatorVersion,
        failed,
        packageVersion: packageVersion(),
        organisation: organisation(),
      });
    }
  }

  return result;
}
