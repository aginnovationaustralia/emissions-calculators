import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import {
  calculateInorganicFertiliserAtmosphericDepositionN2O,
  FertiliserInput,
  FertiliserInputSchema,
  FertiliserInputTransformed,
} from '../scope1/5-fertiliser';
import { InorganicFertiliserInputScope3Method1 } from '../scope1/5-fertiliser/inorganic-fertiliser.input';
import {
  checkBasicCropProductionSystem,
  checkInorganicFertiliserType,
} from './fertiliser-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
): FertiliserInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const fertiliserType = checkInorganicFertiliserType(cell('A'));
  const productionSystem = checkBasicCropProductionSystem(cell('B'));
  const massAppliedKg = Number(cell('C'));

  const application: InorganicFertiliserInputScope3Method1 = {
    massAppliedKg: nv(massAppliedKg),
    fertiliserType,
    calculationMethodScope3: '1',
  };

  const fertiliserInput: FertiliserInput = {
    inorganic: {
      applications: [application],
      calculationMethodScope1: '1',
    },
    productionSystem,
    organic: { applications: [] },
  };

  return FertiliserInputSchema.parse(fertiliserInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`I${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('5.4.1.1 Inorganic fertiliser atmospheric deposition N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/5.4-atmospheric-deposition.xlsx',
      '5.4.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateInorganicFertiliserAtmosphericDepositionN2O,
      '5.4',
    );
  });
});
