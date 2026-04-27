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
import { calculate36OtherLivestockEntericMethane } from '../scope1/3-enteric-methane/3.6-other-livestock';
import {
  checkBuffaloClass,
  checkDeerClass,
  checkGoatClass,
  checkOtherLivestockClass,
} from './livestock-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const columnLivestockType = 'A';
const columnLivestockClass = 'B';
const columnHead = 'C';
const columnResult = 'E';

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
): OtherLivestockInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const head = Number(cell(columnHead));
  const type = checkOtherLivestockClass(cell(columnLivestockType));
  const cls = cell(columnLivestockClass);

  const otherLivestockClassInput = getOtherLivestockInput(type, cls, head);

  const input: OtherLivestockInput = {
    herds: [{ classes: [otherLivestockClassInput], excludedFromWater: false }],
    state: 'NSW',
    climateZone: 'Boreal dry',
    productionSystem: 'Non-irrigated pasture',
    isInLeachingZone: false,
  };

  // console.log(input);

  return OtherLivestockInputSchema.parse(input);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${columnResult}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('3.6.1.1 Other livestock enteric methane', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.6-other-livestock-enteric.xlsx',
      '3.6.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate36OtherLivestockEntericMethane,
    );
  });
});
