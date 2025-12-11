import { ZodType } from 'zod';
import { CalculatorOptions } from './calculators/execution/types';
import { CalculatorNames } from './calculators/strings';
import {
  validateCalculatorInput,
  ValidationErrorResult,
} from './calculators/validate';
import {
  AquacultureInput,
  AquacultureInputSchema,
  AquacultureOutput,
  BeefInput,
  BeefInputSchema,
  BeefOutput,
  BuffaloInput,
  BuffaloInputSchema,
  BuffaloOutput,
  CottonInput,
  CottonInputSchema,
  CottonOutput,
  DairyInput,
  DairyInputSchema,
  DairyOutput,
  DeerInput,
  DeerInputSchema,
  DeerOutput,
  FeedlotInput,
  FeedlotInputSchema,
  FeedlotOutput,
  GoatInput,
  GoatInputSchema,
  GoatOutput,
  GrainsInput,
  GrainsInputSchema,
  GrainsOutput,
  HorticultureInput,
  HorticultureInputSchema,
  HorticultureOutput,
  PorkInput,
  PorkInputSchema,
  PorkOutput,
  PoultryInput,
  PoultryInputSchema,
  PoultryOutput,
  ProcessingInput,
  ProcessingInputSchema,
  ProcessingOutput,
  RiceInput,
  RiceInputSchema,
  RiceOutput,
  SheepBeefInput,
  SheepBeefInputSchema,
  SheepBeefOutput,
  SheepInput,
  SheepInputSchema,
  SheepOutput,
  SugarInput,
  SugarInputSchema,
  SugarOutput,
  VineyardInput,
  VineyardInputSchema,
  VineyardOutput,
  WildCatchFisheryInput,
  WildCatchFisheryInputSchema,
  WildCatchFisheryOutput,
  WildSeaFisheriesInput,
  WildSeaFisheriesInputSchema,
  WildSeaFisheriesOutput,
} from './types';

export enum CalculateEmissionsStatus {
  OK,
  INVALID_INPUT,
  ERROR,
}
export type CalculateEmissionsResult<O extends object> =
  | {
      status: CalculateEmissionsStatus.OK;
      emissions: O;
    }
  | {
      status: CalculateEmissionsStatus.INVALID_INPUT;
      issues: ValidationErrorResult[];
    }
  | {
      status: CalculateEmissionsStatus.ERROR;
      error: Error;
    };

const tryCalculate = <S extends object, Z extends ZodType<S>, O extends object>(
  schema: Z,
  input: unknown,
  calculator: (input: S, options?: CalculatorOptions) => O,
  options?: CalculatorOptions,
): CalculateEmissionsResult<O> => {
  try {
    const validatedInput = validateCalculatorInput(schema, input);
    if (!validatedInput.valid) {
      return {
        status: CalculateEmissionsStatus.INVALID_INPUT,
        issues: validatedInput.issues,
      };
    }
    const emissions = calculator(validatedInput.result, options);
    return {
      status: CalculateEmissionsStatus.OK,
      emissions,
    };
  } catch (error) {
    return {
      status: CalculateEmissionsStatus.ERROR,
      error: error as Error,
    };
  }
};

type Calculators = {
  calculateBeef: (input: BeefInput, options?: CalculatorOptions) => BeefOutput;
  calculateAquaculture: (
    input: AquacultureInput,
    options?: CalculatorOptions,
  ) => AquacultureOutput;
  calculateBuffalo: (
    input: BuffaloInput,
    options?: CalculatorOptions,
  ) => BuffaloOutput;
  calculateCotton: (
    input: CottonInput,
    options?: CalculatorOptions,
  ) => CottonOutput;
  calculateDairy: (
    input: DairyInput,
    options?: CalculatorOptions,
  ) => DairyOutput;
  calculateDeer: (input: DeerInput, options?: CalculatorOptions) => DeerOutput;
  calculateFeedlot: (
    input: FeedlotInput,
    options?: CalculatorOptions,
  ) => FeedlotOutput;
  calculateGoat: (input: GoatInput, options?: CalculatorOptions) => GoatOutput;
  calculateGrains: (
    input: GrainsInput,
    options?: CalculatorOptions,
  ) => GrainsOutput;
  calculateHorticulture: (
    input: HorticultureInput,
    options?: CalculatorOptions,
  ) => HorticultureOutput;
  calculatePork: (input: PorkInput, options?: CalculatorOptions) => PorkOutput;
  calculatePoultry: (
    input: PoultryInput,
    options?: CalculatorOptions,
  ) => PoultryOutput;
  calculateProcessing: (
    input: ProcessingInput,
    options?: CalculatorOptions,
  ) => ProcessingOutput;
  calculateRice: (input: RiceInput, options?: CalculatorOptions) => RiceOutput;
  calculateSheep: (
    input: SheepInput,
    options?: CalculatorOptions,
  ) => SheepOutput;
  calculateSheepBeef: (
    input: SheepBeefInput,
    options?: CalculatorOptions,
  ) => SheepBeefOutput;
  calculateSugar: (
    input: SugarInput,
    options?: CalculatorOptions,
  ) => SugarOutput;
  calculateVineyard: (
    input: VineyardInput,
    options?: CalculatorOptions,
  ) => VineyardOutput;
  calculateWildCatchFishery: (
    input: WildCatchFisheryInput,
    options?: CalculatorOptions,
  ) => WildCatchFisheryOutput;
  calculateWildSeaFisheries: (
    input: WildSeaFisheriesInput,
    options?: CalculatorOptions,
  ) => WildSeaFisheriesOutput;
};

export const generateCalculateEmissions =
  <
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
  >({
    calculateBeef,
    calculateAquaculture,
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
  }: Calculators) =>
  (
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
