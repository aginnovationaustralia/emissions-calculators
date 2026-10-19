import { OtherLivestockClassInput } from '@/calculators/OtherLivestock/types/class.input';
import {
  OtherLivestockHerdInput,
  OtherLivestockHerdInputSchema,
  OtherLivestockHerdInputTransformed,
} from '@/calculators/OtherLivestock/types/herd.input';
import { OtherLivestockType } from '@/constants/enums';
import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { calculate36OtherLivestockEntericMethaneForHerd } from '../scope1/3-enteric-methane/3.6-other-livestock';
import { createOtherLivestockInput } from './factory';
import { checkOtherLivestockClass } from './livestock-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const columnLivestockType = 'A';
const columnHead = 'C';
const columnResult = 'E';

const getOtherLivestockInput = (
  type: OtherLivestockType,
  head: number,
): OtherLivestockClassInput => {
  return {
    type,
    head: nv(head),
  };
};

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
): OtherLivestockHerdInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const head = Number(cell(columnHead));
  const type = checkOtherLivestockClass(cell(columnLivestockType));

  const otherLivestockClassInput = getOtherLivestockInput(type, head);

  const input: OtherLivestockHerdInput = createOtherLivestockInput({
    livestock: [otherLivestockClassInput],
    excludedFromNaturalWater: false,
  });

  return OtherLivestockHerdInputSchema.parse(input);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${columnResult}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('3.6.1.1 Other livestock enteric methane', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.6-other-livestock-enteric.xlsx',
      '3.6.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate36OtherLivestockEntericMethaneForHerd,
      '3.6',
    );
  });
});
