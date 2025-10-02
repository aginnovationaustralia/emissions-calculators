import { InputValidationError } from '@/utils/io';
import { parseValidationError } from '@/validators/errorConversion';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { calculateAquaculture as calculateAquacultureInternal } from './Aquaculture/calculator';
import { calculateBeef as calculateBeefInternal } from './Beef/calculator';
import { calculateBuffalo as calculateBuffaloInternal } from './Buffalo/calculator';
import { calculateCotton as calculateCottonInternal } from './Cotton/calculator';
import { calculateDairy as calculateDairyInternal } from './Dairy/calculator';
import { calculateDeer as calculateDeerInternal } from './Deer/calculator';
import { calculateEntireFeedlot as calculateFeedlotInternal } from './Feedlot/calculator';
import { calculateGoat as calculateGoatInternal } from './Goat/calculator';
import { calculateGrains as calculateGrainsInternal } from './Grains/calculator';
import { calculateHorticulture as calculateHorticultureInternal } from './Horticulture/calculator';
import { calculatePork as calculatePorkInternal } from './Pork/calculator';
import { calculatePoultry as calculatePoultryInternal } from './Poultry/calculator';
import { calculateProcessing as calculateProcessingInternal } from './Processing/calculator';
import { calculateRice as calculateRiceInternal } from './Rice/calculator';
import { calculateSheep as calculateSheepInternal } from './Sheep/calculator';
import { calculateSheepBeef as calculateSheepBeefInternal } from './SheepBeef/calculator';
import { calculateSugar as calculateSugarInternal } from './Sugar/calculator';
import { calculateVineyard as calculateVineyardInternal } from './Vineyard/calculator';
import { calculateWildCatchFishery as calculateWildCatchFisheryInternal } from './WildCatchFishery/calculator';
import { calculateWildSeaFisheries as calculateWildSeaFisheriesInternal } from './WildSeaFisheries/calculator';
import { executeCalculator } from './execute';
import { CalculatorNames } from './strings';
import { AquacultureInput } from './types/Aquaculture/input';
import { AquacultureOutput } from './types/Aquaculture/output';
import { BeefInput } from './types/Beef/input';
import { BeefOutput } from './types/Beef/output';
import { BuffaloInput } from './types/Buffalo/input';
import { BuffaloOutput } from './types/Buffalo/output';
import { CottonInput } from './types/Cotton/input';
import { CottonOutput } from './types/Cotton/output';
import { DairyInput } from './types/Dairy/input';
import { DairyOutput } from './types/Dairy/output';
import { DeerInput } from './types/Deer/input';
import { DeerOutput } from './types/Deer/output';
import { FeedlotInput } from './types/Feedlot/input';
import { FeedlotOutput } from './types/Feedlot/output';
import { GoatInput } from './types/Goat/input';
import { GoatOutput } from './types/Goat/output';
import { GrainsInput } from './types/Grains/input';
import { GrainsOutput } from './types/Grains/output';
import { HorticultureInput } from './types/Horticulture/input';
import { HorticultureOutput } from './types/Horticulture/output';
import { PorkInput } from './types/Pork/input';
import { PorkOutput } from './types/Pork/output';
import { PoultryInput } from './types/Poultry/input';
import { PoultryOutput } from './types/Poultry/output';
import { ProcessingInput } from './types/Processing/input';
import { ProcessingOutput } from './types/Processing/output';
import { RiceInput } from './types/Rice/input';
import { RiceOutput } from './types/Rice/output';
import { SheepInput } from './types/Sheep/input';
import { SheepOutput } from './types/Sheep/output';
import { SheepBeefInput } from './types/SheepBeef/input';
import { SheepBeefOutput } from './types/SheepBeef/output';
import { SugarInput } from './types/Sugar/input';
import { SugarOutput } from './types/Sugar/output';
import { VineyardInput } from './types/Vineyard/input';
import { VineyardOutput } from './types/Vineyard/output';
import { WildCatchFisheryInput } from './types/WildCatchFishery/input';
import { WildCatchFisheryOutput } from './types/WildCatchFishery/output';
import { WildSeaFisheriesInput } from './types/WildSeaFisheries/input';
import { WildSeaFisheriesOutput } from './types/WildSeaFisheries/output';

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

