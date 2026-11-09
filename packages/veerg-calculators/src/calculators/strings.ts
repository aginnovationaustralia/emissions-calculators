export const allCalculatorNames = [
  'all-modules',
  'aquaculture',
  'beef',
  'cotton',
  'cropping',
  'dairy',
  'feedlot',
  'forestry',
  'grains',
  'horticulture',
  'other-livestock',
  'pigs',
  'post-production',
  'poultry',
  'rice',
  'sheep',
  'sugar',
  'viticulture',
  'wild-catch-fisheries',
] as const;
export type CalculatorNames = (typeof allCalculatorNames)[number];

export const isValidCalculatorName = (
  name: string,
): name is CalculatorNames => {
  return allCalculatorNames.includes(name as CalculatorNames);
};
