import {
  BaseGrainsCrop,
  BaseGrainsCropSchema,
  BaseGrainsCropTransformed,
} from '@/calculators/Grains/types/base-crop.input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  calculateFieldBurningCH4,
  calculateFieldBurningN2O,
  CropResidueInput,
  CropResidueInputSchema,
  CropResidueInputTransformed,
} from '../scope1/6-residue-mgmt';
import { checkCropType } from './crop-residue-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
): (CropResidueInputTransformed & BaseGrainsCropTransformed) | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const type = checkCropType(cell('A'));
  const areaSown = Number(cell('B'));
  const averageYield = Number(cell('C'));
  const fractionOfAnnualCropBurnt = Number(cell('D'));

  const baseCrop: BaseGrainsCrop = {
    state: 'wa_nw',
    areaSown,
    isInLeachingZone: false,
    electricityAllocation: 0,
  };

  const cropResidues = {
    calculationMethod: '1',
  } as const;

  const pastureResidues = {
    calculationMethod: '1',
  } as const;

  const cropResidueInput: CropResidueInput = {
    rainfallAbove600: false,
    type,
    averageYield,
    fractionOfAnnualCropBurnt,
    cropResidues,
    pastureResidues,
  };

  return {
    ...BaseGrainsCropSchema.parse(baseCrop),
    ...CropResidueInputSchema.parse(cropResidueInput),
  };
};

const getExpectedOutputCH4 = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`P${row}`).value());
};
const getExpectedOutputN2O = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`Q${row}`).value());
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

    compareInputsAndOutputs(inputsAndOutputs, calculateFieldBurningCH4);
  });

  it('method 1 matches spreadsheet results for n2o', async () => {
    const sheet = await getSheet(
      './src/modules/test/6.4-crop-burning.xlsx',
      '6.4.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutputN2O(sheet, 5, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateFieldBurningN2O);
  });
});
