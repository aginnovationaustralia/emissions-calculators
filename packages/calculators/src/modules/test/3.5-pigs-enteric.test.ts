import { PigsClassLivestockInput } from '@/calculators/Pigs/types/pigs-class.input';
import {
  PigsHerdInput,
  PigsHerdInputSchema,
  PigsHerdInputTransformed,
} from '@/calculators/Pigs/types/pigs-herd.input';
import { getSheet } from '@/test/common/sheets';
import { zeroPigsManureAllocation } from '@/test/inputs/zero-input';
import { nv, nvo } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { calculate35PigsEntericMethane } from '../scope1/3-enteric-methane/3.5-pigs-enteric';
import { createPigsInput } from './factory';
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
): PigsHerdInputTransformed | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const readPigsClass = (
    offset: number,
  ): PigsClassLivestockInput | undefined => {
    if (cell(columnHead, offset) === undefined) {
      return undefined;
    }

    const customFeedIntake = cell(columnCustomFeedIntake, offset);
    const method2AverageFeedIntake =
      method === '2' && customFeedIntake ? Number(customFeedIntake) : undefined;

    return {
      head: nv(Number(cell(columnHead, offset))),
      days: nv(Number(cell(columnAverageDuration, offset))),
      method2AverageFeedIntake: nvo(method2AverageFeedIntake),
      // No effect on enteric fermentation calculation.
      manureAllocations: zeroPigsManureAllocation}
  };

  const pigsInput: PigsHerdInput = createPigsInput({
    classes: {
      boars: readPigsClass(0),
      sows: readPigsClass(1),
      gilts: readPigsClass(2),
      slaughterPigs: readPigsClass(3),
    },
  });

  return PigsHerdInputSchema.parse(pigsInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${columnOutput}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 5 },
);

describe('3.5.1.1 Pigs enteric methane', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.5-pigs-enteric.xlsx',
      '3.5.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1', {
      expectedTests: 2,
    });

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate35PigsEntericMethane,
      '3.5',
    );
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.5-pigs-enteric.xlsx',
      '3.5.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 31, '2', {
      expectedTests: 1,
    });

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate35PigsEntericMethane,
      '3.5',
    );
  });
});
