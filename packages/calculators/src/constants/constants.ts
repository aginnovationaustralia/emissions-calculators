import { PoultryClass, Season, SheepClassesAPI } from '@/types/enums';

// Used for calving calculations where we need to also get the previous season
export const SEASONS_AFTER = {
  spring: 'winter',
  summer: 'spring',
  autumn: 'summer',
  winter: 'autumn',
} as {
  [season in Season]: 'winter' | 'spring' | 'summer' | 'autumn';
};

export const SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter'];

export const SHEEP_CLASSES_BREEDING_API: (typeof SheepClassesAPI)[number][] = [
  'rams',
  'wethers',
  'maidenBreedingEwes',
  'breedingEwes',
  'otherEwes',
  'eweLambs',
  'wetherLambs',
];

export const SHEEP_CLASSES_TRADING_API: (typeof SheepClassesAPI)[number][] = [
  'tradeRams',
  'tradeWethers',
  'tradeBreedingEwes',
  'tradeOtherEwes',
  'tradeOtherEwes',
  'tradeEweLambs',
  'tradeWetherLambs',
  'tradeLambsAndHoggets',
  'tradeEwes',
  'tradeMaidenBreedingEwes',
];

export const BEEF_CLASSES_BREEDING_API = [
  'bullsGt1',
  'steersLt1',
  'steers1To2',
  'steersGt2',
  'cowsGt2',
  'heifersLt1',
  'heifers1To2',
  'heifersGt2',
] as const;

export const BEEF_CLASSES_TRADING_API = [
  'bullsGt1Traded',
  'steersLt1Traded',
  'steers1To2Traded',
  'steersGt2Traded',
  'cowsGt2Traded',
  'heifersLt1Traded',
  'heifers1To2Traded',
  'heifersGt2Traded',
] as const;

export const POULTRY_CLASSES: PoultryClass[] = [
  'layers',
  'meat_chicken_growers',
  'meat_chicken_layers',
  'meat_other',
];

export const DAYS_IN_SEASON = 365 / 4;
