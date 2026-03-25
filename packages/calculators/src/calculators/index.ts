import { CalculateEmissionsResult, tryCalculate } from '../calculate';
import { calculateGrains } from './calculators';
import { CalculatorOptions } from './execution/types';
import { GrainsInputSchema, GrainsOutput } from './Grains/types';
import { CalculatorNames } from './strings';

export * from './calculators';
export { CalculatorOptions } from './execution/types';
export { CalculatorNames, isValidCalculatorName } from './strings';
export { validateCalculatorInput } from './validate';

/**
 * Calculates the emissions for a given calculator name and input. It will perform validation of the input
 * before passing it to the calculator function, based on the calculator name you provide.
 * The type of the output is determined by the calculator name you provide.
 *
 * @example
 * ```typescript
 * const result = calculateEmissions('beef', userInputData, { disableMetrics: true });
 * if (result.status === CalculateEmissionsStatus.OK) {
 *   const emissions: BeefInput = result.emissions;
 *   console.log('Emissions calculated correctly', emissions);
 * } else if (result.status === CalculateEmissionsStatus.INVALID_INPUT) {
 *   const formattedString = validatedInput.issues
 *    .map((issue) => `${issue.path}: ${issue.message}`)
 *    .join(', ');
 *   console.error('Input was not valid', formattedString);
 * } else {
 *   console.error('Error calculating emissions', result.error);
 * }
 * ```
 *
 * @param calculatorName - The name of the calculator to use
 * @param input - The input to the calculator
 * @param options - The options to the calculator
 * @returns CalculateEmissionsResult<O>
 * @function calculateEmissions
 */
export const calculateEmissions = <
  N extends CalculatorNames,
  // I extends N extends 'grains' ? GrainsInput : never,
  O extends N extends 'grains' ? GrainsOutput : never,
>(
  calculatorName: N,
  input: unknown,
  options?: CalculatorOptions,
): CalculateEmissionsResult<O> => {
  switch (calculatorName) {
    case 'grains':
      return tryCalculate(
        GrainsInputSchema,
        input,
        calculateGrains,
        options,
      ) as CalculateEmissionsResult<O>;

    default: {
      // This ensures compile-time exhaustiveness checking
      // If a case is missed, TypeScript will error here
      const _exhaustive: never = calculatorName as never;
      return _exhaustive as CalculateEmissionsResult<O>;
    }
  }
};

export type { CalculateEmissionsResult } from '../calculate';

// Node only exports
export { CalculationEnvironment } from './execution/node/environment';
