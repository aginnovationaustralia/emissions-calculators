import {
  HasIsInLeachingZoneInput,
  HasIsInLeachingZoneInputSchemaForFertiliser,
  HasIsInLeachingZoneInputTransformed,
} from '@/calculators/types/has-is-in-leaching.input';
import { InorganicFertiliserType } from '@/constants';
import {
  BasicCropProductionSystem,
  BasicCropProductionSystems,
  ProductionSystemsInorganicFertiliser,
  ProductionSystemsInorganicFertilisers,
} from '@/constants/enums';
import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
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
import { InorganicFertiliserInputScope3Method1 } from '../scope1/5-fertiliser/inorganic-fertiliser.input';
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
const columnAreaApplied = 'C';
const columnMassAppliedTMjf = 'E';
const columnCustomNitrogen = 'G';
const columnIsInLeachingZone = 'I';
const columnResult = 'P';

const isBasicCropProductionSystem = (
  system: string | undefined,
): system is BasicCropProductionSystem =>
  BasicCropProductionSystems.includes(system as BasicCropProductionSystem);

const isProductionSystemInorganicFertiliser = (
  system: string | undefined,
): system is ProductionSystemsInorganicFertiliser =>
  ProductionSystemsInorganicFertilisers.includes(
    system as ProductionSystemsInorganicFertiliser,
  );

/**
 * 5.5 has no method 2 of its own, but the production system in the sheet determines
 * which scope 1 inorganic fertiliser input shape is valid. Some systems (e.g. 'Cotton')
 * are valid for both shapes, so an application area is used to pick the method 2 shape.
 * Either way, the application itself only uses method 1 inputs, with any custom nitrogen
 * fraction supplied as a component.
 */
const getFertilisersInput = (
  fertiliserType: InorganicFertiliserType,
  massAppliedKg: number,
  customNitrogenFraction: number | undefined,
  cell: (column: string) => string | undefined,
): FertiliserInput => {
  const productionSystem = cell(columnProductionSystem);
  const areaAppliedHectares = cell(columnAreaApplied);

  const application: InorganicFertiliserInputScope3Method1 = {
    calculationMethodScope3: '1',
    fertiliserType,
    massAppliedKilograms: nv(massAppliedKg),
    massPurchasedKilograms: nv(massAppliedKg),
    components: customNitrogenFraction
      ? [
          {
            componentType: 'Nitrogen - Generic',
            fractionOfFertiliser: nv(customNitrogenFraction),
          },
        ]
      : undefined,
  };

  const useScope1Method2 =
    isProductionSystemInorganicFertiliser(productionSystem) &&
    (areaAppliedHectares !== undefined ||
      !isBasicCropProductionSystem(productionSystem));

  if (useScope1Method2) {
    const result: FertiliserInputInorganicScope1Method2 = {
      productionSystem:
        checkProductionSystemsInorganicFertilisers(productionSystem),
      inorganic: {
        applications: [application],
        areaAppliedHectares: nv(Number(areaAppliedHectares)),
        calculationMethodScope1: '2',
      },
      organic: {
        applications: [],
      },
    };

    return result;
  }

  const result: FertiliserInputInorganicScope1Method1 = {
    productionSystem: checkBasicCropProductionSystem(productionSystem),
    inorganic: {
      applications: [application],
      calculationMethodScope1: '1',
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
});
