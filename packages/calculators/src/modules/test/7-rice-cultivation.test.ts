import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { calculateScope1RiceCultivation } from '../scope1/7-rice-cultivation';
import { RiceCultivationOrganicAmendmentInput } from '../scope1/7-rice-cultivation/organic-amendment.input';
import {
  HasRiceCultivationInput,
  HasRiceCultivationInputSchema,
  HasRiceCultivationInputTransformed,
} from '../scope1/7-rice-cultivation/rice-cultivation.input';
import {
  checkOrganicAmendmentType,
  checkPreSeasonWaterRegimeType,
  checkWaterRegimeType,
} from './rice-cultivation-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
): HasRiceCultivationInputTransformed | undefined => {
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
  const areaSown = nv(Number(cell('E')));
  const cultivationPeriodDays = nv(Number(cell('F')));

  let amendmentOffset = 0;
  const organicAmendments: RiceCultivationOrganicAmendmentInput[] = [];
  while (amendmentOffset < 5) {
    if (cell('D', amendmentOffset) === undefined) break;

    organicAmendments.push({
      type: checkOrganicAmendmentType(cell('D', amendmentOffset)),
      rateOfApplication: nv(Number(cell('G', amendmentOffset))),
    });

    amendmentOffset++;
  }

  const riceCropInput: HasRiceCultivationInput = {
    crop: {
      areaSown,
      totalYieldKg: nv(0),
      fractionOfAnnualCropBurnt: nv(0.5),
      residues: {
        calculationMethod: '1',
      },

      cultivationPeriodDays,
      organicAmendments,
      preSeasonWaterRegimeType,
      waterRegimeType,
    },
  };

  return HasRiceCultivationInputSchema.parse(riceCropInput);
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

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateScope1RiceCultivation,
      '7.1',
    );
  });
});
