import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';
import {
  WastewaterTreatmentInputSchema,
  WastewaterTreatmentInputTransformed,
} from '../scope1/11-wastewater/wastewater-treatment.input';
import { checkWastewaterTreatmentFacilityType } from './wastewater-domain';
import {
  calculateScope1WastewaterCH4,
  calculateScope1WastewaterN2O,
} from '../scope1/11-wastewater/calculate';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
): WastewaterTreatmentInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  return WastewaterTreatmentInputSchema.parse({
    facilityType: checkWastewaterTreatmentFacilityType(cell('A')),
    wastewaterVolume: Number(cell('B')),
    inletCOD: Number(cell('C')),
    fractionSludge: Number(cell('D')),
    outletCOD: Number(cell('E')),
    fractionRemoved: Number(cell('H')),
    methaneCaptured: Number(cell('K')),
    methaneFlared: Number(cell('L')),
    methaneOut: Number(cell('M')),
  });
};

const extractInputsAndOutputsCH4 = createSheetExtractor(
  getCalculatorInput,
  'P',
);

const extractInputsAndOutputsN2O = createSheetExtractor(
  getCalculatorInput,
  'R',
);

/**
 * REVISIT:
 * At the moment these tests only pass after 'correcting' the units of a number
 * in the equation (6.874e-4 t/m^3 => 6.874e-1 kg/m^3).
 */
describe('11.1.1 Wastewater CH4', () => {
  it('method 1 CH4 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/11-wastewater.xlsx',
      '11.1',
    );
    const inputsAndOutputs = extractInputsAndOutputsCH4(sheet, 11, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateScope1WastewaterCH4);
  });
  it('method 1 N2O matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/11-wastewater.xlsx',
      '11.1',
    );
    const inputsAndOutputs = extractInputsAndOutputsN2O(sheet, 11, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateScope1WastewaterN2O);
  });
});
