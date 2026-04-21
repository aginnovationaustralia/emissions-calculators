import { calculate_16_1_1_7_HarvestedWoodProducts } from '@/modules/lulucf/16.1-land-use-change-forestry';
import {
  LULUCFInput,
  LULUCFInputSchema,
  LULUCFInputTransformed,
} from '@/modules/lulucf/input';
import { LandUseChangeActivityInput } from '@/modules/lulucf/land-use-change-activity-input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';

const columnCarbonMass = 'A';
const columnActivityArea = 'B';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
): LULUCFInputTransformed | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const carbonMassOfWoodProductsHarvestedPerHectare = Number(
    cell(columnCarbonMass),
  );
  const activityArea = Number(cell(columnActivityArea));

  const activity: LandUseChangeActivityInput = {
    type: 'plantationForestry',
    carbonMassInTreesCurrentYear: 0,
    carbonMassInTreesPreviousYear: 0,
    carbonMassInDebrisCurrentYear: 0,
    carbonMassInDebrisPreviousYear: 0,
    ghgMassFromBiomassBurningPerHectare: 0,
    areaBurnt: 0,
    carbonMassOfWoodProductsHarvestedPerHectare,
    activityArea,
  };

  const lulucfInput: LULUCFInput = {
    isInLeachingZone: false,
    rainfallAbove600: false,
    activities: [activity],
  };

  return LULUCFInputSchema.parse(lulucfInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`D${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('16.1.1.7 Harvested Wood Products', () => {
  it('method 1 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/16-lulucf/16.1-lulucf.xlsx',
      '16.1.1.7',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_16_1_1_7_HarvestedWoodProducts,
    );
  });
});
