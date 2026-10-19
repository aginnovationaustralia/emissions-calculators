import {
  HasClimateZoneInput,
  HasClimateZoneInputSchemaForCrops,
  HasClimateZoneInputTransformed,
} from '@/calculators/types/has-climate-zone.input';
import {
  HasStateInput,
  hasStateInputSchema,
  HasStateInputTransformed,
} from '@/calculators/types/has-state.input';
import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import {
  calculate61CropResidueN2O,
  HasCropOrPastureResidueInputTransformed,
  HasCropResidueInput,
  HasCropResidueInputSchema,
} from '../scope1/6-residue-mgmt';
import { checkCropType } from './crop-residue-domain';
import { checkClimate } from './fertiliser-domain';
import { checkState } from './livestock-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';
import { RESIDUE_CROPS_6_1 } from '@/tools/modules';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  calculationMethod: '1' | '2',
):
  | (HasCropOrPastureResidueInputTransformed &
      HasClimateZoneInputTransformed &
      HasStateInputTransformed)
  | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const climateZone = checkClimate(cell('A'));
  const type = checkCropType(cell('B'));
  const state = checkState(cell('C'));
  const fractionOfAnnualCropBurnt = Number(cell('D'));
  const customMassCropResidueRemoved = Number(cell(`E`));
  const totalYieldKg = nv(Number(cell('G')));

  const residues =
    calculationMethod === '2'
      ? {
          calculationMethod,
          massCropResidueRemoved: nv(customMassCropResidueRemoved),
        }
      : {
          calculationMethod,
        };

  const cropResidueInput: HasCropResidueInput = {
    crop: {
      type,
      totalYieldKg,
      fractionOfAnnualCropBurnt: nv(fractionOfAnnualCropBurnt),
      residues,
    },
  };

  const hasStateInput: HasStateInput = {
    state,
  };

  const hasClimateZoneInput: HasClimateZoneInput = {
    climateZone,
  };

  return {
    ...HasClimateZoneInputSchemaForCrops.parse(hasClimateZoneInput),
    ...HasCropResidueInputSchema.parse(cropResidueInput),
    ...hasStateInputSchema([RESIDUE_CROPS_6_1]).parse(hasStateInput),
  };
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`Q${row}`).value());
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

    compareInputsAndOutputs(inputsAndOutputs, calculate61CropResidueN2O, '6.1');
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/6.1-crop-residues.xlsx',
      '6.1.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 17, '2');

    compareInputsAndOutputs(inputsAndOutputs, calculate61CropResidueN2O, '6.1');
  });
});
