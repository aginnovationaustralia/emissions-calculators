import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { calculate53Lime } from '../scope1/5-fertiliser';
import {
  HasLimeInput,
  HasLimeInputSchema,
  HasLimeInputTransformed,
} from '../scope1/5-fertiliser/lime.input';
import { checkSoilAmeliorant } from './fertiliser-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
): HasLimeInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const massAppliedKg = nv(Number(cell('A')));
  const limestoneFraction = Number(cell('B'));
  const type = checkSoilAmeliorant(cell('C'));

  const application =
    type === 'Gypsum'
      ? {
          massAppliedKg,
          type,
        }
      : {
          massAppliedKg,
          limestoneFraction: nv(limestoneFraction),
          type,
        };

  const limeInput: HasLimeInput = {
    lime: {
      applications: [application],
    },
  };

  return HasLimeInputSchema.parse(limeInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`I${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('5.3.1.1 Lime N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet('./src/modules/test/5.3-lime.xlsx', '5.3.1.1');

    const inputsAndOutputs = extractInputsAndOutput(sheet, 4, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculate53Lime, '5.3');
  });
});
