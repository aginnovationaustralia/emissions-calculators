import {
  HasStateInput,
  hasStateInputSchema,
  HasStateInputTransformed,
} from '@/calculators/types/has-state.input';
import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import { PURCH_FUEL_15_10 } from '@/tools/modules';
import XLSX from 'xlsx-populate';
import {
  HasFuelInput,
  hasFuelInputSchema,
  HasFuelInputTransformed,
} from '../scope1/8-fuel-use';
import { StationaryFuelInput } from '../scope1/8-fuel-use/stationaryFuel.input';
import { calculateScope3EmissionsFromFuelStationary } from '../scope3/15.10-fuel';
import { checkState } from './livestock-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
): (HasFuelInputTransformed & HasStateInputTransformed) | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const fuelClass = cell('A');
  const fuelType = cell('B');
  const amount = nv(Number(cell('C')));
  const state = checkState(cell('D'));
  const units = cell('F');
  const amountObject =
    units === 'GJ/kL' ? { amountKilolitres: amount } : { amountTonnes: amount };

  const stationaryFuelRecord: StationaryFuelInput = {
    fuelClass,
    fuelType,
    ...amountObject,
  } as unknown as StationaryFuelInput;

  const fuelInput: HasFuelInput = {
    fuel: {
      stationary: [stationaryFuelRecord],
      transport: [],
    },
  };

  const hasStateInput: HasStateInput = {
    state,
  };

  return {
    ...hasStateInputSchema([PURCH_FUEL_15_10]).parse(hasStateInput),
    ...hasFuelInputSchema('fuel').parse(fuelInput),
  };
};

const extractInputsAndOutput = createSheetExtractor(getCalculatorInput, 'P');

describe('15.10.1.1 Stationary fuel scope 3', () => {
  it('method 1 matches spreadsheet results for stationary fuels', async () => {
    const sheet = await getSheet(
      './src/modules/test/8.2-stationary-fuel.xlsx',
      '8.2.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 5, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateScope3EmissionsFromFuelStationary,
      '15.10',
    );
  });
});
