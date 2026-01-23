import { entriesFromObject } from '@/calculators/common/tools/object';
import { Decimal } from 'decimal.js-light';
import { Output } from './outputs';

const isN2O = (output: Output<1>): output is Output<1, 'N2O'> => {
  return output.unit.substance === 'N2O';
};

const isCH4 = (output: Output<1>): output is Output<1, 'CH4'> => {
  return output.unit.substance === 'CH4';
};

const isCO2 = (output: Output<1>): output is Output<1, 'CO2'> => {
  return output.unit.substance === 'CO2';
};

export const addScope1Totals = <T extends Record<string, Output<1>>>(
  outputs: T,
): T & {
  totalN2O: { value: Decimal };
  totalCH4: { value: Decimal };
  totalCO2: { value: Decimal };
  total: { value: Decimal };
} => {
  const entries: Output<1>[] = entriesFromObject(outputs).map(
    ([_, value]) => value,
  );
  const outputsN2O = entries.filter(isN2O);
  const outputsCH4 = entries.filter(isCH4);
  const outputsCO2 = entries.filter(isCO2);
  const totalN2O = {
    value: outputsN2O.reduce(
      (acc, curr) => acc.add(curr.amountCO2e),
      new Decimal(0),
    ),
  };
  const totalCH4 = {
    value: outputsCH4.reduce(
      (acc, curr) => acc.add(curr.amountCO2e),
      new Decimal(0),
    ),
  };
  const totalCO2 = {
    value: outputsCO2.reduce(
      (acc, curr) => acc.add(curr.amountCO2e),
      new Decimal(0),
    ),
  };
  const total = {
    value: totalN2O.value.add(totalCH4.value).add(totalCO2.value),
  };
  return {
    ...outputs,
    totalN2O,
    totalCH4,
    totalCO2,
    total,
  };
};

export const addScope23Totals = <T extends Record<string, Output<2 | 3>>>(
  outputs: T,
): T & {
  total: { value: Decimal };
} => {
  const entries: Output<2 | 3>[] = entriesFromObject(outputs).map(
    ([_, value]) => value,
  );
  return {
    ...outputs,
    total: {
      value: entries.reduce(
        (acc, curr) => acc.add(curr.amountCO2e),
        new Decimal(0),
      ),
    },
  };
};
