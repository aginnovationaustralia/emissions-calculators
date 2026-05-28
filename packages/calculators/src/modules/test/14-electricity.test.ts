import {
  GrainsInput,
  GrainsInputSchema,
  GrainsInputTransformed,
} from '@/calculators/Grains/types/input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculateElectricityScope2 } from '../scope2/14-electricity';
import { checkState } from './crop-residue-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
): GrainsInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const electricityPurchasedKWh = Number(cell('A'));
  const state = checkState(cell('B'));
  const recsSurrenderedKWh = cell('C');
  const recsOnsiteKWh = Number(cell('D'));

  const grainsInput: GrainsInput = {
    crops: [],
    isInLeachingZone: false,
    rainfallAbove600: false,
    electricity:
      recsSurrenderedKWh === undefined
        ? {
            method: 'location',
            electricityPurchasedKWh,
          }
        : {
            method: 'market',
            electricityPurchasedKWh,
            recsSurrenderedKWh: Number(recsSurrenderedKWh),
            recsOnsiteKWh,
          },
    state,
  };

  return GrainsInputSchema.parse(grainsInput);
};

const extractInputsAndOutputLocationBased = createSheetExtractor(
  getCalculatorInput,
  'K',
);
const extractInputsAndOutputMarketBased = createSheetExtractor(
  getCalculatorInput,
  'L',
);

describe('14.1.1.1 Electricity scope 2', () => {
  it('method 1 matches spreadsheet results location-based', async () => {
    const sheet = await getSheet(
      './src/modules/test/14-electricity.xlsx',
      '14.1.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutputLocationBased(sheet, 5, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateElectricityScope2);
  });

  it('method 1 matches spreadsheet results market-based', async () => {
    const sheet = await getSheet(
      './src/modules/test/14-electricity.xlsx',
      '14.1.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutputMarketBased(sheet, 15, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateElectricityScope2);
  });
});
