import {
  BaseGrainsCrop,
  BaseGrainsCropSchema,
  BaseGrainsCropTransformed,
} from '@/calculators/Grains/types/base-crop.input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  FuelInput,
  FuelInputSchema,
  FuelInputTransformed,
} from '../scope1/8-fuel-use';
import { StationaryFuelInput } from '../scope1/8-fuel-use/stationaryFuel.input';
import { calculateScope3EmissionsFromFuelStationary } from '../scope3/15.10-fuel';
import { checkState } from './crop-residue-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
): (FuelInputTransformed & BaseGrainsCropTransformed) | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const fuelClass = cell('A');
  const fuelType = cell('B');
  const amount = Number(cell('C'));
  const state = checkState(cell('D'));
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

  const baseGrainsCrop: BaseGrainsCrop = {
    state,
    areaSown: 0,
    isInLeachingZone: false,
    electricityAllocation: 0,
  };

  return {
    ...FuelInputSchema.parse(fuelInput),
    ...BaseGrainsCropSchema.parse(baseGrainsCrop),
  };
};

const extractInputsAndOutput = createSheetExtractor(getCalculatorInput, 'N');

describe('15.11.1.1 Stationary fuel scope 3', () => {
  it('method 1 matches spreadsheet results for stationary fuels', async () => {
    const sheet = await getSheet(
      './src/modules/test/8.2-stationary-fuel.xlsx',
      '8.2.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 5, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateScope3EmissionsFromFuelStationary,
    );
  });
});
