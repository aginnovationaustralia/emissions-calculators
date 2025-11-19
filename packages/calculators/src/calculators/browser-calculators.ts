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
import { createBrowserCalculator } from './execution/browser/execute';
import { CalculatorNames } from './strings';

export const calculateAquaculture = createBrowserCalculator(
  calculateAquacultureInternal,
  CalculatorNames.Aquaculture,
);

export const calculateBeef = createBrowserCalculator(
  calculateBeefInternal,
  CalculatorNames.Beef,
);

export const calculateBuffalo = createBrowserCalculator(
  calculateBuffaloInternal,
  CalculatorNames.Buffalo,
);

export const calculateCotton = createBrowserCalculator(
  calculateCottonInternal,
  CalculatorNames.Cotton,
);

export const calculateDairy = createBrowserCalculator(
  calculateDairyInternal,
  CalculatorNames.Dairy,
);

export const calculateDeer = createBrowserCalculator(
  calculateDeerInternal,
  CalculatorNames.Deer,
);

export const calculateFeedlot = createBrowserCalculator(
  calculateFeedlotInternal,
  CalculatorNames.Feedlot,
);

export const calculateGoat = createBrowserCalculator(
  calculateGoatInternal,
  CalculatorNames.Goat,
);

export const calculateGrains = createBrowserCalculator(
  calculateGrainsInternal,
  CalculatorNames.Grains,
);

export const calculateHorticulture = createBrowserCalculator(
  calculateHorticultureInternal,
  CalculatorNames.Horticulture,
);

export const calculatePork = createBrowserCalculator(
  calculatePorkInternal,
  CalculatorNames.Pork,
);

export const calculatePoultry = createBrowserCalculator(
  calculatePoultryInternal,
  CalculatorNames.Poultry,
);

export const calculateProcessing = createBrowserCalculator(
  calculateProcessingInternal,
  CalculatorNames.Processing,
);

export const calculateRice = createBrowserCalculator(
  calculateRiceInternal,
  CalculatorNames.Rice,
);

export const calculateSheep = createBrowserCalculator(
  calculateSheepInternal,
  CalculatorNames.Sheep,
);

export const calculateSheepBeef = createBrowserCalculator(
  calculateSheepBeefInternal,
  CalculatorNames.SheepBeef,
);

export const calculateSugar = createBrowserCalculator(
  calculateSugarInternal,
  CalculatorNames.Sugar,
);

export const calculateVineyard = createBrowserCalculator(
  calculateVineyardInternal,
  CalculatorNames.Vineyard,
);

export const calculateWildCatchFishery = createBrowserCalculator(
  calculateWildCatchFisheryInternal,
  CalculatorNames.WildCatchFishery,
);

export const calculateWildSeaFisheries = createBrowserCalculator(
  calculateWildSeaFisheriesInternal,
  CalculatorNames.WildSeaFisheries,
);
