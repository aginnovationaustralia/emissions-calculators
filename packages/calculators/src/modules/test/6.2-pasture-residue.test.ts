import {
  BaseGrainsCrop,
  BaseGrainsCropSchema,
  BaseGrainsCropTransformed,
} from '@/calculators/Grains/types/base-crop.input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  CropResidueInput,
  CropResidueInputSchema,
  CropResidueInputTransformed,
} from '../scope1/6-residue-mgmt';
import { calculate62PastureResidueN2O } from '../scope1/6-residue-mgmt/6.2-residues-pasture';
import { checkPastureType } from './crop-residue-domain';
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
  const type = checkPastureType(cell('B'));
  const areaSown = Number(cell('C'));
  const averageYield = Number(cell('D'));

  const baseCrop: BaseGrainsCrop = {
    state: 'wa_nw',
    areaSown,
    isInLeachingZone: true,
    electricityAllocation: 0,
  };

  const cropResidues =
    calculationMethod === '2'
      ? {
          calculationMethod,
          fractionCropResidueRemoved: 0,
        }
      : {
          calculationMethod,
        };
  const pastureResidues =
    calculationMethod === '2'
      ? {
          calculationMethod,
          averageYieldPerHectare: averageYield,
        }
      : {
          calculationMethod,
        };

  const cropResidueInput: CropResidueInput = {
    rainfallAbove600: climate === 'wet',
    type,
    averageYield,
    fractionOfAnnualCropBurnt: 0,
    cropResidues,
    pastureResidues,
  };

  return {
    ...BaseGrainsCropSchema.parse(baseCrop),
    ...CropResidueInputSchema.parse(cropResidueInput),
  };
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`L${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('6.2.1.1 Pasture residue N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/6.2-pasture-residues.xlsx',
      '6.2.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 5, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculate62PastureResidueN2O);
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/6.2-pasture-residues.xlsx',
      '6.2.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 17, '2');

    compareInputsAndOutputs(inputsAndOutputs, calculate62PastureResidueN2O);
  });
});
