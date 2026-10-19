import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import {
  ElectricityInputs,
  ElectricityInputsSchema,
  ElectricityInputsTransformed,
} from '../scope2/14-electricity/electricity.input';
import { calculateElectricityScope3 } from '../scope3/15.11-electricity';
import { checkRegion } from './crop-residue-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
): ElectricityInputsTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const electricityPurchasedKWh = Number(cell('A'));
  const region = checkRegion(cell('B'));
  const recsSurrendered = cell('C');
  const recsOnsite = Number(cell('D'));

  const electricityInput: ElectricityInputs =
    recsSurrendered === undefined
      ? {
          method: 'location',
          electricityPurchasedKWh: nv(electricityPurchasedKWh),
          region,
        }
      : {
          method: 'market',
          electricityPurchasedKWh: nv(electricityPurchasedKWh),
          recsSurrendered: nv(Number(recsSurrendered)),
          recsOnsite: nv(recsOnsite),
          region,
        };

  return ElectricityInputsSchema.parse(electricityInput);
};

const extractInputsAndOutputLocationBased = createSheetExtractor(
  getCalculatorInput,
  'M',
);
const extractInputsAndOutputMarketBased = createSheetExtractor(
  getCalculatorInput,
  'N',
);

describe('15.11 Electricity scope 2', () => {
  it('method 1 matches spreadsheet results location-based', async () => {
    const sheet = await getSheet(
      './src/modules/test/14-electricity.xlsx',
      '14.1.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutputLocationBased(sheet, 5, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateElectricityScope3,
      '15.11',
    );
  });

  it('method 1 matches spreadsheet results market-based', async () => {
    const sheet = await getSheet(
      './src/modules/test/14-electricity.xlsx',
      '14.1.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutputMarketBased(sheet, 15, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateElectricityScope3,
      '15.11',
    );
  });
});
