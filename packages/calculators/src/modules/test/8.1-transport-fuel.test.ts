import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import {
  FuelInput,
  fuelInputSchema,
  FuelInputTransformed,
} from '../scope1/8-fuel-use';
import {
  transportEmissionsForCH4,
  transportEmissionsForCO2,
  transportEmissionsForCombined,
  transportEmissionsForN2O,
} from '../scope1/8-fuel-use/8.1-transport-fuel';
import { TransportFuelInput } from '../scope1/8-fuel-use/transportFuel.input';
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
  const amount = nv(Number(cell('C')));
  const units = cell('E');
  const amountObject =
    units === 'GJ/kL'
      ? { amountKilolitres: amount }
      : { amountCubicMetres: amount };

  const transportFuelRecord: TransportFuelInput = {
    vehicleType,
    fuelType,
    ...amountObject,
  } as unknown as TransportFuelInput;

  const fuelInput: FuelInput = {
    stationary: [],
    transport: [transportFuelRecord],
  };

  return fuelInputSchema('fuel').parse(fuelInput);
};

const extractInputsAndOutputCO2 = createSheetExtractor(getCalculatorInput, 'K');
const extractInputsAndOutputCH4 = createSheetExtractor(getCalculatorInput, 'L');
const extractInputsAndOutputN2O = createSheetExtractor(getCalculatorInput, 'M');
const extractInputsAndOutputCombined = createSheetExtractor(
  getCalculatorInput,
  'N',
);

describe('8.1 Transport fuel', () => {
  it('method 1 matches spreadsheet results for transport CO2', async () => {
    const sheet = await getSheet(
      './src/modules/test/8.1-transport-fuel.xlsx',
      '8.1.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutputCO2(sheet, 5, '1');

    compareInputsAndOutputs(inputsAndOutputs, transportEmissionsForCO2, '8.1');
  });
  // NOTE: The value from the spreadsheet is being extracted as a real mass of CH4, not CO2e
  it('method 1 matches spreadsheet results for transport CH4', async () => {
    const sheet = await getSheet(
      './src/modules/test/8.1-transport-fuel.xlsx',
      '8.1.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutputCH4(sheet, 5, '1');

    compareInputsAndOutputs(inputsAndOutputs, transportEmissionsForCH4, '8.1');
  });
  // NOTE: The value from the spreadsheet is being extracted as a real mass of N2O, not CO2e
  it('method 1 matches spreadsheet results for transport N2O', async () => {
    const sheet = await getSheet(
      './src/modules/test/8.1-transport-fuel.xlsx',
      '8.1.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutputN2O(sheet, 5, '1');

    compareInputsAndOutputs(inputsAndOutputs, transportEmissionsForN2O, '8.1');
  });
  it('method 1 matches spreadsheet results for transport Combined', async () => {
    const sheet = await getSheet(
      './src/modules/test/8.1-transport-fuel.xlsx',
      '8.1.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutputCombined(sheet, 5, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      transportEmissionsForCombined,
      '8.1',
    );
  });
});
