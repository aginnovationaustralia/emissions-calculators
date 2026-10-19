import { entriesFromObject } from '@/calculators/common/tools/object';
import XLSX, { Cell } from 'xlsx-populate';

export const getWorkbook = async (filePath: string) => {
  // log the current working directory
  const workbook = await XLSX.fromFileAsync(filePath);
  return workbook;
};

export const getSheet = async (filePath: string, sheetName: string) => {
  const workbook = await getWorkbook(filePath);
  return workbook.sheet(sheetName);
};

export const mapInput =
  <T extends string>(lookup: Record<T, string>) =>
  (input: Cell): T => {
    const value = input.value();
    if (typeof value !== 'string') {
      throw new Error(
        `Cell address ${input.address()} is not a string: ${value}`,
      );
    }

    const trimmed = value.trim();

    const match = entriesFromObject(lookup).find(([_k, v]) => v === trimmed);

    if (match) {
      return match[0];
    }

    throw new Error(
      `Cell address ${input.address()} is not a valid value: '${trimmed}'`,
    );
  };

export const numberInput = (input: Cell): number => {
  const value = input.value();
  if (typeof value !== 'number') {
    throw new Error(
      `Cell address ${input
        .sheet()
        .name()}:${input.address()} is not a number: ${value}`,
    );
  }
  return value;
};

export const stringInput = (input: Cell): string => {
  const value = input.value();
  if (typeof value !== 'string') {
    throw new Error(
      `Cell address ${input
        .sheet()
        ?.name()}:${input.address()} is not a string: ${value}`,
    );
  }
  return value;
};

export const isEmptyCell = (input: Cell): boolean => {
  const value = input.value();
  return value === undefined || value === null || value === '';
};

export const emptyOrNumber = (input: Cell): number | null => {
  if (isEmptyCell(input)) {
    return null;
  }
  return numberInput(input);
};

export const calculateElectricity = (
  renewable: number | null,
  nonRenewable: number | null,
) => {
  const total = (renewable ?? 0) + (nonRenewable ?? 0);
  return {
    electricitySource:
      nonRenewable && renewable && renewable > 0 ? 'State Grid' : 'Renewable',
    electricityUse: total,
    electricityRenewable: total <= 0 ? 0 : (renewable ?? 0) / total,
  } as const;
};
