import { CalculatorNames } from '@/tools';

export const GAF_REFERENCES: Record<
  Exclude<CalculatorNames, 'processing'>,
  string
> = {
  aquaculture: 'Aq-GAFv1.0',
  beef: 'SB-GAFv2.6_seasonal',
  buffalo: 'Buffalo GAF v1.6',
  cotton: 'Cotton Greenhouse V.1.38',
  dairy: 'DairyGreenhouseV14.9',
  deer: 'Deer GAF V1.3.3',
  feedlot: 'FeedlotbeefGreenhouseV5.0',
  feedlotbeef: 'FeedlotbeefGreenhouseV5.0',
  goat: 'Goat-GAF V1.26',
  grains: 'GrainsGreenhouseV11.1',
  horticulture: 'HorticultureGreenhouseV1.48',
  pork: 'Pork-GAF V2.0',
  poultry: 'Poultry-GAF V1.48',
  //   processing: '', // NOTE: No actual standalone sheet published for processing
  rice: 'Rice G-GAF V1.2',
  sheep: 'SB-GAFv2.6_seasonal',
  sheepbeef: 'SB-GAFv2.6_seasonal',
  sugar: 'Sugar Greenhouse V.1.29.1',
  vineyard: 'VineyardWineryGAF Tool V1.0',
  wildcatchfishery: 'WF-GAFv2.0',
  wildseafisheries: 'WF-GAFv1',
};
