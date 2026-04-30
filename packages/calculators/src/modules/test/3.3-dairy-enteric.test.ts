import {
  DairyInput,
  DairyInputSchema,
  DairyInputTransformed,
} from '@/calculators/Dairy/types/input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculate33DairyEntericMethane } from '../scope1/3-enteric-methane/3.3-dairy-enteric';
import { DairyMilkProductionInput } from '../scope1/shared/dairy/milk.input';
import { checkDairyBreed } from './dairy-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const columnBreed = 'C';
const columnHead = 'E';
const columnCustomDurationDays = 'F';
const columnCustomLiveweight = 'H';
const columnCustomLiveweightGain = 'J';
const columnMilkProduction = 'O';
const columnMilkSolids = 'N';
const columnCustomFatContent = 'V';
const columnCustomProteinContent = 'X';
const columnCustomDryMatterDigestibility = 'AB';
const columnOutput = 'AG';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): DairyInputTransformed | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const readDairyClass = (offset: number) => {
    const head = Number(cell(columnHead, offset));
    const customDurationDays = cell(columnCustomDurationDays, offset);
    const customLiveweight = cell(columnCustomLiveweight, offset);
    const customLiveweightGain = cell(columnCustomLiveweightGain, offset);
    const method2Liveweight =
      method === '2' && customLiveweight ? Number(customLiveweight) : undefined;
    const method2LiveweightGain =
      method === '2' && customLiveweightGain
        ? Number(customLiveweightGain)
        : undefined;
    const method2DurationDays =
      method === '2' && customDurationDays
        ? Number(customDurationDays)
        : undefined;
    return {
      head,
      method2Liveweight,
      method2LiveweightGain,
      method2DurationDays,
    };
  };

  const readMilkProduction = (): DairyMilkProductionInput => {
    const milkProduction = cell(columnMilkProduction);

    if (milkProduction) {
      return {
        litresPerHeadPerDay: Number(milkProduction),
      };
    }

    const milkSolids = cell(columnMilkSolids);
    const fatContent = cell(columnCustomFatContent);
    const proteinContent = cell(columnCustomProteinContent);

    return {
      kgSolidsPerHeadPerDay: Number(milkSolids),
      fatContent: Number(fatContent),
      proteinContent: Number(proteinContent),
    };
  };

  const dryMatterDigestibility = cell(columnCustomDryMatterDigestibility);

  const dairyInput: DairyInput = {
    herds: [
      {
        milkProduction: readMilkProduction(),
        breed: checkDairyBreed(cell(columnBreed, 0)),
        method2DryMatterDigestibility: dryMatterDigestibility
          ? Number(dryMatterDigestibility)
          : undefined,
        classes: {
          milkingCows: readDairyClass(0),
          heifersGt1: readDairyClass(1),
          heifersLt1PreWeaned: readDairyClass(2),
          heifersLt1Weaned: readDairyClass(3),
          bullsGt1: readDairyClass(4),
          bullsLt1PreWeaned: readDairyClass(5),
          bullsLt1Weaned: readDairyClass(6),
        },
      },
    ],
    // electricity: {
    //   method: 'location',
    //   electricityPurchasedKWh: 0,
    // },
  };

  // console.dir(dairyInput, { depth: null });

  return DairyInputSchema.parse(dairyInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${columnOutput}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 10 },
);

describe('3.3.1.1 Dairy enteric methane', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.3-dairy-enteric.xlsx',
      '3.3.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculate33DairyEntericMethane);
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.3-dairy-enteric.xlsx',
      '3.3.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 61, '2');

    compareInputsAndOutputs(inputsAndOutputs, calculate33DairyEntericMethane);
  });
});
