import {
  HasStateInput,
  hasStateInputSchema,
  HasStateInputTransformed,
} from '@/calculators/types/has-state.input';
import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import { SERVICES_15_7 } from '@/tools/modules';
import XLSX from 'xlsx-populate';
import {
  HasFuelInput,
  hasFuelInputSchema,
  HasFuelInputTransformed,
} from '../scope1/8-fuel-use';
import { StationaryFuelInput } from '../scope1/8-fuel-use/stationaryFuel.input';
import { TransportFuelInput } from '../scope1/8-fuel-use/transportFuel.input';
import { calculateScope3Services } from '../scope3/15.7-services';
import { checkVehicleType } from './fuel-domain';
import { checkState } from './livestock-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInputTransport = (
  sheet: XLSX.Sheet,
  row: number,
): (HasFuelInputTransformed & HasStateInputTransformed) | undefined => {
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

  const fuelInput: HasFuelInput = {
    fuel: {
      stationary: [],
      transport: [transportFuelRecord],
    },
  };

  // Transport fuel factors don't depend on state, so a fixed state is enough
  // to satisfy the shared fuel + state activity shape used by 15.7.
  const hasStateInput: HasStateInput = {
    state: 'NSW',
  };

  return {
    ...hasStateInputSchema([SERVICES_15_7]).parse(hasStateInput),
    ...hasFuelInputSchema('services').parse(fuelInput),
  };
};

// 15.7 combines the scope 1 (Eg combined, column N) and scope 3 upstream
// (Ewwttrans, column O) emissions for each transport fuel record.
const getExpectedTransportOutput = (sheet: XLSX.Sheet, row: number) =>
  Number(sheet.cell(`N${row}`).value()) + Number(sheet.cell(`O${row}`).value());

const extractTransportInputsAndOutputs = createSheetExtractor(
  getCalculatorInputTransport,
  getExpectedTransportOutput,
);

const getCalculatorInputStationary = (
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
    ...hasStateInputSchema([SERVICES_15_7]).parse(hasStateInput),
    ...hasFuelInputSchema('services').parse(fuelInput),
  };
};

// 15.7 combines the scope 1 (Eg combined, column O) and scope 3 upstream
// (Ewwtscq, column P) emissions for each stationary fuel record.
const getExpectedStationaryOutput = (sheet: XLSX.Sheet, row: number) =>
  Number(sheet.cell(`O${row}`).value()) + Number(sheet.cell(`P${row}`).value());

const extractStationaryInputsAndOutputs = createSheetExtractor(
  getCalculatorInputStationary,
  getExpectedStationaryOutput,
);
/**
 * NOTE: These tests are reusing the test cases for scope 1 fuel (ch 8) and scope 3 fuel (15.10)
 */
describe('15.7.1.1 Services - transport fuel', () => {
  it('method 1 matches spreadsheet results for transport fuel', async () => {
    const sheet = await getSheet(
      './src/modules/test/8.1-transport-fuel.xlsx',
      '8.1.1.1',
    );

    const inputsAndOutputs = extractTransportInputsAndOutputs(sheet, 5, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateScope3Services, '15.7');
  });
});

describe('15.7.1.1 Services - stationary fuel', () => {
  it('method 1 matches spreadsheet results for stationary fuel', async () => {
    const sheet = await getSheet(
      './src/modules/test/8.2-stationary-fuel.xlsx',
      '8.2.1.1',
    );

    const inputsAndOutputs = extractStationaryInputsAndOutputs(sheet, 5, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateScope3Services, '15.7');
  });
});
