import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import {
  calculateScope1WastewaterCH4,
  calculateScope1WastewaterN2O,
} from '../scope1/11-wastewater/calculate';
import {
  WastewaterTreatmentInputSchema,
  WastewaterTreatmentInputTransformed,
  WastewaterTreatmentMethod1Input,
  WastewaterTreatmentMethod2Input,
} from '../scope1/11-wastewater/wastewater-treatment.input';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';
import {
  checkWastewaterCommodityType,
  checkWastewaterTreatmentFacilityType,
} from './wastewater-domain';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): WastewaterTreatmentInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const facilityType = checkWastewaterTreatmentFacilityType(cell('A'));
  const wastewaterVolume = nv(Number(cell('C')));

  if (method === '1') {
    const input: WastewaterTreatmentMethod1Input = {
      facilityType,
      wastewaterVolume,
      fractionRemoved: nv(Number(cell('I'))),
      commodityType: checkWastewaterCommodityType(cell('B')),
    };

    return WastewaterTreatmentInputSchema.parse(input);
  }

  const input: WastewaterTreatmentMethod2Input = {
    facilityType,
    wastewaterVolume,
    inletCOD: nv(Number(cell('D'))),
    fractionSludge: nv(Number(cell('E'))),
    outletCOD: nv(Number(cell('F'))),
    fractionRemoved: nv(Number(cell('I'))),
    methaneCaptured: nv(Number(cell('M'))),
    methaneFlared: nv(Number(cell('N'))),
    methaneOut: nv(Number(cell('O'))),
  };

  return WastewaterTreatmentInputSchema.parse(input);
};

const createExtractorCreator = (col: string) =>
  createSheetExtractor(getCalculatorInput, col);

describe('11.1.1 Wastewater CH4', () => {
  it('method 1 CH4 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/11-wastewater.xlsx',
      '11.1.1',
    );
    const inputsAndOutputs = createExtractorCreator('P')(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateScope1WastewaterCH4,
      '11.1',
    );
  });
  it('method 1 N2O matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/11-wastewater.xlsx',
      '11.1.1',
    );
    const inputsAndOutputs = createExtractorCreator('R')(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateScope1WastewaterN2O,
      '11.1',
    );
  });

  it('method 2 CH4 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/11-wastewater.xlsx',
      '11.1.2',
    );
    const inputsAndOutputs = createExtractorCreator('S')(sheet, 11, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateScope1WastewaterCH4,
      '11.1',
    );
  });
  it('method 2 N2O matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/11-wastewater.xlsx',
      '11.1.2',
    );
    const inputsAndOutputs = createExtractorCreator('U')(sheet, 11, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateScope1WastewaterN2O,
      '11.1',
    );
  });
});
