import { InputValidationError } from '@/utils/io';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { parseValidationError } from '../../validators/errorConversion';
import { calculateAquaculture } from './Aquaculture/calculator';
import { calculateBeef } from './Beef/calculator';
import { calculateBuffalo } from './Buffalo/calculator';
import {
  loadConstants,
  loadOverrideConstants,
} from './constants/constantsLoader';
import { calculateEntireCotton } from './Cotton/calculator';
import { calculateDairy } from './Dairy/calculator';
import { calculateDeer } from './Deer/calculator';
import { ExecutionContext } from './executionContext';
import { calculateEntireFeedlot } from './Feedlot/calculator';
import { calculateGoat } from './Goat/calculator';
import { calculateEntireGrains } from './Grains/calculator';
import { calculateHorticulture } from './Horticulture/calculator';
import { calculatePork } from './Pork/calculator';
import { calculatePoultry } from './Poultry/calculator';
import { calculateProcessing } from './Processing/calculator';
import { calculateRice } from './Rice/calculator';
import { calculateSheep } from './Sheep/calculator';
import { calculateSheepBeef } from './SheepBeef/calculator';
import { calculateEntireSugar } from './Sugar/calculator';
import { AquacultureInput } from './types/Aquaculture/input';
import { BeefInput } from './types/Beef/input';
import { BuffaloInput } from './types/Buffalo/input';
import { CottonInput } from './types/Cotton/input';
import { DairyInput } from './types/Dairy/input';
import { DeerInput } from './types/Deer/input';
import { FeedlotInput } from './types/Feedlot/input';
import { GoatInput } from './types/Goat/input';
import { GrainsInput } from './types/Grains/input';
import { HorticultureInput } from './types/Horticulture/input';
import { PorkInput } from './types/Pork/input';
import { PoultryInput } from './types/Poultry/input';
import { ProcessingInput } from './types/Processing/input';
import { RiceInput } from './types/Rice/input';
import { SheepInput } from './types/Sheep/input';
import { SheepBeefInput } from './types/SheepBeef/input';
import { SugarInput } from './types/Sugar/input';
import { VineyardInput } from './types/Vineyard/input';
import { WildCatchFisheryInput } from './types/WildCatchFishery/input';
import { WildSeaFisheriesInput } from './types/WildSeaFisheries/input';
import { calculateVineyard } from './Vineyard/calculator';
import { calculateWildCatchFishery } from './WildCatchFishery/calculator';
import { calculateWildSeaFisheries } from './WildSeaFisheries/calculator';

export enum Calculators {
  Beef = 'beef',
  Buffalo = 'buffalo',
  Cotton = 'cotton',
  Dairy = 'dairy',
  Deer = 'deer',
  FeedlotBeef = 'feedlot',
  Goat = 'goat',
  Grains = 'grains',
  Grape = 'grape',
  Horticulture = 'horticulture',
  Pork = 'pork',
  Poultry = 'poultry',
  Rice = 'rice',
  SheepBeef = 'sheepbeef',
  Sugar = 'sugar',
  Sheep = 'sheep',
  WildSeaFisheries = 'wildseafisheries',
  Processing = 'processing',
  Aquaculture = 'aquaculture',
  Vineyard = 'vineyard',
  WildCatchFishery = 'wildcatchfishery',
}

export function validateCalculatorInput<T extends object>(
  cls: ClassConstructor<T>,
  input: unknown,
) {
  const classedInput = plainToClass(cls, input, { exposeDefaultValues: true });
  const errors = validateSync(classedInput);

  if (errors && errors.length > 0) {
    throw new InputValidationError(...parseValidationError(errors));
  }

  return classedInput;
}

/**
 * Validates input and calculates entire sheep and beef emissions.
 * @param input Object
 */
export function calculateSheepBeefEmissions(
  input: unknown,
  context: ExecutionContext,
) {
  const classedInput = validateCalculatorInput(SheepBeefInput, input);

  return calculateSheepBeef(classedInput, context);
}

/**
 * Validates input and calculates entire sheep  emissions.
 * @param input Object
 */
export function calculateSheepEmissions(
  input: unknown,
  context: ExecutionContext,
) {
  const classedInput = validateCalculatorInput(SheepInput, input);

  return calculateSheep(classedInput, context);
}

/**
 * Validates input and calculates entire sheep and beef emissions.
 * @param input Object
 */
