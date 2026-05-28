import {
  calculate_16_1_1_4_BiomassBurningCH4,
  calculate_16_1_1_4_BiomassBurningN2O,
} from '@/modules/lulucf/16.1-land-use-change-forestry';
import {
  LULUCFParentInput,
  LULUCFParentInputSchema,
  LULUCFParentInputTransformed,
} from '@/modules/lulucf/input';
import { LandUseChangeActivityInput } from '@/modules/lulucf/land-use-change-activity-input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';

const columnMassCH4PerHectare = 'B';
const columnMassN2OPerHectare = 'C';
const columnAreaBurnt = 'D';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
): LULUCFParentInputTransformed | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const massCH4PerHectare = Number(cell(columnMassCH4PerHectare));
  const massN2OPerHectare = Number(cell(columnMassN2OPerHectare));
  const areaBurnt = Number(cell(columnAreaBurnt));

  const activity: LandUseChangeActivityInput = {
    type: 'landClearingForestToGrassland',
    carbonMassInTreesCurrentYear: 0,
    carbonMassInTreesPreviousYear: 0,
    carbonMassInDebrisCurrentYear: 0,
    carbonMassInDebrisPreviousYear: 0,
    massCH4FromBiomassBurningPerHectare: massCH4PerHectare,
    massN2OFromBiomassBurningPerHectare: massN2OPerHectare,
    areaBurnt,
    region: 'Arnhem Coast',
    activityAreaHectares: 100,
  };

  const lulucfInput: LULUCFParentInput = {
    isInLeachingZone: false,
    rainfallAbove600: false,
    landUse: {
      activities: [activity],
    },
  };

  return LULUCFParentInputSchema.parse(lulucfInput);
};

const getExpectedOutputCH4 = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`E${row}`).value());
};

const getExpectedOutputN2O = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`F${row}`).value());
};

const extractInputsAndOutputCH4 = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutputCH4,
);

const extractInputsAndOutputN2O = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutputN2O,
);

describe('16.1.1.4 Biomass Burning', () => {
  it('method 2 scenarios match spreadsheet results for CH4', async () => {
    const sheet = await getSheet(
      './src/modules/test/16-lulucf/16.1-lulucf.xlsx',
      '16.1.1.4',
    );

    const inputsAndOutputs = extractInputsAndOutputCH4(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_16_1_1_4_BiomassBurningCH4,
    );
  });

  it('method 2 scenarios match spreadsheet results for N2O', async () => {
    const sheet = await getSheet(
      './src/modules/test/16-lulucf/16.1-lulucf.xlsx',
      '16.1.1.4',
    );

    const inputsAndOutputs = extractInputsAndOutputN2O(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_16_1_1_4_BiomassBurningN2O,
    );
  });
});
