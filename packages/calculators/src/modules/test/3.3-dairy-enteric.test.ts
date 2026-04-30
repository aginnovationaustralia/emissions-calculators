import {
  DairyInput,
  DairyInputSchema,
  DairyInputTransformed,
} from '@/calculators/Dairy/types/input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculate33DairyEntericMethane } from '../scope1/3-enteric-methane/3.3-dairy-enteric';
import { checkDairyBreed } from './dairy-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const columnBreed = 'C';
const columnHead = 'E';
const columnMilkProduction = 'L';
const columnOutput = 'AA';

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
    return {
      head,
    };
  };

  const dairyInput: DairyInput = {
    herds: [
      {
        milkProduction: {
          litresPerHeadPerDay: Number(cell(columnMilkProduction, 0)),
        },
        breed: checkDairyBreed(cell(columnBreed, 0)),
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
});
