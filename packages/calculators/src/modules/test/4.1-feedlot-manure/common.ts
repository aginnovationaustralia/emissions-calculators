import { FeedlotGroupLivestockInput } from '@/calculators/Feedlot/types/feedlot-group.input';
import {
  FeedlotLotInput,
  FeedlotLotInputSchema,
  FeedlotLotInputTransformed,
} from '@/calculators/Feedlot/types/feedlot-lot.input';
import { nv, nvo } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { createFeedlotInput } from '../factory';
import {
  checkGrazingProductionSystemsWithRainfall,
  checkMeanAnnualTemperature,
  checkState,
} from '../livestock-domain';

export const readFeedlotGroup = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): FeedlotGroupLivestockInput => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  const group: FeedlotGroupLivestockInput = {
    head: nv(Number(cell('D'))),
    averageLengthOfStayDays: nv(Number(cell('E'))),
    manureAllocations: {
      solidStorage: nv(Number(cell('F'))),
      composting: nv(Number(cell('G'))),
      directApplication: nv(Number(cell('H'))),
    },
  };

  if (method === '2') {
    group.method2DryMatterIntake = nvo(Number(cell('J')));
    group.method2NitrogenRetentionRate = nvo(Number(cell('K')));
    group.method2DryMatterDigestibility = nvo(Number(cell('L')));
    group.method2CrudeProtein = nvo(Number(cell('M')));
  }
  return group;
};

export const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): FeedlotLotInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) return undefined;

  const state = checkState(cell('A'));

  const grazingSystem = checkGrazingProductionSystemsWithRainfall(cell('C'));

  const input: FeedlotLotInput = createFeedlotInput({
    state,
    grazingSystem,
    groups: [readFeedlotGroup(sheet, row, method)],
  });

  if (method === '2') {
    input.method2MeanAnnualTemperature = checkMeanAnnualTemperature(cell('B'));
  }

  return FeedlotLotInputSchema.parse(input);
};
