import { calculateAquaculture as calculateAquacultureInternal } from './Aquaculture/calculator';
import { calculateBeef } from './Beef';
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
import { createNodeCalculator } from './execution/node/execute';
import { CalculatorNames } from './strings';

export const calculateAquaculture = createNodeCalculator(
  calculateAquacultureInternal,
  CalculatorNames.Aquaculture,
);

export const calculateBuffalo = createNodeCalculator(
  calculateBuffaloInternal,
  CalculatorNames.Buffalo,
);

export const calculateCotton = createNodeCalculator(
  calculateCottonInternal,
  CalculatorNames.Cotton,
);

export const calculateDairy = createNodeCalculator(
  calculateDairyInternal,
  CalculatorNames.Dairy,
);

export const calculateDeer = createNodeCalculator(
  calculateDeerInternal,
  CalculatorNames.Deer,
);

export const calculateFeedlot = createNodeCalculator(
  calculateFeedlotInternal,
  CalculatorNames.Feedlot,
);

export const calculateGoat = createNodeCalculator(
  calculateGoatInternal,
  CalculatorNames.Goat,
);

export const calculateGrains = createNodeCalculator(
  calculateGrainsInternal,
  CalculatorNames.Grains,
);

export const calculateHorticulture = createNodeCalculator(
  calculateHorticultureInternal,
  CalculatorNames.Horticulture,
);

export const calculatePork = createNodeCalculator(
  calculatePorkInternal,
  CalculatorNames.Pork,
);

export const calculatePoultry = createNodeCalculator(
  calculatePoultryInternal,
  CalculatorNames.Poultry,
);

export const calculateProcessing = createNodeCalculator(
  calculateProcessingInternal,
  CalculatorNames.Processing,
);

export const calculateRice = createNodeCalculator(
  calculateRiceInternal,
  CalculatorNames.Rice,
);

export const calculateSheep = createNodeCalculator(
  calculateSheepInternal,
  CalculatorNames.Sheep,
);

export const calculateSheepBeef = createNodeCalculator(
  calculateSheepBeefInternal,
  CalculatorNames.SheepBeef,
);

export const calculateSugar = createNodeCalculator(
  calculateSugarInternal,
  CalculatorNames.Sugar,
);

export const calculateVineyard = createNodeCalculator(
  calculateVineyardInternal,
  CalculatorNames.Vineyard,
);

export const calculateWildCatchFishery = createNodeCalculator(
  calculateWildCatchFisheryInternal,
  CalculatorNames.WildCatchFishery,
);

export const calculateWildSeaFisheries = createNodeCalculator(
  calculateWildSeaFisheriesInternal,
  CalculatorNames.WildSeaFisheries,
);

export { calculateBeef };
