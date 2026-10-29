import { InorganicFertiliserType } from '@/constants/enums';
import { getSheet } from '@/test/common/sheets';
import { nv, nvo } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { calculateInorganicFertiliserN2O } from '../../scope1/5-fertiliser/5.1-inorganic-fertiliser';
import {
  FertiliserInput,
  FertiliserInputInorganicScope1Method1,
  FertiliserInputInorganicScope1Method2,
  HasFertiliserInput,
  HasFertiliserInputSchema,
  HasFertiliserInputTransformed,
} from '../../scope1/5-fertiliser/fertiliser.input';
import {
  checkBasicCropProductionSystem,
  checkInorganicFertiliserType,
  checkProductionSystemsInorganicFertilisers,
} from '../fertiliser-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';

const getFertilisersInput = (
  method: '1' | '2',
  fertiliserType: InorganicFertiliserType,
  massAppliedKg: number,
  customNitrogenFraction: number | undefined,
  cell: (column: string) => string | undefined,
): FertiliserInput => {
  if (method === '1') {
    const result: FertiliserInputInorganicScope1Method1 = {
      productionSystem: checkBasicCropProductionSystem(cell('A')),
      inorganic: {
        applications: [
          {
            calculationMethodScope3: '1',
            fertiliserType,
            massAppliedKg: nv(massAppliedKg),

            components: customNitrogenFraction
              ? [
                  {
                    componentType: 'Nitrogen - Generic',
                    fractionOfFertiliser: nv(customNitrogenFraction),
                  },
                ]
              : undefined,
          },
        ],
        calculationMethodScope1: '1',
      },
      organic: {
        applications: [],
      },
    };

    return result;
  }

  const areaAppliedHectares = Number(cell('C'));

  const result: FertiliserInputInorganicScope1Method2 = {
    productionSystem: checkProductionSystemsInorganicFertilisers(cell('A')),
    inorganic: {
      applications: [
        {
          calculationMethodScope3: '2',
          fertiliserType,
          massAppliedKg: nv(massAppliedKg),
          ...(customNitrogenFraction
            ? {
                customNitrogenFraction: nvo(customNitrogenFraction),
              }
            : {}),
          customScope3EmissionFactor: nv(0),
        },
      ],
      areaAppliedHectares: nv(areaAppliedHectares),
      calculationMethodScope1: '2',
    },
    organic: {
      applications: [],
    },
  };

  return result;
};

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): HasFertiliserInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const fertiliserType = checkInorganicFertiliserType(cell('B'));
  const massAppliedKg = Number(cell('E'));
  const customNitrogenFraction = cell('G') ? Number(cell('G')) : undefined;

  const fertiliser = getFertilisersInput(
    method,
    fertiliserType,
    massAppliedKg,
    customNitrogenFraction,
    cell,
  );

  const fertiliserInput: HasFertiliserInput = {
    fertiliser,
  };

  return HasFertiliserInputSchema.parse(fertiliserInput);
};

const extractInputsAndOutput = createSheetExtractor(getCalculatorInput, 'M');

describe('5.1.1.1 Inorganic Fertiliser N2O', () => {
  it('method 1 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/5.1-inorganic-fertiliser.xlsx',
      '5.1.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 4, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateInorganicFertiliserN2O,
      '5.1',
    );
  });

  it('method 2 scenarios match spreadsheet results', async () => {
    const workbook = await getSheet(
      './src/modules/test/5.1-inorganic-fertiliser.xlsx',
      '5.1.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(workbook, 10, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateInorganicFertiliserN2O,
      '5.1',
    );
  });
});
