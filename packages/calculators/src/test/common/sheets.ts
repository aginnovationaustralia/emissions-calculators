import { entriesFromObject } from '@/calculators/common/tools/object';
import XLSX, { Cell } from 'xlsx-populate';

export const getWorkbook = async (filePath: string) => {
  // log the current working directory
  console.log(process.cwd());
  const workbook = await XLSX.fromFileAsync(filePath);
  return workbook;
};

export const mapInput =
  <T extends string>(lookup: Record<T, string>) =>
  (input: Cell): T => {
    const value = input.value();
    if (typeof value !== 'string') {
      throw new Error(`Cell is not a string: ${input.address()}`);
    }

    const match = entriesFromObject(lookup).find(([_k, v]) => v === value);

    if (match) {
      return match[0];
    }

    throw new Error(
      `Cell address ${input.address()} is not a valid value: ${value}`,
    );
  };

export const numberInput = (input: Cell): number => {
  const value = input.value();
  if (typeof value !== 'number') {
    throw new Error(`Cell is not a number: ${input.address()}`);
  }
  return value;
};
