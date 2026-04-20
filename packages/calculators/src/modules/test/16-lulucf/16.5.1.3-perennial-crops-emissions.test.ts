import {
  isPerennialWoodyCropFull,
  PerennialWoodyCropFull,
  PerennialWoodyCropPartial,
} from '@/constants/enums';
import { calculate_16_5_1_3_EmissionsFromPerennialCrops } from '@/modules/lulucf/16.5-perennial-crops';
import {
  LULUCFInput,
  LULUCFInputSchema,
  LULUCFInputTransformed,
} from '@/modules/lulucf/input';
import {
  PerennialCropClearingMethod1Input,
  PerennialCropClearingMethod2Input,
} from '@/modules/lulucf/perennial-crop-clearing-input';
import { PerennialCropInput } from '@/modules/lulucf/perennial-crops-input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import { checkPerennialWoodyCropType } from './lulucf-domain';

const columnCropType = 'A';
const columnAgeAtClearing = 'C';
const columnAreaCleared = 'F';
const columnActualStemDensity = 'I';
const columnCustomBAMc = 'L';

const createPerennialCropInputMethod1 = (
  cropType: PerennialWoodyCropFull | PerennialWoodyCropPartial,
  clearings: PerennialCropClearingMethod1Input[],
  method2BiomassAtMaturity?: number,
): PerennialCropInput => {
  if (isPerennialWoodyCropFull(cropType)) {
    if (method2BiomassAtMaturity !== undefined) {
      return {
        cropType,
        plantings: [],
        clearings,
        calculationMethod: '2 (BAM)',
        method2BiomassAtMaturity,
      };
    }

    return {
      cropType,
      plantings: [],
      clearings,
      calculationMethod: '1',
    };
  }

  return {
    cropType,
    plantings: [],
    clearings,
    calculationMethod: '1',
  };
};

const createPerennialCropInputMethod2 = (
  cropType: PerennialWoodyCropFull,
  clearings: PerennialCropClearingMethod2Input[],
  method2ActualStemDensity: number,
): PerennialCropInput => {
  return {
    cropType,
    plantings: [],
    clearings,
    calculationMethod: '2 (stem density)',
    method2ActualStemDensity,
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

  const readCropClearing = (
    offset: number,
  ): PerennialCropClearingMethod1Input => {
    const areaCleared = Number(cell(columnAreaCleared, offset));

    return {
      areaCleared,
    };
  };

  const readCropClearingWithAge = (
    offset: number,
  ): PerennialCropClearingMethod2Input => {
    const areaCleared = Number(cell(columnAreaCleared, offset));
    const method2AgeAtClearing = Number(cell(columnAgeAtClearing, offset));

    return {
      areaCleared,
      method2AgeAtClearing,
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

  const cropClearing1 = readCropClearing(0);

  const crop1: PerennialCropInput =
    method2ActualStemDensity && isPerennialWoodyCropFull(cropType)
      ? createPerennialCropInputMethod2(
          cropType,
          [readCropClearingWithAge(0)],
          method2ActualStemDensity,
        )
      : createPerennialCropInputMethod1(
          cropType,
          [cropClearing1],
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
  return Number(sheet.cell(`Q${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 5 },
);

describe('16.5.1.3 Emissions from Perennial Crops', () => {
  it('method 1 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/16-lulucf/16.5-lulucf.xlsx',
      '16.5.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_16_5_1_3_EmissionsFromPerennialCrops,
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
      calculate_16_5_1_3_EmissionsFromPerennialCrops,
    );
  });
});
