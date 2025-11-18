import { AquacultureInput } from '@/types/Aquaculture/input';
import { AquacultureOutput } from '@/types/Aquaculture/output';
import { BeefInput } from '@/types/Beef/input';
import { BeefOutput } from '@/types/Beef/output';
import { BuffaloInput } from '@/types/Buffalo/input';
import { BuffaloOutput } from '@/types/Buffalo/output';
import { CottonInput } from '@/types/Cotton/input';
import { CottonOutput } from '@/types/Cotton/output';
import { DairyInput } from '@/types/Dairy/input';
import { DairyOutput } from '@/types/Dairy/output';
import { DeerInput } from '@/types/Deer/input';
import { DeerOutput } from '@/types/Deer/output';
import { FeedlotInput } from '@/types/Feedlot/input';
import { FeedlotOutput } from '@/types/Feedlot/output';
import { GoatInput } from '@/types/Goat/input';
import { GoatOutput } from '@/types/Goat/output';
import { GrainsInput } from '@/types/Grains/input';
import { GrainsOutput } from '@/types/Grains/output';
import { HorticultureInput } from '@/types/Horticulture/input';
import { HorticultureOutput } from '@/types/Horticulture/output';
import { PorkInput } from '@/types/Pork/input';
import { PorkOutput } from '@/types/Pork/output';
import { PoultryInput } from '@/types/Poultry/input';
import { PoultryOutput } from '@/types/Poultry/output';
import { ProcessingInput } from '@/types/Processing/input';
import { ProcessingOutput } from '@/types/Processing/output';
import { RiceInput } from '@/types/Rice/input';
import { RiceOutput } from '@/types/Rice/output';
import { SheepInput } from '@/types/Sheep/input';
import { SheepOutput } from '@/types/Sheep/output';
import { SheepBeefInput } from '@/types/SheepBeef/input';
import { SheepBeefOutput } from '@/types/SheepBeef/output';
import { SugarInput } from '@/types/Sugar/input';
import { SugarOutput } from '@/types/Sugar/output';
import { VineyardInput } from '@/types/Vineyard/input';
import { VineyardOutput } from '@/types/Vineyard/output';
import { WildCatchFisheryInput } from '@/types/WildCatchFishery/input';
import { WildCatchFisheryOutput } from '@/types/WildCatchFishery/output';
import { WildSeaFisheriesInput } from '@/types/WildSeaFisheries/input';
import { WildSeaFisheriesOutput } from '@/types/WildSeaFisheries/output';
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
import {
  CalculatorOptions,
  executeCalculator,
} from './execution/browser/browser-execute';
import { CalculatorNames } from './strings';

export function calculateBeef(input: BeefInput): BeefOutput {
  return executeCalculator(calculateBeefInternal, input, CalculatorNames.Beef);
}

export function calculateAquaculture(
  input: AquacultureInput,
  options?: CalculatorOptions,
): AquacultureOutput {
  return executeCalculator(
    calculateAquacultureInternal,
    input,
    CalculatorNames.Aquaculture,
    options,
  );
}

export function calculateBuffalo(
  input: BuffaloInput,
  options?: CalculatorOptions,
): BuffaloOutput {
  return executeCalculator(
    calculateBuffaloInternal,
    input,
    CalculatorNames.Buffalo,
    options,
  );
}

export function calculateCotton(
  input: CottonInput,
  options?: CalculatorOptions,
): CottonOutput {
  return executeCalculator(
    calculateCottonInternal,
    input,
    CalculatorNames.Cotton,
    options,
  );
}

export function calculateDairy(
  input: DairyInput,
  options?: CalculatorOptions,
): DairyOutput {
  return executeCalculator(
    calculateDairyInternal,
    input,
    CalculatorNames.Dairy,
    options,
  );
}

export function calculateDeer(
  input: DeerInput,
  options?: CalculatorOptions,
): DeerOutput {
  return executeCalculator(
    calculateDeerInternal,
    input,
    CalculatorNames.Deer,
    options,
  );
}

export function calculateFeedlot(
  input: FeedlotInput,
  options?: CalculatorOptions,
): FeedlotOutput {
  return executeCalculator(
    calculateFeedlotInternal,
    input,
    CalculatorNames.Feedlot,
    options,
  );
}

export function calculateGoat(
  input: GoatInput,
  options?: CalculatorOptions,
): GoatOutput {
  return executeCalculator(
    calculateGoatInternal,
    input,
    CalculatorNames.Goat,
    options,
  );
}

export function calculateGrains(
  input: GrainsInput,
  options?: CalculatorOptions,
): GrainsOutput {
  return executeCalculator(
    calculateGrainsInternal,
    input,
    CalculatorNames.Grains,
    options,
  );
}

export function calculateHorticulture(
  input: HorticultureInput,
  options?: CalculatorOptions,
): HorticultureOutput {
  return executeCalculator(
    calculateHorticultureInternal,
    input,
    CalculatorNames.Horticulture,
    options,
  );
}

export function calculatePork(
  input: PorkInput,
  options?: CalculatorOptions,
): PorkOutput {
  return executeCalculator(
    calculatePorkInternal,
    input,
    CalculatorNames.Pork,
    options,
  );
}

export function calculatePoultry(
  input: PoultryInput,
  options?: CalculatorOptions,
): PoultryOutput {
  return executeCalculator(
    calculatePoultryInternal,
    input,
    CalculatorNames.Poultry,
    options,
  );
}

export function calculateProcessing(
  input: ProcessingInput,
  options?: CalculatorOptions,
): ProcessingOutput {
  return executeCalculator(
    calculateProcessingInternal,
    input,
    CalculatorNames.Processing,
    options,
  );
}

export function calculateRice(
  input: RiceInput,
  options?: CalculatorOptions,
): RiceOutput {
  return executeCalculator(
    calculateRiceInternal,
    input,
    CalculatorNames.Rice,
    options,
  );
}

export function calculateSheep(
  input: SheepInput,
  options?: CalculatorOptions,
): SheepOutput {
  return executeCalculator(
    calculateSheepInternal,
    input,
    CalculatorNames.Sheep,
    options,
  );
}

export function calculateSheepBeef(
  input: SheepBeefInput,
  options?: CalculatorOptions,
): SheepBeefOutput {
  return executeCalculator(
    calculateSheepBeefInternal,
    input,
    CalculatorNames.SheepBeef,
    options,
  );
}

export function calculateSugar(
  input: SugarInput,
  options?: CalculatorOptions,
): SugarOutput {
  return executeCalculator(
    calculateSugarInternal,
    input,
    CalculatorNames.Sugar,
    options,
  );
}

export function calculateVineyard(
  input: VineyardInput,
  options?: CalculatorOptions,
): VineyardOutput {
  return executeCalculator(
    calculateVineyardInternal,
    input,
    CalculatorNames.Vineyard,
    options,
  );
}

export function calculateWildCatchFishery(
  input: WildCatchFisheryInput,
  options?: CalculatorOptions,
): WildCatchFisheryOutput {
  return executeCalculator(
    calculateWildCatchFisheryInternal,
    input,
    CalculatorNames.WildCatchFishery,
    options,
  );
}

export function calculateWildSeaFisheries(
  input: WildSeaFisheriesInput,
  options?: CalculatorOptions,
): WildSeaFisheriesOutput {
  return executeCalculator(
    calculateWildSeaFisheriesInternal,
    input,
    CalculatorNames.WildSeaFisheries,
    options,
  );
}
