import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  FuelInput,
  FuelInputSchema,
  FuelInputTransformed,
} from '../scope1/8-fuel-use';
import { TransportFuelInput } from '../scope1/8-fuel-use/transportFuel.input';
import { calculateScope3EmissionsFromFuelTransport } from '../scope3/15.10-fuel/calculate';
import { checkVehicleType } from './fuel-domain';
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

  const vehicleType = checkVehicleType(cell('A'));
  const fuelType = cell('B');
  const amount = Number(cell('C'));
  const units = cell('E');
  const amountObject =
    units === 'GJ/kL'
      ? { amountLitres: amount }
      : { amountCubicMetres: amount };

  const transportFuelRecord: TransportFuelInput = {
    vehicleType,
    fuelType,
    ...amountObject,
  } as unknown as TransportFuelInput;

  const fuelInput: FuelInput = {
    naturalGas: 0,
    stationaryFuel: [],
    transportFuel: [transportFuelRecord],
  };

  return FuelInputSchema.parse(fuelInput);
};

const extractInputsAndOutput = createSheetExtractor(getCalculatorInput, 'M');

describe('15.1.1.1 Transport fuel scope 3', () => {
  it('method 1 matches spreadsheet results for transport fuel', async () => {
    const sheet = await getSheet(
      './src/modules/test/8.1-transport-fuel.xlsx',
      '8.1.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 5, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateScope3EmissionsFromFuelTransport,
    );
  });
});
