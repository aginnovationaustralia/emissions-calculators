import {
  BaseGrainsCropSchema,
  BaseGrainsCropTransformed,
} from '@/calculators/Grains/types/base-crop.input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculateInorganicFertiliserN2O } from '../scope1/5-fertiliser/5.1-inorganic-fertiliser';
import {
  FertiliserInputSchema,
  FertiliserInputTransformed,
} from '../scope1/5-fertiliser/fertiliser.input';
import {
  InorganicFertilisersInput,
  InorganicFertilisersScope1Method1Input,
  InorganicFertilisersScope1Method2Input,
} from '../scope1/5-fertiliser/inorganic-fertilisers.input';
import {
  checkBasicCropProductionSystem,
  checkExtendedCropProductionSystem,
  checkInorganicFertiliserType,
} from './fertiliser-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): (FertiliserInputTransformed & BaseGrainsCropTransformed) | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const areaSown = Number(cell('C'));
  const productionSystem =
    method === '1'
      ? checkBasicCropProductionSystem(cell('A'))
      : checkExtendedCropProductionSystem(cell('A'));
  const fertiliserType = checkInorganicFertiliserType(cell('B'));
  const massAppliedKg = Number(cell('D'));
  const customNitrogenFraction = cell('F') ? Number(cell('F')) : undefined;

  const inorganicFertilisers: InorganicFertilisersInput =
    method === '1'
      ? ({
          productionSystem,
          applications: [
            {
              calculationMethodScope3: '1',
              fertiliserType,
              massAppliedKg,
              components: customNitrogenFraction
                ? [
                    {
                      componentType: 'Nitrogen - Generic',
                      componentOrigin: 'Unspecified',
                      fractionOfFertiliser: customNitrogenFraction,
                    },
                  ]
                : undefined,
            },
          ],
          calculationMethodScope1: '1',
        } as InorganicFertilisersScope1Method1Input)
      : ({
          productionSystem,
          applications: [
            {
              calculationMethodScope3: '2',
              fertiliserType,
              massAppliedKg,
              ...(customNitrogenFraction ? { customNitrogenFraction } : {}),
            },
          ],
          calculationMethodScope1: '2',
        } as InorganicFertilisersScope1Method2Input);

  return {
    ...FertiliserInputSchema.parse({
      inorganicFertilisers,
      organicFertilisers: {
        applications: [],
        calculationMethod: '1',
      },
    }),
    ...BaseGrainsCropSchema.parse({
      areaSown,
      state: 'vic',
      electricityAllocation: 0,
      isInLeachingZone: false,
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

describe('5.1.1.1 Inorganic Fertiliser N2O', () => {
  it('method 1 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/tests/5.1-inorganic-fertiliser.xlsx',
      '5.1.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 4, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateInorganicFertiliserN2O);
  });

  it('method 2 scenarios match spreadsheet results for maize', async () => {
    const workbook = await getSheet(
      './src/modules/tests/5.1-inorganic-fertiliser.xlsx',
      '5.1.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(workbook, 10, '2');

    compareInputsAndOutputs(inputsAndOutputs, calculateInorganicFertiliserN2O);
  });

  it('method 2 scenarios match spreadsheet results for high rainfall zone', async () => {
    const workbook = await getSheet(
      './src/modules/tests/5.1-inorganic-fertiliser.xlsx',
      '5.1.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(workbook, 14, '2');

    compareInputsAndOutputs(inputsAndOutputs, calculateInorganicFertiliserN2O);
  });

  it('method 2 scenarios match spreadsheet results for cotton', async () => {
    const workbook = await getSheet(
      './src/modules/tests/5.1-inorganic-fertiliser.xlsx',
      '5.1.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(workbook, 20, '2');

    compareInputsAndOutputs(inputsAndOutputs, calculateInorganicFertiliserN2O);
  });
});
