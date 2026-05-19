import {
  BaseGrainsCrop,
  BaseGrainsCropSchema,
  BaseGrainsCropTransformed,
} from '@/calculators/Grains/types/base-crop.input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  calculate61CropResidueN2O,
  CropResidueInput,
  CropResidueInputSchema,
  CropResidueInputTransformed,
} from '../scope1/6-residue-mgmt';
import { checkCropType, checkState } from './crop-residue-domain';
import { checkClimate } from './fertiliser-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  calculationMethod: '1' | '2',
): (CropResidueInputTransformed & BaseGrainsCropTransformed) | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const climate = checkClimate(cell('A'));
  const type = checkCropType(cell('B'));
  const state = checkState(cell('C'));
  const areaSown = Number(cell('D'));
  const averageYield = Number(cell('E'));
  const fractionOfAnnualCropBurnt = Number(cell('F'));
  const customFractionCropResidueRemoved = Number(
    sheet.cell(`G${row}`).value(),
  );

  const baseCrop: BaseGrainsCrop = {
    state,
    areaSown,
    isInLeachingZone: true,
    electricityAllocation: 0,
  };

  const cropResidues =
    calculationMethod === '2'
      ? {
          calculationMethod,
          fractionCropResidueRemoved: customFractionCropResidueRemoved,
        }
      : {
          calculationMethod,
        };

  const cropResidueInput: CropResidueInput = {
    rainfallAbove600: climate === 'wet',
    type,
    averageYield,
    fractionOfAnnualCropBurnt,
    cropResidues,
  };

  return {
    ...BaseGrainsCropSchema.parse(baseCrop),
    ...CropResidueInputSchema.parse(cropResidueInput),
  };
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`R${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('6.1.1.1 Crop residue N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/6.1-crop-residues.xlsx',
      '6.1.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 5, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculate61CropResidueN2O);
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/6.1-crop-residues.xlsx',
      '6.1.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 17, '2');

    compareInputsAndOutputs(inputsAndOutputs, calculate61CropResidueN2O);
  });
});