export function calculateBeefEmissions(
  input: unknown,
  context: ExecutionContext,
) {
  const classedInput = validateCalculatorInput(BeefInput, input);

  return calculateBeef(classedInput, context);
}

/**
 * Validates input and calculates entire grains emissions.
 * @param input Object
 */
export function calculateGrainsEmissions(
  input: unknown,
  context: ExecutionContext,
) {
  const classedInput = validateCalculatorInput(GrainsInput, input);

  return calculateEntireGrains(
    classedInput.crops,
    classedInput.electricityUse,
    classedInput.electricityRenewable,
    classedInput.state,
    classedInput.vegetation,
    context,
  );
}

/**
 * Validates input and calculates entire feedlot emissions.
 * @param input Object
 */
export function calculateFeedlotEmissions(
  input: unknown,
  context: ExecutionContext,
) {
  const classedInput = validateCalculatorInput(FeedlotInput, input);

  return calculateEntireFeedlot(classedInput, context);
}

/**
 * Validates input and calculates entire goat emissions.
 * @param input Object
 */
export function calculateGoatEmissions(
  input: unknown,
  context: ExecutionContext,
) {
  const classedInput = validateCalculatorInput(GoatInput, input);

  return calculateGoat(classedInput, context);
}

/**
 * Validates input and calculates entire cotton emissions.
 * @param input Object
 */
export function calculateCottonEmissions(
  input: unknown,
  context: ExecutionContext,
) {
  const classedInput = validateCalculatorInput(CottonInput, input);

  return calculateEntireCotton(
    classedInput.crops,
    classedInput.electricityUse,
    classedInput.electricityRenewable,
    classedInput.state,
    classedInput.vegetation,
    context,
  );
}

/**
 * Validates input and calculates entire sugar emissions.
 * @param input Object
 */
export function calculateSugarEmissions(
  input: unknown,
  context: ExecutionContext,
) {
  const classedInput = validateCalculatorInput(SugarInput, input);

  return calculateEntireSugar(
    classedInput.crops,
    classedInput.electricityUse,
    classedInput.electricityRenewable,
    classedInput.state,
    classedInput.vegetation,
    context,
  );
}

/**
 * Validates input and calculates entire pork emissions.
 * @param input Object
 */
export function calculatePorkEmissions(
  input: unknown,
  context: ExecutionContext,
) {
  const classedInput = validateCalculatorInput(PorkInput, input);

  return calculatePork(classedInput, context);
}

/**
 * Validates input and calculates entire poultry emissions.
 * @param input Object
 */
export function calculatePoultryEmissions(
  input: unknown,
  context: ExecutionContext,
) {
  const classedInput = validateCalculatorInput(PoultryInput, input);

  return calculatePoultry(classedInput, context);
}

/**
 * Validates input and calculates entire dairy emissions.
 * @param input Object
 */
export function calculateDairyEmissions(
  input: unknown,
  context: ExecutionContext,
) {
  const classedInput = validateCalculatorInput(DairyInput, input);

  return calculateDairy(classedInput, context);
}

/**
 * Validates input and calculates entire deer emissions.
 * @param input Object
 */
export function calculateDeerEmissions(
  input: unknown,
  context: ExecutionContext,
) {
  const classedInput = validateCalculatorInput(DeerInput, input);

  return calculateDeer(classedInput, context);
}

/**
 * Validates input and calculates entire buffalo emissions.
 * @param input Object
 */
export function calculateBuffaloEmissions(
  input: unknown,
  context: ExecutionContext,
) {
  const classedInput = validateCalculatorInput(BuffaloInput, input);

  return calculateBuffalo(classedInput, context);
}

/**
 * Validates input and calculates entire wild sea fisheries emissions.
 * @param input Object
 */
export function calculateWildSeaFisheriesEmissions(
  input: unknown,
  context: ExecutionContext,
) {
  const classedInput = validateCalculatorInput(WildSeaFisheriesInput, input);

  return calculateWildSeaFisheries(classedInput, context);
}

/**
 * Validates input and calculates entire buffalo emissions.
 * @param input Object
 */
export function calculateHorticultureEmissions(
  input: unknown,
  context: ExecutionContext,
) {
  const classedInput = validateCalculatorInput(HorticultureInput, input);

  return calculateHorticulture(classedInput, context);
}

/**
 * Validates input and calculates entire rice emissions.
 * @param input Object
 */
