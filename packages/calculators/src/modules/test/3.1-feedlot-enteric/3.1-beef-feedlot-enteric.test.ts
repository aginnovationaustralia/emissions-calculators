import { FeedlotGroupLivestockInput } from '@/calculators/Feedlot/types/feedlot-group.input';
import { getSheet } from '@/test/common/sheets';
import { nv, nvo } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { calculate31BeefFeedlotEntericMethane } from '../../scope1/3-enteric-methane/3.1-beef-feedlot';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import {
  FeedlotLotInput,
  FeedlotLotInputSchema,
  FeedlotLotInputTransformed,
} from '@/calculators/Feedlot/types/feedlot-lot.input';
import { createFeedlotInput } from '../factory';

const columnHead = 'C';
const columnAverageLengthOfStayDays = 'D';
const columnMethod2AverageDryMatterIntake = 'F';
const columnMethod2AverageNeutralDetergentFibrePercentage = 'G';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): FeedlotLotInputTransformed | undefined => {
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
    const method2DryMatterIntake =
      method === '1'
        ? undefined
        : Number(cell(columnMethod2AverageDryMatterIntake, offset));
    const method2AverageNeutralDetergentFibrePercentage =
      method === '1'
        ? undefined
        : Number(
            cell(columnMethod2AverageNeutralDetergentFibrePercentage, offset),
          );

    const feedlotGroupInput: FeedlotGroupLivestockInput = {
      head: nv(head),
      averageLengthOfStayDays: nv(averageLengthOfStayDays),
      method2DryMatterIntake: nvo(method2DryMatterIntake),
      method2AverageNeutralDetergentFibrePercentage: nvo(
        method2AverageNeutralDetergentFibrePercentage,
      ),
      manureAllocations: {
        directApplication: nv(1),
        solidStorage: nv(0),
        composting: nv(0),
      },
    };

    return feedlotGroupInput;
  };

  const feedlotInput: FeedlotLotInput = createFeedlotInput({
    groups: [readFeedlotGroup(0), readFeedlotGroup(1), readFeedlotGroup(2)],
    grazingSystem: 'Irrigated crop',
    state: 'WA',
  });

  return FeedlotLotInputSchema.parse(feedlotInput);
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
      './src/modules/test/3.1-feedlot-enteric/3.1-beef-feedlot-enteric.xlsx',
      '3.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate31BeefFeedlotEntericMethane,
      '3.1',
    );
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.1-feedlot-enteric/3.1-beef-feedlot-enteric.xlsx',
      '3.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 31, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate31BeefFeedlotEntericMethane,
      '3.1',
    );
  });
});
