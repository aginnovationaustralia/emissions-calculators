import {
  entriesFromObject,
  ObjectEntry,
  objectFromEntries,
} from '@/calculators/common/tools/object';
import { Decimal } from 'decimal.js-light';
import { ConstantDefinition, Output } from './outputs';

const isN2O = (output: Output<1>): output is Output<1, 'N2O'> => {
  return output.unit.substance === 'N2O';
};

const isCH4 = (output: Output<1>): output is Output<1, 'CH4'> => {
  return output.unit.substance === 'CH4';
};

const isCO2 = (output: Output<1>): output is Output<1, 'CO2'> => {
  return output.unit.substance === 'CO2';
};

export const addScope1Totals = <
  T extends Record<string, Output<1>>,
  K extends keyof T & string,
  // O extends Record<K, { value: Decimal; reference: string }> = Record<K, { value: Decimal; reference: string }>,
>(
  outputs: T,
): Record<
  K,
  { value: number; references: string[]; constants: ConstantDefinition[] }
> & {
  totalN2O: { value: number };
  totalCH4: { value: number };
  totalCO2: { value: number };
  total: { value: number };
} => {
  const entries: ObjectEntry<T>[] = entriesFromObject(outputs);

  const foo: ObjectEntry<
    Record<
      K,
      { value: number; references: string[]; constants: ConstantDefinition[] }
    >
  >[] = entries.map(([k, value]) => [
    k as K,
    {
      value: value.amountCO2e.toNumber(),
      references: value.references,
      constants: value.constants,
    },
  ]);

  const translatedOutputs = objectFromEntries(foo);

  const values: Output<1>[] = entries.map(([_, value]) => value);
  const outputsN2O = values.filter(isN2O);
  const outputsCH4 = values.filter(isCH4);
  const outputsCO2 = values.filter(isCO2);
  const totalN2O = {
    value: outputsN2O
      .reduce((acc, curr) => acc.add(curr.amountCO2e), new Decimal(0))
      .toNumber(),
  };
  const totalCH4 = {
    value: outputsCH4
      .reduce((acc, curr) => acc.add(curr.amountCO2e), new Decimal(0))
      .toNumber(),
  };
  const totalCO2 = {
    value: outputsCO2
      .reduce((acc, curr) => acc.add(curr.amountCO2e), new Decimal(0))
      .toNumber(),
  };
  const total = {
    value: totalN2O.value + totalCH4.value + totalCO2.value,
  };
  return {
    ...translatedOutputs,
    totalN2O,
    totalCH4,
    totalCO2,
    total,
  };
};

export const addScope23Totals = <
  T extends Record<string, Output<2 | 3>>,
  K extends keyof T & string,
>(
  outputs: T,
): Record<
  K,
  { value: number; references: string[]; constants: ConstantDefinition[] }
> & {
  total: { value: number };
} => {
  const entries: ObjectEntry<T>[] = entriesFromObject(outputs);

  const foo: ObjectEntry<
    Record<
      K,
      { value: number; references: string[]; constants: ConstantDefinition[] }
    >
  >[] = entries.map(([k, value]) => [
    k as K,
    {
      value: value.amountCO2e.toNumber(),
      references: value.references,
      constants: value.constants,
    },
  ]);

  const translatedOutputs = objectFromEntries(foo);

  const values: Output<2 | 3>[] = entries.map(([_, value]) => value);
  return {
    ...translatedOutputs,
    total: {
      value: values
        .reduce((acc, curr) => acc.add(curr.amountCO2e), new Decimal(0))
        .toNumber(),
    },
  };
};