export function calculateRiceEmissions(
  input: unknown,
  context: ExecutionContext,
) {
  const classedInput = validateCalculatorInput(RiceInput, input);

  return calculateRice(classedInput, context);
}

/**
 * Validates input and calculates entire processing emissions.
 * @param input Object
 */
export function calculateProcessingEmissions(
  input: unknown,
  context: ExecutionContext,
) {
  const classedInput = validateCalculatorInput(ProcessingInput, input);

  return calculateProcessing(classedInput, context);
}

/**
 * Validates input and calculates entire aquaculture emissions.
 * @param input Object
 */
export function calculateAquacultureEmissions(
  input: unknown,
  context: ExecutionContext,
) {
  const classedInput = validateCalculatorInput(AquacultureInput, input);

  return calculateAquaculture(classedInput, context);
}

/**
 * Validates input and calculates entire vineyard emissions.
 * @param input Object
 */
export function calculateVineyardEmissions(
  input: unknown,
  context: ExecutionContext,
) {
  const classedInput = validateCalculatorInput(VineyardInput, input);

  return calculateVineyard(classedInput, context);
}

/**
 * Validates input and calculates entire wild catch fishery emissions.
 * @param input Object
 */
export function calculateWildCatchFisheryEmissions(
  input: unknown,
  context: ExecutionContext,
) {
  const classedInput = validateCalculatorInput(WildCatchFisheryInput, input);

  return calculateWildCatchFishery(classedInput, context);
}

function executeCalculation(
  calculator: string,
  input: unknown,
  context: ExecutionContext,
) {
  switch (calculator.toLowerCase()) {
    case Calculators.Dairy:
      return calculateDairyEmissions(input, context);
    case Calculators.SheepBeef:
      return calculateSheepBeefEmissions(input, context);
    case Calculators.Grains:
      return calculateGrainsEmissions(input, context);
    case 'feedlotbeef':
      return calculateFeedlotEmissions(input, context);
    case Calculators.FeedlotBeef:
      return calculateFeedlotEmissions(input, context);
    case Calculators.Goat:
      return calculateGoatEmissions(input, context);
    case Calculators.Cotton:
      return calculateCottonEmissions(input, context);
    case Calculators.Sugar:
      return calculateSugarEmissions(input, context);
    case Calculators.Pork:
      return calculatePorkEmissions(input, context);
    case Calculators.Poultry:
      return calculatePoultryEmissions(input, context);
    case Calculators.Beef:
      return calculateBeefEmissions(input, context);
    case Calculators.Sheep:
      return calculateSheepEmissions(input, context);
    case Calculators.Deer:
      return calculateDeerEmissions(input, context);
    case Calculators.Buffalo:
      return calculateBuffaloEmissions(input, context);
    case Calculators.WildSeaFisheries:
      return calculateWildSeaFisheriesEmissions(input, context);
    case Calculators.Horticulture:
      return calculateHorticultureEmissions(input, context);
    case Calculators.Rice:
      return calculateRiceEmissions(input, context);
    case Calculators.Processing:
      return calculateProcessingEmissions(input, context);
    case Calculators.Aquaculture:
      return calculateAquacultureEmissions(input, context);
    case Calculators.Vineyard:
      return calculateVineyardEmissions(input, context);
    case Calculators.WildCatchFishery:
      return calculateWildCatchFisheryEmissions(input, context);
    default:
      throw new Error(`Calculator ${calculator} not found`);
  }
}

/**
 * Primary entry point for performing emissions calculations. Takes a calculator
 * name and input object, performs validation specific for that calculator and
 * returns emissions. The latest version of the calculator is used by default.
 * @param calculator
 * @param input
 * @param version
 * @returns
 */
export function calculateEmissions(
  calculator: string,
  version: string,
  input: unknown,
  allowOverrides = false,
) {
  const overrides = allowOverrides
    ? (input as { overrides: object }).overrides
    : undefined;
  const constants = allowOverrides
    ? loadOverrideConstants(overrides)
    : loadConstants();

  const executionContext = {
    calculator,
    version,
    constants,
    timestamp: new Date().toISOString(),
    overrides,
  };

  const result = executeCalculation(calculator, input, executionContext);

  return {
    ...result,
    metaData: {
      calculator,
      version,
      timestamp: new Date().toISOString(),
      overrides,
    },
  };
}
