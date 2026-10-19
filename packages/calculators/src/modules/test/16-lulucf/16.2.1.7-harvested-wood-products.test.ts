import { calculate_16_2_1_7_HarvestedWoodProducts } from '@/modules/lulucf/16.2-land-use-change-forestry';
import {
  LULUCFParentInput,
  LULUCFParentInputSchema,
  LULUCFParentInputTransformed,
} from '@/modules/lulucf/input';
import {
  CarbonMassOfWoodProductsFromFullCAMInput,
  CarbonMassOfWoodProductsFromRecordsInput,
  PlantationForestryInput,
} from '@/modules/lulucf/land-use-change-activity-input';
import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { CellFn } from '../3.2-beef-enteric/common';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';

const columnCarbonMassFromFullCAM = 'A';
const columnCarbonMassFromRecords = 'B';
const columnActivityArea = 'C';

const getCarbonMassOfWoodProducts = (
  cell: CellFn,
  method: '1' | '2',
):
  | CarbonMassOfWoodProductsFromFullCAMInput
  | CarbonMassOfWoodProductsFromRecordsInput => {
  if (method === '1') {
    return {
      calculationMethod: '1',
      carbonMassPerHectareFromFullCAM: nv(
        Number(cell(columnCarbonMassFromFullCAM)),
      ),
    };
  } else {
    return {
      calculationMethod: '2',
      carbonMassPerHectareFromRecords: nv(
        Number(cell(columnCarbonMassFromRecords)),
      ),
    };
  }
};

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): LULUCFParentInputTransformed | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('E') === undefined) {
    return undefined;
  }

  const activityAreaHectares = Number(cell(columnActivityArea));

  const activity: PlantationForestryInput = {
    type: 'plantationForestry',
    carbonMassOfWoodProducts: getCarbonMassOfWoodProducts(cell, method),
    activityAreaHectares: nv(activityAreaHectares),
    carbonMassInTreesCurrentYear: nv(0),
    carbonMassInTreesPreviousYear: nv(0),
    carbonMassInDebrisCurrentYear: nv(0),
    carbonMassInDebrisPreviousYear: nv(0),
  };

  const lulucfInput: LULUCFParentInput = {
    landUse: {
      activities: [activity],
    },
  };

  return LULUCFParentInputSchema.parse(lulucfInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`E${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('16.2.1.7 Harvested Wood Products', () => {
  it('method 1 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/16-lulucf/16.2-lulucf.xlsx',
      '16.2.1.7',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_16_2_1_7_HarvestedWoodProducts,
      '16.2',
    );
  });

  it('method 2 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/16-lulucf/16.2-lulucf.xlsx',
      '16.2.1.7',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 21, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_16_2_1_7_HarvestedWoodProducts,
      '16.2',
    );
  });
});
