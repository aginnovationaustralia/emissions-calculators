import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import {
  calculateFieldBurningCH4,
  calculateFieldBurningN2O,
  HasCropResidueInput,
  HasCropResidueInputSchema,
  HasCropResidueInputTransformed,
} from '../scope1/6-residue-mgmt';
import { checkCropType, cropTypeAndBurntFraction } from './crop-residue-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
): HasCropResidueInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const type = checkCropType(cell('A'));
  const fractionOfAnnualCropBurnt = Number(cell('B'));
  const totalYieldKg = nv(Number(cell('C')));

  const cropResidueInput: HasCropResidueInput = {
    crop: {
      ...cropTypeAndBurntFraction(type, fractionOfAnnualCropBurnt),
      totalYieldKg,
      residues: {
        calculationMethod: '1',
      },
    },
  };

  return HasCropResidueInputSchema.parse(cropResidueInput);
};

const getExpectedOutputCH4 = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`N${row}`).value());
};
const getExpectedOutputN2O = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`O${row}`).value());
};

const extractInputsAndOutputCH4 = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutputCH4,
);
const extractInputsAndOutputN2O = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutputN2O,
);
describe('6.4.1.1 Field burning of crop residues', () => {
  it('method 1 matches spreadsheet results for ch4', async () => {
    const sheet = await getSheet(
      './src/modules/test/6.4-crop-burning.xlsx',
      '6.4.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutputCH4(sheet, 5, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateFieldBurningCH4, '6.4');
  });

  it('method 1 matches spreadsheet results for n2o', async () => {
    const sheet = await getSheet(
      './src/modules/test/6.4-crop-burning.xlsx',
      '6.4.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutputN2O(sheet, 5, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateFieldBurningN2O, '6.4');
  });
});
