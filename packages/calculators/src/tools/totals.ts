import {
  entriesFromObject,
  ObjectEntry,
  objectFromEntries,
} from '@/calculators/common/tools/object';
import { Decimal } from 'decimal.js-light';
import { ConstantDefinition, InputDefinition } from './collect';
import { Output } from './outputs';
import { kgToTonnes } from './unit-conversion';

const isN2O = (output: Output<1>): output is Output<1, 'N2O'> => {
  return output.unit.substance === 'N2O';
};

const isCH4 = (output: Output<1>): output is Output<1, 'CH4'> => {
  return output.unit.substance === 'CH4';
};

const isCO2 = (output: Output<1>): output is Output<1, 'CO2'> => {
  return output.unit.substance === 'CO2';
};

const isCO2e = (output: Output<1>): output is Output<1, 'CO2e'> => {
  return output.unit.substance === 'CO2e';
};

type MethodAmounts =
  | { method: '1'; amountGasKgMethod1: number; amountGasKgMethod2: undefined }
  | {
      method: '2';
      amountGasKgMethod1: number | undefined;
      amountGasKgMethod2: number;
    };

export type KeysOnOutput = {
  amountGasKg: number;
  gas: 'CO2' | 'CH4' | 'N2O' | 'CO2e';
  amountTonnesCO2e: number;
  references: string[];
  constants: ConstantDefinition[];
  inputs: InputDefinition[];
} & MethodAmounts;

const exposeMethodAmounts = (
  internalResult: Output<1 | 2 | 3>,
): MethodAmounts =>
  internalResult.method === '1'
    ? {
        method: '1',
        amountGasKgMethod1: internalResult.valueMethod1.toNumber(),
        amountGasKgMethod2: undefined,
      }
    : {
        method: '2',
        amountGasKgMethod1: internalResult.valueMethod1?.toNumber(),
        amountGasKgMethod2: internalResult.valueMethod2.toNumber(),
      };

/**
 * Perform the final conversion of an Output Container to primitive values for JSON
 * @param internalResult An Output Container instance, storing a strongly typed Decimal, value store etc
 * @returns Primitive values designed for serialising to a JSON schema
 */
const exposeKeysOnOutput = (
  internalResult: Output<1 | 2 | 3>,
): KeysOnOutput => ({
  amountGasKg: internalResult.value.toNumber(),
  gas: internalResult.unit.substance,
  amountTonnesCO2e: kgToTonnes(internalResult.amountKgCO2e).toNumber(),
  ...exposeMethodAmounts(internalResult),
  references: internalResult.references,
  constants: internalResult.constants,
  inputs: internalResult.inputs,
});

export const addScope1Totals = <
  T extends Record<string, Output<1>>,
  K extends keyof T & string,
>(
  outputs: T,
): Record<K, KeysOnOutput> & {
  totalN2O: { tonnesCO2e: number };
  totalCH4: { tonnesCO2e: number };
  totalCO2: { tonnesCO2e: number };
  totalOtherGases: { tonnesCO2e: number };
  total: { tonnesCO2e: number };
} => {
  const entries: ObjectEntry<T>[] = entriesFromObject(outputs);

  const outputValues: ObjectEntry<Record<K, KeysOnOutput>>[] = entries.map(
    ([k, value]) => [k as K, exposeKeysOnOutput(value)],
  );

  const translatedOutputs = objectFromEntries(outputValues);

  const values: Output<1>[] = entries.map(([_, value]) => value);
  const outputsN2O = values.filter(isN2O);
  const outputsCH4 = values.filter(isCH4);
  const outputsCO2 = values.filter(isCO2);
  const outputsOther = values.filter(isCO2e);
  const totalN2O = {
    tonnesCO2e: kgToTonnes(
      outputsN2O.reduce(
        (acc, curr) => acc.add(curr.amountKgCO2e),
        new Decimal(0),
      ),
    ).toNumber(),
  };
  const totalCH4 = {
    tonnesCO2e: kgToTonnes(
      outputsCH4.reduce(
        (acc, curr) => acc.add(curr.amountKgCO2e),
        new Decimal(0),
      ),
    ).toNumber(),
  };
  const totalCO2 = {
    tonnesCO2e: kgToTonnes(
      outputsCO2.reduce(
        (acc, curr) => acc.add(curr.amountKgCO2e),
        new Decimal(0),
      ),
    ).toNumber(),
  };
  const totalOtherGases = {
    tonnesCO2e: kgToTonnes(
      outputsOther.reduce(
        (acc, curr) => acc.add(curr.amountKgCO2e),
        new Decimal(0),
      ),
    ).toNumber(),
  };
  const total = {
    tonnesCO2e:
      totalN2O.tonnesCO2e +
      totalCH4.tonnesCO2e +
      totalCO2.tonnesCO2e +
      totalOtherGases.tonnesCO2e,
  };
  return {
    ...translatedOutputs,
    totalN2O,
    totalCH4,
    totalCO2,
    totalOtherGases,
    total,
  };
};

export const addScope23Totals = <
  T extends Record<string, Output<2 | 3>>,
  K extends keyof T & string,
>(
  outputs: T,
): Record<K, KeysOnOutput> & {
  total: { tonnesCO2e: number };
} => {
  const entries: ObjectEntry<T>[] = entriesFromObject(outputs);

  const outputEntries: ObjectEntry<Record<K, KeysOnOutput>>[] = entries.map(
    ([k, value]) => [k as K, exposeKeysOnOutput(value)],
  );

  const translatedOutputs = objectFromEntries(outputEntries);

  const values: Output<2 | 3>[] = entries.map(([_, value]) => value);
  return {
    ...translatedOutputs,
    total: {
      tonnesCO2e: kgToTonnes(
        values.reduce(
          (acc, curr) => acc.add(curr.amountKgCO2e),
          new Decimal(0),
        ),
      ).toNumber(),
    },
  };
};
