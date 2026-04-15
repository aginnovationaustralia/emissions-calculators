import { FeedlotGroupInput } from '@/calculators/Feedlot/types/feedlot-group.input';
import {
  FeedlotInput,
  FeedlotInputSchema,
  FeedlotInputTransformed,
} from '@/calculators/Feedlot/types/input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculate31BeefFeedlotEntericMethane } from '../scope1/3-enteric-methane/3.1-beef-feedlot';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const columnHead = 'C';
const columnAverageLengthOfStayDays = 'D';
const columnMethod2AverageDryMatterIntake = 'F';
const columnMethod2AverageNeutralDetergentFibrePercentage = 'G';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): FeedlotInputTransformed | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const readFeedlotGroup = (offset: number) => {
    const head = Number(cell(columnHead, offset));
    const averageLengthOfStayDays = Number(
      cell(columnAverageLengthOfStayDays, offset),
    );
    const method2AverageDryMatterIntake =
      method === '1'
        ? undefined
        : Number(cell(columnMethod2AverageDryMatterIntake, offset));
    const method2AverageNeutralDetergentFibrePercentage =
      method === '1'
        ? undefined
        : Number(
            cell(columnMethod2AverageNeutralDetergentFibrePercentage, offset),
          );

    const feedlotGroupInput: FeedlotGroupInput = {
      head,
      averageLengthOfStayDays,
      method2AverageDryMatterIntake,
      method2AverageNeutralDetergentFibrePercentage,
    };

    return feedlotGroupInput;
  };

  const feedlotInput: FeedlotInput = {
    groups: [readFeedlotGroup(0), readFeedlotGroup(1), readFeedlotGroup(2)],
    electricity: {
      method: 'location',
      electricityPurchasedKWh: 0,
    },
  };

  return FeedlotInputSchema.parse(feedlotInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`N${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 5 },
);

describe('3.1.1 Beef feedlot enteric methane', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.1-beef-feedlot-enteric.xlsx',
      '3.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate31BeefFeedlotEntericMethane,
    );
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.1-beef-feedlot-enteric.xlsx',
      '3.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 31, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate31BeefFeedlotEntericMethane,
    );
  });
});
