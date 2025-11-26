import { entriesFromObject } from '@/calculators/common/tools/object';
import { States } from '@/constants/types';
import { CropVegetation, RainfallRegion, SoilType, TreeType } from '@/types';
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
      throw new Error(
        `Cell address ${input.address()} is not a string: ${value}`,
      );
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

export const mapInputRegion = mapInput<States>({
  wa_sw: 'SW WA',
  wa_nw: 'NW WA',
  vic: 'Vic',
  qld: 'Qld',
  sa: 'SA',
  tas: 'Tas',
  nt: 'NT',
  act: 'ACT',
  nsw: 'NSW',
});

export const mapInputRegionFromNumber = (input: Cell): States => {
  const numberValue = numberInput(input);

  const lookup: Record<States, number> = {
    act: 1,
    nsw: 2,
    tas: 3,
    wa_sw: 4,
    sa: 5,
    vic: 6,
    qld: 7,
    nt: 8,
    wa_nw: 9,
  };

  const match = entriesFromObject(lookup).find(([_k, v]) => v === numberValue);

  if (match) {
    return match[0];
  }

  throw new Error(
    `Cell address ${input.address()} is not a valid state: ${numberValue}`,
  );
};

export const calculateElectricity = (
  renewable: number,
  nonRenewable: number,
) => {
  const total = renewable + nonRenewable;
  return {
    electricitySource: nonRenewable > 0 ? 'State Grid' : 'Renewable',
    electricityUse: total,
    electricityRenewable: total <= 0 ? 0 : renewable / total,
  } as const;
};

const getCropVegetation = (
  details: XLSX.Range,
  allocations: XLSX.Range,
): CropVegetation => {
  return {
    allocationToCrops: allocations
      .cells()[0]
      .map((allocation) => numberInput(allocation)),
    vegetation: {
      region: stringInput(details.cell(0, 0)) as RainfallRegion,
      treeSpecies: stringInput(details.cell(1, 0)) as TreeType,
      soil: stringInput(details.cell(2, 0)) as SoilType,
      area: numberInput(details.cell(3, 0)),
      age: numberInput(details.cell(4, 0)),
    },
  };
};

export const getCropVegetations = (sheet: XLSX.Sheet): CropVegetation[] => {
  return [
    getCropVegetation(sheet.range('E3:E7'), sheet.range('E9:E13')),
    getCropVegetation(sheet.range('E16:E20'), sheet.range('E22:E26')),
    getCropVegetation(sheet.range('E29:E33'), sheet.range('E35:E39')),
    getCropVegetation(sheet.range('E42:E46'), sheet.range('E48:E52')),
  ];
};
