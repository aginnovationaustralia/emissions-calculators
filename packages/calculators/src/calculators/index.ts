import { CalculateEmissionsResult, tryCalculate } from '../calculate';
import {
  AllModulesInputSchema,
  AllModulesOutput,
  AquacultureInputSchema,
  AquacultureOutput,
  BeefInputSchema,
  BeefOutput,
  calculateAllModulesParsed,
  calculateAquacultureParsed,
  calculateBeefParsed,
  calculateCottonParsed,
  calculateCroppingParsed,
  calculateDairyParsed,
  calculateFeedlotParsed,
  calculateForestryParsed,
  calculateGrainsParsed,
  calculateHorticultureParsed,
  calculateOtherLivestockParsed,
  calculatePigsParsed,
  calculatePostProductionParsed,
  calculatePoultryParsed,
  calculateRiceParsed,
  calculateSheepParsed,
  calculateSugarParsed,
  calculateViticultureParsed,
  calculateWildCatchFisheriesParsed,
  CottonInputSchema,
  CottonOutput,
  CroppingInputSchema,
  CroppingOutput,
  DairyInputSchema,
  DairyOutput,
  FeedlotInputSchema,
  FeedlotOutput,
  ForestryInputSchema,
  ForestryOutput,
  GrainsInputSchema,
  GrainsOutput,
  HorticultureInputSchema,
  HorticultureOutput,
  OtherLivestockInputSchema,
  OtherLivestockOutput,
  PigsInputSchema,
  PigsOutput,
  PostProductionInputSchema,
  PostProductionOutput,
  PoultryInputSchema,
  PoultryOutput,
  RiceInputSchema,
  RiceOutput,
  SheepInputSchema,
  SheepOutput,
  SugarInputSchema,
  SugarOutput,
  ViticultureInputSchema,
  ViticultureOutput,
  WildCatchFisheriesInputSchema,
  WildCatchFisheriesOutput,
} from './calculators';
import { CalculatorOptions } from './execution/types';
import { CalculatorNames } from './strings';

export * from './calculators';
export { CalculatorOptions } from './execution/types';
export { loadConstants } from './executionContext';
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
  O extends (N extends 'beef'
    ? BeefOutput
    : N extends 'cropping'
      ? CroppingOutput
      : N extends 'dairy'
        ? DairyOutput
        : N extends 'forestry'
          ? ForestryOutput
          : N extends 'grains'
            ? GrainsOutput
            : N extends 'rice'
              ? RiceOutput
              : N extends 'sugar'
                ? SugarOutput
                : N extends 'cotton'
                  ? CottonOutput
                  : N extends 'viticulture'
                    ? ViticultureOutput
                    : N extends 'sheep'
                      ? SheepOutput
                      : N extends 'post-production'
                        ? PostProductionOutput
                        : N extends 'pigs'
                          ? PigsOutput
                          : N extends 'poultry'
                            ? PoultryOutput
                            : N extends 'feedlot'
                              ? FeedlotOutput
                              : N extends 'other-livestock'
                                ? OtherLivestockOutput
                                : N extends 'aquaculture'
                                  ? AquacultureOutput
                                  : N extends 'wild-catch-fisheries'
                                    ? WildCatchFisheriesOutput
                                    : N extends 'all-modules'
                                      ? AllModulesOutput
                                      : N extends 'horticulture'
                                        ? HorticultureOutput
                                        : never),
>(
  calculatorName: N,
  input: unknown,
  options?: CalculatorOptions,
): CalculateEmissionsResult<O> => {
  switch (calculatorName) {
    case 'all-modules':
      return tryCalculate(
        AllModulesInputSchema,
        input,
        calculateAllModulesParsed,
        options,
      ) as CalculateEmissionsResult<O>;

    case 'aquaculture':
      return tryCalculate(
        AquacultureInputSchema,
        input,
        calculateAquacultureParsed,
        options,
      ) as CalculateEmissionsResult<O>;

    case 'beef':
      return tryCalculate(
        BeefInputSchema,
        input,
        calculateBeefParsed,
        options,
      ) as CalculateEmissionsResult<O>;

    case 'cotton':
      return tryCalculate(
        CottonInputSchema,
        input,
        calculateCottonParsed,
        options,
      ) as CalculateEmissionsResult<O>;

    case 'cropping':
      return tryCalculate(
        CroppingInputSchema,
        input,
        calculateCroppingParsed,
        options,
      ) as CalculateEmissionsResult<O>;

    case 'dairy':
      return tryCalculate(
        DairyInputSchema,
        input,
        calculateDairyParsed,
        options,
      ) as CalculateEmissionsResult<O>;

    case 'feedlot':
      return tryCalculate(
        FeedlotInputSchema,
        input,
        calculateFeedlotParsed,
        options,
      ) as CalculateEmissionsResult<O>;

    case 'forestry':
      return tryCalculate(
        ForestryInputSchema,
        input,
        calculateForestryParsed,
        options,
      ) as CalculateEmissionsResult<O>;

    case 'grains':
      return tryCalculate(
        GrainsInputSchema,
        input,
        calculateGrainsParsed,
        options,
      ) as CalculateEmissionsResult<O>;

    case 'other-livestock':
      return tryCalculate(
        OtherLivestockInputSchema,
        input,
        calculateOtherLivestockParsed,
        options,
      ) as CalculateEmissionsResult<O>;

    case 'post-production':
      return tryCalculate(
        PostProductionInputSchema,
        input,
        calculatePostProductionParsed,
        options,
      ) as CalculateEmissionsResult<O>;

    case 'poultry':
      return tryCalculate(
        PoultryInputSchema,
        input,
        calculatePoultryParsed,
        options,
      ) as CalculateEmissionsResult<O>;

    case 'horticulture':
      return tryCalculate(
        HorticultureInputSchema,
        input,
        calculateHorticultureParsed,
        options,
      ) as CalculateEmissionsResult<O>;

    case 'rice':
      return tryCalculate(
        RiceInputSchema,
        input,
        calculateRiceParsed,
        options,
      ) as CalculateEmissionsResult<O>;

    case 'sheep':
      return tryCalculate(
        SheepInputSchema,
        input,
        calculateSheepParsed,
        options,
      ) as CalculateEmissionsResult<O>;

    case 'sugar':
      return tryCalculate(
        SugarInputSchema,
        input,
        calculateSugarParsed,
        options,
      ) as CalculateEmissionsResult<O>;

    case 'pigs':
      return tryCalculate(
        PigsInputSchema,
        input,
        calculatePigsParsed,
        options,
      ) as CalculateEmissionsResult<O>;

    case 'viticulture':
      return tryCalculate(
        ViticultureInputSchema,
        input,
        calculateViticultureParsed,
        options,
      ) as CalculateEmissionsResult<O>;

    case 'wild-catch-fisheries':
      return tryCalculate(
        WildCatchFisheriesInputSchema,
        input,
        calculateWildCatchFisheriesParsed,
        options,
      ) as CalculateEmissionsResult<O>;
  }
};

export type { CalculateEmissionsResult } from '../calculate';
