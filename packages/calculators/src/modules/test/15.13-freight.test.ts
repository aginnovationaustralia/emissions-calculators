import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { TransportFuelInput } from '../scope1/8-fuel-use';
import { calculateFreightEmissions } from '../scope3/15.13-freight';
import {
  FreightMethod1Input,
  FreightMethod2Input,
} from '../scope3/15.13-freight/freight.input';
import {
  FreightsInputSchema,
  FreightsInputTransformed,
} from '../scope3/15.13-freight/freights.input';
import { checkFreightType } from './freight-domain';
import { checkVehicleType } from './fuel-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInputMethod1 = (
  sheet: XLSX.Sheet,
  row: number,
): FreightsInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const weight = nv(Number(cell('B')));
  const distance = nv(Number(cell('C')));
  const freightType = checkFreightType(cell('A'));

  const freightMethod1: FreightMethod1Input = {
    freightType,
    distance,
    weight,
    calculationMethod: '1',
  };

  return FreightsInputSchema.parse({
    freight: [freightMethod1],
  });
};

const extractInputsAndOutputsMethod1 = createSheetExtractor(
  getCalculatorInputMethod1,
  'E',
);

const getCalculatorInputMethod2 = (
  sheet: XLSX.Sheet,
  row: number,
): FreightsInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }
  const freightType = checkFreightType(cell('A'));

  const vehicleType = checkVehicleType(cell('B'));
  const fuelType = cell('C');
  const amount = nv(Number(cell('D')));
  const units = cell('F');
  const amountObject =
    units === 'GJ/kL'
      ? { amountKilolitres: amount }
      : { amountCubicMetres: amount };

  const fuel = {
    vehicleType,
    fuelType,
    ...amountObject,
  } as unknown as TransportFuelInput;

  const freightMethod2: FreightMethod2Input = {
    freightType,
    fuel,
    calculationMethod: '2',
  };

  return FreightsInputSchema.parse({
    freight: [freightMethod2],
  });
};

const extractInputsAndOutputsMethod2 = createSheetExtractor(
  getCalculatorInputMethod2,
  'H',
);

describe('15.13.1 Freight', () => {
  it('Method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.13-freight.xlsx',
      '15.13.1 (method 1)',
    );

    const inputsAndOutputs = extractInputsAndOutputsMethod1(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateFreightEmissions,
      '15.13',
    );
  });

  it('Method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.13-freight.xlsx',
      '15.13.1 (method 2)',
    );

    const inputsAndOutputs = extractInputsAndOutputsMethod2(sheet, 11, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateFreightEmissions,
      '15.13',
    );
  });
});
