import {
  BaseGrainsCrop,
  BaseGrainsCropSchema,
  BaseGrainsCropTransformed,
} from '@/calculators/Grains/types/base-crop.input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  calculate63ResidueLeachingAndRunoffN2O,
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
): (CropResidueInputTransformed & BaseGrainsCropTransformed) | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const isInLeachingZone = cell('A') === 'yes';
  const climate = checkClimate(cell('B'));
  const type = checkCropType(cell('C'));
  const state = checkState(cell('D'));
  const areaSown = Number(cell('E'));
  const averageYield = Number(cell('F'));
  const fractionOfAnnualCropBurnt = Number(cell('G'));

  const baseCrop: BaseGrainsCrop = {
    state,
    areaSown,
    isInLeachingZone,
    electricityAllocation: 0,
  };

  const cropResidues = {
    calculationMethod: '1',
  } as const;

  const pastureResidues = {
    calculationMethod: '1',
  } as const;

  const cropResidueInput: CropResidueInput = {
    rainfallAbove600: climate === 'wet',
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

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`V${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('6.3.1.1 Leaching and runoff from crop residues N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/6.3-leaching-runoff.xlsx',
      '6.3.1.1 crop',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 5, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate63ResidueLeachingAndRunoffN2O,
    );
  });
});
