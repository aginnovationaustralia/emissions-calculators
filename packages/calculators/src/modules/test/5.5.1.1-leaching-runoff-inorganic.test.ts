import {
  HasIsInLeachingZoneInput,
  HasIsInLeachingZoneInputSchemaForFertiliser,
  HasIsInLeachingZoneInputTransformed,
} from '@/calculators/types/has-is-in-leaching.input';
import { InorganicFertiliserType } from '@/constants';
import { getSheet } from '@/test/common/sheets';
import { nv, nvo } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import {
  calculateLeachingAndRunoffN2O,
  FertiliserInput,
  FertiliserInputInorganicScope1Method1,
  FertiliserInputInorganicScope1Method2,
  HasFertiliserInput,
  HasFertiliserInputSchema,
  HasFertiliserInputTransformed,
} from '../scope1/5-fertiliser';
import {
  checkBasicCropProductionSystem,
  checkInorganicFertiliserType,
  checkProductionSystemsInorganicFertilisers,
} from './fertiliser-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const columnProductionSystem = 'A';
const columnFertiliserType = 'B';
const columnMassAppliedTMjf = 'E';
const columnCustomNitrogen = 'G';
const columnIsInLeachingZone = 'I';
const columnResult = 'P';

const getFertilisersInput = (
  method: '1' | '2',
  fertiliserType: InorganicFertiliserType,
  massAppliedKg: number,
  customNitrogenFraction: number | undefined,
  cell: (column: string) => string | undefined,
): FertiliserInput => {
  if (method === '1') {
    const result: FertiliserInputInorganicScope1Method1 = {
      productionSystem: checkBasicCropProductionSystem(
        cell(columnProductionSystem),
      ),
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
    productionSystem: checkProductionSystemsInorganicFertilisers(
      cell(columnProductionSystem),
    ),
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
):
  | (HasFertiliserInputTransformed & HasIsInLeachingZoneInputTransformed)
  | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const fertiliserType = checkInorganicFertiliserType(
    cell(columnFertiliserType),
  );
  const massAppliedKg = Number(cell(columnMassAppliedTMjf));
  const customNitrogenFraction = cell(columnCustomNitrogen)
    ? Number(cell(columnCustomNitrogen))
    : undefined;

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

  const hasIsInLeachingZoneInput: HasIsInLeachingZoneInput = {
    isInLeachingZone: cell(columnIsInLeachingZone) === 'true',
  };

  return {
    ...HasFertiliserInputSchema.parse(fertiliserInput),
    ...HasIsInLeachingZoneInputSchemaForFertiliser.parse(
      hasIsInLeachingZoneInput,
    ),
  };
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${columnResult}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('5.5.1.1 Fertiliser leaching and runoff N2O (inorganic)', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/5.5-leaching-runoff.xlsx',
      '5.5.1.1 (inorganic)',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 4, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateLeachingAndRunoffN2O,
      '5.5',
    );
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/5.5-leaching-runoff.xlsx',
      '5.5.1.1 (inorganic)',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 10, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateLeachingAndRunoffN2O,
      '5.5',
    );
  });
});
