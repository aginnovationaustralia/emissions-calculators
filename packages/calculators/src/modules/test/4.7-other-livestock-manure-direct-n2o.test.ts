import { OtherLivestockClassInput } from '@/calculators/OtherLivestock/types/class.input';
import {
  OtherLivestockInput,
  OtherLivestockInputSchema,
  OtherLivestockInputTransformed,
} from '@/calculators/OtherLivestock/types/input';
import {
  isOtherLivestockClasslessType,
  OtherLivestockType,
} from '@/constants/enums';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculate_4_7_1_3_OtherLivestockManureDirectN2O } from '../scope1/4-manure-management/4.7-other-livestock-manure';
import {
  checkBuffaloClass,
  checkClimateZone,
  checkDeerClass,
  checkGoatClass,
  checkMeanAnnualTemperature,
  checkOtherLivestockClass,
  checkPureState,
} from './livestock-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const columnLivestockType = 'A';
const columnLivestockClass = 'B';
const columnHead = 'C';
const columnMeanAnnualTemperature = 'F';
const columnClimateZone = 'G';
const columnState = 'I';
const columnExcludedFromWater = 'L';
const columnOutput = 'AF';

const getOtherLivestockInput = (
  type: OtherLivestockType,
  cls: string | undefined,
  head: number,
): OtherLivestockClassInput => {
  if (type === 'Buffalo') {
    const buffaloClass = checkBuffaloClass(cls);
    return {
      type,
      class: buffaloClass,
      head,
    };
  }
  if (type === 'Goats') {
    const goatClass = checkGoatClass(cls);
    return {
      type,
      class: goatClass,
      head,
    };
  }
  if (type === 'Deer') {
    const deerClass = checkDeerClass(cls);
    return {
      type,
      class: deerClass,
      head,
    };
  }
  if (isOtherLivestockClasslessType(type)) {
    return {
      type,
      head,
    };
  }
  throw new Error(`Invalid other livestock type: ${type} with class: ${cls}`);
};

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): OtherLivestockInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const method2MeanAnnualTemperature = cell(columnMeanAnnualTemperature);

  const head = Number(cell(columnHead));
  const type = checkOtherLivestockClass(cell(columnLivestockType));
  const cls = cell(columnLivestockClass);
  const climateZone = checkClimateZone(cell(columnClimateZone));
  const excludedFromWater = cell(columnExcludedFromWater) === 'yes';
  const state = checkPureState(cell(columnState));

  const otherLivestockClassInput = getOtherLivestockInput(type, cls, head);

  const input: OtherLivestockInput = {
    herds: [{ classes: [otherLivestockClassInput], excludedFromWater }],
    state,
    method2MeanAnnualTemperature:
      method === '1'
        ? undefined
        : checkMeanAnnualTemperature(method2MeanAnnualTemperature),
    climateZone,
    productionSystem: 'Non-irrigated pasture',
  };

  // console.log(input);

  return OtherLivestockInputSchema.parse(input);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${columnOutput}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('4.7.1.3 Other livestock manure direct N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.7-other-livestock-manure.xlsx',
      '4.7.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_4_7_1_3_OtherLivestockManureDirectN2O,
    );
  });
});
