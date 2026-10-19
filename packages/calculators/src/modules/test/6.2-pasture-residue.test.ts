import {
  HasClimateZoneInput,
  HasClimateZoneInputSchemaForCrops,
  HasClimateZoneInputTransformed,
} from '@/calculators/types/has-climate-zone.input';
import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import {
  HasCropOrPastureResidueInputTransformed,
  HasPastureResidueInput,
  HasPastureResidueInputSchema,
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
):
  | (HasCropOrPastureResidueInputTransformed & HasClimateZoneInputTransformed)
  | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const climateZone = checkClimate(cell('A'));
  const type = checkPastureType(cell('B'));
  const averageYield = Number(cell('D'));
  const areaManaged = Number(cell('C'));

  const pastureResidueInput: HasPastureResidueInput = {
    pasture: {
      type,
      areaManaged: nv(areaManaged),
      fractionOfAnnualCropBurnt: nv(0),
      residues:
        calculationMethod === '2'
          ? {
              calculationMethod,
              averageYieldPerHectare: nv(averageYield),
            }
          : {
              calculationMethod,
            },
    },
  };

  const hasClimateZoneInput: HasClimateZoneInput = {
    climateZone,
  };

  return {
    ...HasClimateZoneInputSchemaForCrops.parse(hasClimateZoneInput),
    ...HasPastureResidueInputSchema.parse(pastureResidueInput),
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

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate62PastureResidueN2O,
      '6.2',
    );
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/6.2-pasture-residues.xlsx',
      '6.2.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 17, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate62PastureResidueN2O,
      '6.2',
    );
  });
});
