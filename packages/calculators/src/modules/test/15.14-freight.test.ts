import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';
import {
  FreightsInputSchema,
  FreightsInputTransformed,
} from '../scope3/15.14-freight/freights.input';
import { checkFreightType } from './freight-domain';
import { calculateFreightEmissions } from '../scope3/15.14-freight';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
): FreightsInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const weight = Number(cell('B'));
  const distance = Number(cell('C'));
  const freightType = checkFreightType(cell('A'));

  return FreightsInputSchema.parse({
    freight: [{ weight, distance, freightType }],
  });
};

const extractInputsAndOutputs = createSheetExtractor(getCalculatorInput, 'E');

describe('15.14.1 Freight', () => {
  it('Method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.14-freight.xlsx',
      '15.14.1',
    );

    const inputsAndOutputs = extractInputsAndOutputs(sheet, 11, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateFreightEmissions);
  });
});