export function calculateBeef(input: BeefInput): BeefOutput {
  return executeCalculator(calculateBeefInternal, input, CalculatorNames.Beef);
}

export function calculateAquaculture(
  input: AquacultureInput,
): AquacultureOutput {
  return executeCalculator(
    calculateAquacultureInternal,
    input,
    CalculatorNames.Aquaculture,
  );
}

export function calculateBuffalo(input: BuffaloInput): BuffaloOutput {
  return executeCalculator(
    calculateBuffaloInternal,
    input,
    CalculatorNames.Buffalo,
  );
}

export function calculateCotton(input: CottonInput): CottonOutput {
  return executeCalculator(
    calculateCottonInternal,
    input,
    CalculatorNames.Cotton,
  );
}

export function calculateDairy(input: DairyInput): DairyOutput {
  return executeCalculator(
    calculateDairyInternal,
    input,
    CalculatorNames.Dairy,
  );
}

export function calculateDeer(input: DeerInput): DeerOutput {
  return executeCalculator(calculateDeerInternal, input, CalculatorNames.Deer);
}

export function calculateFeedlot(input: FeedlotInput): FeedlotOutput {
  return executeCalculator(
    calculateFeedlotInternal,
    input,
    CalculatorNames.Feedlot,
  );
}

export function calculateGoat(input: GoatInput): GoatOutput {
  return executeCalculator(calculateGoatInternal, input, CalculatorNames.Goat);
}

export function calculateGrains(input: GrainsInput): GrainsOutput {
  return executeCalculator(
    calculateGrainsInternal,
    input,
    CalculatorNames.Grains,
  );
}

export function calculateHorticulture(
  input: HorticultureInput,
): HorticultureOutput {
  return executeCalculator(
    calculateHorticultureInternal,
    input,
    CalculatorNames.Horticulture,
  );
}

export function calculatePork(input: PorkInput): PorkOutput {
  return executeCalculator(calculatePorkInternal, input, CalculatorNames.Pork);
}

export function calculatePoultry(input: PoultryInput): PoultryOutput {
  return executeCalculator(
    calculatePoultryInternal,
    input,
    CalculatorNames.Poultry,
  );
}

export function calculateProcessing(input: ProcessingInput): ProcessingOutput {
  return executeCalculator(
    calculateProcessingInternal,
    input,
    CalculatorNames.Processing,
  );
}

export function calculateRice(input: RiceInput): RiceOutput {
  return executeCalculator(calculateRiceInternal, input, CalculatorNames.Rice);
}

export function calculateSheep(input: SheepInput): SheepOutput {
  return executeCalculator(
    calculateSheepInternal,
    input,
    CalculatorNames.Sheep,
  );
}

export function calculateSheepBeef(input: SheepBeefInput): SheepBeefOutput {
  return executeCalculator(
    calculateSheepBeefInternal,
    input,
    CalculatorNames.SheepBeef,
  );
}

export function calculateSugar(input: SugarInput): SugarOutput {
  return executeCalculator(
    calculateSugarInternal,
    input,
    CalculatorNames.Sugar,
  );
}

export function calculateVineyard(input: VineyardInput): VineyardOutput {
  return executeCalculator(
    calculateVineyardInternal,
    input,
    CalculatorNames.Vineyard,
  );
}

export function calculateWildCatchFishery(
  input: WildCatchFisheryInput,
): WildCatchFisheryOutput {
  return executeCalculator(
    calculateWildCatchFisheryInternal,
    input,
    CalculatorNames.WildCatchFishery,
  );
}

export function calculateWildSeaFisheries(
  input: WildSeaFisheriesInput,
): WildSeaFisheriesOutput {
  return executeCalculator(
    calculateWildSeaFisheriesInternal,
    input,
    CalculatorNames.WildSeaFisheries,
  );
}
