export type CalculatorNames = 'grains';

export const allCalculatorNames: CalculatorNames[] = ['grains'];

export const isValidCalculatorName = (
  name: string,
): name is CalculatorNames => {
  return allCalculatorNames.includes(name as CalculatorNames);
};
