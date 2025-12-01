export type CalculatorNames =
  | 'beef'
  | 'aquaculture'
  | 'buffalo'
  | 'cotton'
  | 'dairy'
  | 'deer'
  | 'feedlot'
  | 'feedlotbeef'
  | 'goat'
  | 'grains'
  | 'horticulture'
  | 'pork'
  | 'poultry'
  | 'processing'
  | 'rice'
  | 'sheep'
  | 'sheepbeef'
  | 'sugar'
  | 'vineyard'
  | 'wildcatchfishery'
  | 'wildseafisheries';

export const allCalculatorNames: CalculatorNames[] = [
  'beef',
  'aquaculture',
  'buffalo',
  'cotton',
  'dairy',
  'deer',
  'feedlot',
  'feedlotbeef',
  'goat',
  'grains',
  'horticulture',
  'pork',
  'poultry',
  'processing',
  'rice',
  'sheep',
  'sheepbeef',
  'sugar',
  'vineyard',
  'wildcatchfishery',
  'wildseafisheries',
];

export const isValidCalculatorName = (
  name: string,
): name is CalculatorNames => {
  return allCalculatorNames.includes(name as CalculatorNames);
};
