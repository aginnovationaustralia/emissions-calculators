import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculateInorganicFertiliserCO2 } from '../scope1/5-fertiliser/5.1-inorganic-fertiliser';
import {
  FertiliserInputSchema,
  FertiliserInputTransformed,
} from '../scope1/5-fertiliser/fertiliser.input';
import { InorganicFertilisersScope1Method1Input } from '../scope1/5-fertiliser/inorganic-fertilisers.input';
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

  const productionSystem = checkBasicCropProductionSystem(cell('A'));
  const fertiliserType = checkInorganicFertiliserType(cell('B'));
  const massAppliedKg = Number(cell('D'));

  const inorganicFertilisers: InorganicFertilisersScope1Method1Input = {
    productionSystem,
    applications: [
      {
        calculationMethodScope3: '1',
        fertiliserType,
        massAppliedKg,
        components: undefined,
      },
    ],
    calculationMethodScope1: '1',
  };

  return {
    ...FertiliserInputSchema.parse({
      inorganicFertilisers,
      organicFertilisers: {
        applications: [],
      },
    }),
  };
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`L${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('5.1.1.3 Inorganic Fertiliser CO2', () => {
  it('method 1 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/5.1-inorganic-fertiliser.xlsx',
      '5.1.1.3',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 7, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateInorganicFertiliserCO2);
  });
});
