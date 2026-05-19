import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculateScope1RefrigerantUse } from '../scope1/9-refrigerant-use';
import { RefrigerantInput } from '../scope1/9-refrigerant-use/refrigerant.input';
import {
  RefrigerantInputsSchema,
  RefrigerantInputsTransformed,
} from '../scope1/9-refrigerant-use/refrigerants.input';
import {
  checkRefrigerantType,
  checkRefrigerationType,
} from './refrigeration-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
): RefrigerantInputsTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const refrigerant = checkRefrigerantType(cell('A'));
  const refrigerationType = checkRefrigerationType(cell('B'));
  const chargeSize = Number(cell('D'));

  const refrigerantInput: RefrigerantInput = {
    refrigerant,
    refrigerationType,
    chargeSize,
  };

  return RefrigerantInputsSchema.parse({ refrigerants: [refrigerantInput] });
};

const extractInputsAndOutputs = createSheetExtractor(getCalculatorInput, 'G');

describe('9.1.1 Refrigerant use', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/9-refrigerant-use.xlsx',
      '9.1',
    );

    const inputsAndOutputs = extractInputsAndOutputs(sheet, 11, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateScope1RefrigerantUse);
  });
});
