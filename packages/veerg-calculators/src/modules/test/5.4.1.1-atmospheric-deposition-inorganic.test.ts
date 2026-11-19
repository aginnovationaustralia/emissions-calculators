import { InorganicFertiliserComponentInput } from '@/calculators/AllModules';
import { getSheet } from '@/test/common/sheets';
import { testContext } from '@/test/Grains/context';
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
    massAppliedKilograms: nv(massAppliedKg),
    massPurchasedKilograms: nv(massAppliedKg),
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

/**
 * A custom blend given by its components. Each component's N volatilises at the FracGASFf of its own fertiliser base,
 * rather than all of the blend's N volatilising at the FracGASFf of the application's fertiliser type.
 */
describe('5.4.1.1 Inorganic fertiliser atmospheric deposition N2O - custom blend by components', () => {
  const components: InorganicFertiliserComponentInput[] = [
    // Own base: 2,000 kg x 0.8235 N = 1,647 kg N, x 0.08 (ammonium-based) = 131.76 kg N volatilised
    {
      componentType: 'Ammonia',
      componentOrigin: 'Unspecified',
      fractionOfFertiliser: nv(0.2),
    },
    // Own base: 1,000 kg N x 0.01 (nitrate-based) = 10 kg N volatilised
    {
      componentType: 'Nitrogen - Nitrate',
      fractionOfFertiliser: nv(0.1),
    } as InorganicFertiliserComponentInput,
    // No base of its own, takes the application's (UAN, urea-based): 1,000 kg N x 0.15 = 150 kg N volatilised
    {
      componentType: 'Nitrogen - Generic',
      fractionOfFertiliser: nv(0.1),
    } as InorganicFertiliserComponentInput,
    // Equivalent fertiliser type: 3,000 kg x 0.46 N = 1,380 kg N, x 0.15 (urea-based) = 207 kg N volatilised
    {
      componentType: 'Urea',
      componentOrigin: 'Unspecified',
      fractionOfFertiliser: nv(0.3),
    },
    // No N
    {
      componentType: 'Muriate of Potash',
      fractionOfFertiliser: nv(0.3),
    } as InorganicFertiliserComponentInput,
  ];

  const input = FertiliserInputSchema.parse({
    productionSystem: 'Irrigated crop',
    inorganic: {
      applications: [
        {
          calculationMethodScope3: '1',
          fertiliserType: 'Urea-Ammonium Nitrate (UAN)',
          massAppliedKilograms: nv(10000),
          massPurchasedKilograms: nv(0),
          components,
        },
      ],
      calculationMethodScope1: '1',
    },
    organic: { applications: [] },
  } satisfies FertiliserInput);

  it('volatilises each component at the FracGASFf of its own base', () => {
    // 498.76 kg N volatilised x 0.007 (irrigated crop) x 1.57 = 5.4813724 kg N2O
    // (all 5,027 kg N at UAN's 0.15 would instead be 754.05 kg N volatilised, 8.2870095 kg N2O)
    const result = calculateInorganicFertiliserAtmosphericDepositionN2O(
      input,
      testContext(),
    );
    expect(result.unit.store.value.toNumber()).toBeCloseTo(5.4813724, 10);
  });
});
