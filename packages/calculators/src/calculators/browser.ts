import { CalculatorOptions } from '@/browser';
import { CalculateEmissionsResult, tryCalculate } from '@/calculate';
import {
  AquacultureInputSchema,
  AquacultureOutput,
  BeefInputSchema,
  BeefOutput,
  BuffaloInputSchema,
  BuffaloOutput,
  CottonInputSchema,
  CottonOutput,
  DairyInputSchema,
  DairyOutput,
  DeerInputSchema,
  DeerOutput,
  FeedlotInputSchema,
  FeedlotOutput,
  GoatInputSchema,
  GoatOutput,
  GrainsInputSchema,
  GrainsOutput,
  HorticultureInputSchema,
  HorticultureOutput,
  PorkInputSchema,
  PorkOutput,
  PoultryInputSchema,
  PoultryOutput,
  ProcessingInputSchema,
  ProcessingOutput,
  RiceInputSchema,
  RiceOutput,
  SheepBeefInputSchema,
  SheepBeefOutput,
  SheepInputSchema,
  SheepOutput,
  SugarInputSchema,
  SugarOutput,
  VineyardInputSchema,
  VineyardOutput,
  WildCatchFisheryInputSchema,
  WildCatchFisheryOutput,
  WildSeaFisheriesInputSchema,
  WildSeaFisheriesOutput,
} from '@/types';
import {
  calculateAquaculture,
  calculateBeef,
  calculateBuffalo,
  calculateCotton,
  calculateDairy,
  calculateDeer,
  calculateFeedlot,
  calculateGoat,
  calculateGrains,
  calculateHorticulture,
  calculatePork,
  calculatePoultry,
  calculateProcessing,
  calculateRice,
  calculateSheep,
  calculateSheepBeef,
  calculateSugar,
  calculateVineyard,
  calculateWildCatchFishery,
  calculateWildSeaFisheries,
} from './browser-calculators';
import { CalculatorNames } from './strings';

export * from './browser-calculators';
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
  O extends N extends 'beef'
    ? BeefOutput
    : N extends 'aquaculture'
    ? AquacultureOutput
    : N extends 'buffalo'
    ? BuffaloOutput
    : N extends 'cotton'
    ? CottonOutput
    : N extends 'dairy'
    ? DairyOutput
    : N extends 'deer'
    ? DeerOutput
    : N extends 'feedlot'
    ? FeedlotOutput
    : N extends 'feedlotbeef'
    ? FeedlotOutput
    : N extends 'goat'
    ? GoatOutput
    : N extends 'grains'
    ? GrainsOutput
    : N extends 'horticulture'
    ? HorticultureOutput
    : N extends 'pork'
    ? PorkOutput
    : N extends 'poultry'
    ? PoultryOutput
    : N extends 'processing'
    ? ProcessingOutput
    : N extends 'rice'
    ? RiceOutput
    : N extends 'sheep'
    ? SheepOutput
    : N extends 'sheepbeef'
    ? SheepBeefOutput
    : N extends 'sugar'
    ? SugarOutput
    : N extends 'vineyard'
    ? VineyardOutput
    : N extends 'wildcatchfishery'
    ? WildCatchFisheryOutput
    : N extends 'wildseafisheries'
    ? WildSeaFisheriesOutput
    : never,
>(
  calculatorName: N,
  input: unknown,
  options?: CalculatorOptions,
): CalculateEmissionsResult<O> => {
  switch (calculatorName) {
    case 'beef':
      return tryCalculate(
        BeefInputSchema,
        input,
        calculateBeef,
        options,
      ) as CalculateEmissionsResult<O>;
    case 'aquaculture':
      return tryCalculate(
        AquacultureInputSchema,
        input,
        calculateAquaculture,
        options,
      ) as CalculateEmissionsResult<O>;
    case 'buffalo':
      return tryCalculate(
        BuffaloInputSchema,
        input,
        calculateBuffalo,
        options,
      ) as CalculateEmissionsResult<O>;
    case 'cotton':
      return tryCalculate(
        CottonInputSchema,
        input,
        calculateCotton,
        options,
      ) as CalculateEmissionsResult<O>;
    case 'dairy':
      return tryCalculate(
        DairyInputSchema,
        input,
        calculateDairy,
        options,
      ) as CalculateEmissionsResult<O>;
    case 'deer':
      return tryCalculate(
        DeerInputSchema,
        input,
        calculateDeer,
        options,
      ) as CalculateEmissionsResult<O>;
    case 'feedlot':
      return tryCalculate(
        FeedlotInputSchema,
        input,
        calculateFeedlot,
        options,
      ) as CalculateEmissionsResult<O>;
    case 'feedlotbeef':
      return tryCalculate(
        FeedlotInputSchema,
        input,
        calculateFeedlot,
        options,
      ) as CalculateEmissionsResult<O>;
    case 'goat':
      return tryCalculate(
        GoatInputSchema,
        input,
        calculateGoat,
        options,
      ) as CalculateEmissionsResult<O>;
    case 'grains':
      return tryCalculate(
        GrainsInputSchema,
        input,
        calculateGrains,
        options,
      ) as CalculateEmissionsResult<O>;
    case 'horticulture':
      return tryCalculate(
        HorticultureInputSchema,
        input,
        calculateHorticulture,
        options,
      ) as CalculateEmissionsResult<O>;
    case 'pork':
      return tryCalculate(
        PorkInputSchema,
        input,
        calculatePork,
        options,
      ) as CalculateEmissionsResult<O>;
    case 'poultry':
      return tryCalculate(
        PoultryInputSchema,
        input,
        calculatePoultry,
        options,
      ) as CalculateEmissionsResult<O>;
    case 'processing':
      return tryCalculate(
        ProcessingInputSchema,
        input,
        calculateProcessing,
        options,
      ) as CalculateEmissionsResult<O>;
    case 'rice':
      return tryCalculate(
        RiceInputSchema,
        input,
        calculateRice,
        options,
      ) as CalculateEmissionsResult<O>;
    case 'sheep':
      return tryCalculate(
        SheepInputSchema,
        input,
        calculateSheep,
        options,
      ) as CalculateEmissionsResult<O>;
    case 'sheepbeef':
      return tryCalculate(
        SheepBeefInputSchema,
        input,
        calculateSheepBeef,
        options,
      ) as CalculateEmissionsResult<O>;
    case 'sugar':
      return tryCalculate(
        SugarInputSchema,
        input,
        calculateSugar,
        options,
      ) as CalculateEmissionsResult<O>;
    case 'vineyard':
      return tryCalculate(
        VineyardInputSchema,
        input,
        calculateVineyard,
        options,
      ) as CalculateEmissionsResult<O>;
    case 'wildcatchfishery':
      return tryCalculate(
        WildCatchFisheryInputSchema,
        input,
        calculateWildCatchFishery,
        options,
      ) as CalculateEmissionsResult<O>;
    case 'wildseafisheries':
      return tryCalculate(
        WildSeaFisheriesInputSchema,
        input,
        calculateWildSeaFisheries,
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
