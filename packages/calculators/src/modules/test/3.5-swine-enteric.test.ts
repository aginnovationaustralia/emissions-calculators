import {
  SwineInput,
  SwineInputSchema,
  SwineInputTransformed,
} from '@/calculators/Swine/types/input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculate35SwineEntericMethane } from '../scope1/3-enteric-methane/3.5-swine-enteric';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const columnCustomFeedIntake = 'C';
const columnHead = 'F';
const columnAverageDuration = 'H';
const columnOutput = 'J';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): SwineInputTransformed | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const readSwineClass = (offset: number) => {
    if (cell(columnHead, offset) === undefined) {
      return undefined;
    }

    const customFeedIntake = cell(columnCustomFeedIntake, offset);
    const method2AverageFeedIntake =
      method === '2' && customFeedIntake ? Number(customFeedIntake) : undefined;
    return {
      head: Number(cell(columnHead, offset)),
      averageNumberOfDays: Number(cell(columnAverageDuration, offset)),
      method2AverageFeedIntake,
    };
  };

  const swineInput: SwineInput = {
    herds: [
      {
        boars: readSwineClass(0),
        sows: readSwineClass(1),
        gilts: readSwineClass(2),
        slaughterPigs: readSwineClass(3),
      },
    ],
  };

  // console.dir(swineInput, { depth: null });

  return SwineInputSchema.parse(swineInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${columnOutput}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 5 },
);

describe('3.5.1.1 Swine enteric methane', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.5-swine-enteric.xlsx',
      '3.5.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1', 2);

    compareInputsAndOutputs(inputsAndOutputs, calculate35SwineEntericMethane);
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.5-swine-enteric.xlsx',
      '3.5.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 31, '2', 1);

    compareInputsAndOutputs(inputsAndOutputs, calculate35SwineEntericMethane);
  });
});
