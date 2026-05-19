import {
  OtherLivestockInput,
  OtherLivestockInputSchema,
  OtherLivestockInputTransformed,
} from '@/calculators/OtherLivestock/types/input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculate_4_7_1_1_OtherLivestockManureMethane } from '../../scope1/4-manure-management/4.7-other-livestock-manure';
import {
  checkMeanAnnualTemperature,
  checkOtherLivestockClass,
  checkPureState,
} from '../livestock-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import {
  getOtherLivestockInput,
  otherLivestockManureSheetColumns,
} from './4.7-other-livestock-manure-helpers';

const {
  columnLivestockType,
  columnLivestockClass,
  columnHead,
  columnMeanAnnualTemperature,
  columnState,
  columnExcludedFromWater,
  columnOutputMethane: columnOutput,
} = otherLivestockManureSheetColumns;

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
  const excludedFromNaturalWater = cell(columnExcludedFromWater) === 'yes';
  const state = checkPureState(cell(columnState));

  const otherLivestockClassInput = getOtherLivestockInput(type, cls, head);

  const input: OtherLivestockInput = {
    herds: [{ classes: [otherLivestockClassInput], excludedFromNaturalWater }],
    state,
    method2MeanAnnualTemperature:
      method === '1'
        ? undefined
        : checkMeanAnnualTemperature(method2MeanAnnualTemperature),
    climateZone: 'Boreal dry',
    productionSystem: 'Non-irrigated pasture',
    isInLeachingZone: false,
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

describe('4.7.1.1 Other livestock manure methane', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.7-other-livestock-manure/4.7-other-livestock-manure.xlsx',
      '4.7.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_4_7_1_1_OtherLivestockManureMethane,
    );
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.7-other-livestock-manure/4.7-other-livestock-manure.xlsx',
      '4.7.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 41, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_4_7_1_1_OtherLivestockManureMethane,
    );
  });
});
