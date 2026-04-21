import { RiceCropTransformed } from '@/calculators/Rice/types';
import XLSX from 'xlsx-populate';
import {
  checkOrganicAmendmentType,
  checkPreSeasonWaterRegimeType,
  checkWaterRegimeType,
} from './rice-cultivation-domain';
import { RiceCrop, RiceCropSchema } from '@/calculators/Rice/types/crop.input';
import { RiceCultivationOrganicAmendmentInput } from '../scope1/7-rice-cultivation/organic-amendment.input';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';
import { getSheet } from '@/test/common/sheets';
import { calculateScope1RiceCultivation } from '../scope1/7-rice-cultivation';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
): RiceCropTransformed | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('B') === undefined) {
    return undefined;
  }

  const waterRegimeType = checkWaterRegimeType(cell('B'));
  const preSeasonWaterRegimeType = checkPreSeasonWaterRegimeType(cell('C'));
  const areaSown = Number(cell('E'));
  const cultivationPeriodDays = Number(cell('F'));

  let amendmentOffset = 0;
  const organicAmendments: RiceCultivationOrganicAmendmentInput[] = [];
  while (amendmentOffset < 5) {
    if (cell('D', amendmentOffset) === undefined) break;

    organicAmendments.push({
      type: checkOrganicAmendmentType(cell('D', amendmentOffset)),
      rateOfApplication: Number(cell('G', amendmentOffset)),
    });

    amendmentOffset++;
  }

  const riceCrop: RiceCrop = {
    preSeasonWaterRegimeType,
    waterRegimeType,
    areaSown,
    cultivationPeriodDays,
    organicAmendments,
    /**
     * These inputs make no difference for this function.
     */
    state: 'nsw',
    isInLeachingZone: false,
    electricityAllocation: 0,
  };

  return RiceCropSchema.parse(riceCrop);
};

const extractInputsAndOutput = createSheetExtractor(getCalculatorInput, 'O', {
  rowInterval: 5,
});

describe('7.1.1 Rice cultivation', () => {
  it('matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/7-rice-cultivation.xlsx',
      '7.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateScope1RiceCultivation);
  });
});
