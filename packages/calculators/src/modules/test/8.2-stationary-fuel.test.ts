import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  FuelInput,
  FuelInputSchema,
  FuelInputTransformed,
  stationaryEmissionsForCH4,
  stationaryEmissionsForCO2,
  stationaryEmissionsForN2O,
} from '../scope1/8-fuel-use';
import { StationaryFuelInput } from '../scope1/8-fuel-use/stationaryFuel.input';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
): FuelInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const fuelClass = cell('A');
  const fuelType = cell('B');
  const amount = Number(cell('C'));
  const units = cell('F');
  const amountObject =
    units === 'GJ/kL' ? { amountLitres: amount } : { amountTonnes: amount };

  const stationaryFuelRecord: StationaryFuelInput = {
    fuelClass,
    fuelType,
    ...amountObject,
  } as unknown as StationaryFuelInput;

  const fuelInput: FuelInput = {
    naturalGas: 0,
    stationaryFuel: [stationaryFuelRecord],
    transportFuel: [],
  };

  return FuelInputSchema.parse(fuelInput);
};

const extractInputsAndOutputCO2 = createSheetExtractor(getCalculatorInput, 'K');
const extractInputsAndOutputCH4 = createSheetExtractor(getCalculatorInput, 'L');
const extractInputsAndOutputN2O = createSheetExtractor(getCalculatorInput, 'M');

describe('8.2 Stationary fuel', () => {
  it('method 1 matches spreadsheet results for stationary fuels CO2', async () => {
    const sheet = await getSheet(
      './src/modules/test/8.2-stationary-fuel.xlsx',
      '8.2.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutputCO2(sheet, 5, '1');

    compareInputsAndOutputs(inputsAndOutputs, stationaryEmissionsForCO2);
  });

  it('method 1 matches spreadsheet results for stationary fuels CH4', async () => {
    const sheet = await getSheet(
      './src/modules/test/8.2-stationary-fuel.xlsx',
      '8.2.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutputCH4(sheet, 5, '1');

    compareInputsAndOutputs(inputsAndOutputs, stationaryEmissionsForCH4);
  });

  it('method 1 matches spreadsheet results for stationary fuels N2O', async () => {
    const sheet = await getSheet(
      './src/modules/test/8.2-stationary-fuel.xlsx',
      '8.2.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutputN2O(sheet, 5, '1');

    compareInputsAndOutputs(inputsAndOutputs, stationaryEmissionsForN2O);
  });
});
