import {
  isPerennialWoodyCropFull,
  PerennialWoodyCropFull,
  PerennialWoodyCropPartial,
} from '@/constants/enums';
import { calculate_16_5_1_1_RemovalsFromPerennialCrops } from '@/modules/lulucf/16.5-perennial-crops';
import {
  LULUCFInput,
  LULUCFInputSchema,
  LULUCFInputTransformed,
} from '@/modules/lulucf/input';
import { PerennialCropPlantingInput } from '@/modules/lulucf/perennial-crop-planting-input';
import { PerennialCropInput } from '@/modules/lulucf/perennial-crops-input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import { checkPerennialWoodyCropType } from './lulucf-domain';

const columnCropType = 'A';
const columnAreaPlanted = 'B';
const columnYearsSincePlanting = 'C';
const columnActualStemDensity = 'I';
const columnCustomBAMc = 'L';

const createPerennialCropInput = (
  cropType: PerennialWoodyCropFull | PerennialWoodyCropPartial,
  plantings: PerennialCropPlantingInput[],
  method2ActualStemDensity?: number,
  method2BiomassAtMaturity?: number,
): PerennialCropInput => {
  if (isPerennialWoodyCropFull(cropType)) {
    if (method2ActualStemDensity !== undefined) {
      return {
        cropType,
        plantings,
        clearings: [],
        calculationMethod: '2 (stem density)',
        method2ActualStemDensity,
      };
    }

    if (method2BiomassAtMaturity !== undefined) {
      return {
        cropType,
        plantings,
        clearings: [],
        calculationMethod: '2 (BAM)',
        method2BiomassAtMaturity,
      };
    }

    return {
      cropType,
      plantings,
      clearings: [],
      calculationMethod: '1',
    };
  }

  return {
    cropType,
    plantings,
    clearings: [],
    calculationMethod: '1',
  };
};

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): LULUCFInputTransformed | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const readFullCropPlanting = (offset: number): PerennialCropPlantingInput => {
    const areaPlanted = Number(cell(columnAreaPlanted, offset));
    const yearsSincePlanting = Number(cell(columnYearsSincePlanting, offset));

    return {
      areaPlanted,
      yearsSincePlanting,
    };
  };

  const actualStemDensity = cell(columnActualStemDensity);
  const biomassAtMaturity = cell(columnCustomBAMc);

  const method2ActualStemDensity =
    method === '1' || actualStemDensity === undefined
      ? undefined
      : Number(actualStemDensity);
  const method2BiomassAtMaturity =
    method === '1' || biomassAtMaturity === undefined
      ? undefined
      : Number(biomassAtMaturity);

  const cropType = checkPerennialWoodyCropType(cell(columnCropType));

  const cropPlanting1 = readFullCropPlanting(0);
  const cropPlanting2 = readFullCropPlanting(1);
  const cropPlanting3 = readFullCropPlanting(2);

  const crop1: PerennialCropInput = createPerennialCropInput(
    cropType,
    [cropPlanting1, cropPlanting2, cropPlanting3],
    method2ActualStemDensity,
    method2BiomassAtMaturity,
  );

  const lulucfInput: LULUCFInput = {
    isInLeachingZone: false,
    perennialCrops: [crop1],
  };

  // console.dir(lulucfInput, { depth: null });

  return LULUCFInputSchema.parse(lulucfInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`P${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 5 },
);

describe('16.5.1.1 Removals from Perennial Crops', () => {
  it('method 1 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/16-lulucf/16.5-lulucf.xlsx',
      '16.5.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_16_5_1_1_RemovalsFromPerennialCrops,
    );
  });

  it('method 2 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/16-lulucf/16.5-lulucf.xlsx',
      '16.5.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 71, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_16_5_1_1_RemovalsFromPerennialCrops,
    );
  });
});
