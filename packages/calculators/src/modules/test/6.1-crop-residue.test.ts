import {
  HasClimateZoneInput,
  HasClimateZoneInputSchemaForCrops,
  HasClimateZoneInputTransformed,
} from '@/calculators/types/has-climate-zone.input';
import {
  HasStateInput,
  hasStateInputSchema,
  HasStateInputTransformed,
} from '@/calculators/types/has-state.input';
import { getSheet } from '@/test/common/sheets';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { testContext } from '@/test/Grains/context';
import {
  calculate61CropResidueN2O,
  calculate64FieldBurning,
  calculateMassNCropAppliedToSoil,
  HasCropOrPastureResidueInputTransformed,
  HasCropResidueInput,
  HasCropResidueInputSchema,
} from '../scope1/6-residue-mgmt';
import { checkCropType } from './crop-residue-domain';
import { checkClimate } from './fertiliser-domain';
import { checkState } from './livestock-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';
import { RESIDUE_CROPS_6_1 } from '@/tools/modules';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  calculationMethod: '1' | '2',
):
  | (HasCropOrPastureResidueInputTransformed &
      HasClimateZoneInputTransformed &
      HasStateInputTransformed)
  | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const climateZone = checkClimate(cell('A'));
  const type = checkCropType(cell('B'));
  const state = checkState(cell('C'));
  const fractionOfAnnualCropBurnt = Number(cell('D'));
  const customMassCropResidueRemoved = Number(cell(`E`));
  const totalYieldKg = nv(Number(cell('G')));

  const residues =
    calculationMethod === '2'
      ? {
          calculationMethod,
          massCropResidueRemoved: nv(customMassCropResidueRemoved),
        }
      : {
          calculationMethod,
        };

  const cropResidueInput: HasCropResidueInput = {
    crop: {
      type,
      totalYieldKg,
      fractionOfAnnualCropBurnt: nv(fractionOfAnnualCropBurnt),
      residues,
    },
  };

  const hasStateInput: HasStateInput = {
    state,
  };

  const hasClimateZoneInput: HasClimateZoneInput = {
    climateZone,
  };

  return {
    ...HasClimateZoneInputSchemaForCrops.parse(hasClimateZoneInput),
    ...HasCropResidueInputSchema.parse(cropResidueInput),
    ...hasStateInputSchema([RESIDUE_CROPS_6_1]).parse(hasStateInput),
  };
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`Q${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
);

describe('6.1.1.1 Crop residue N2O', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/6.1-crop-residues.xlsx',
      '6.1.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 5, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculate61CropResidueN2O, '6.1');
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/6.1-crop-residues.xlsx',
      '6.1.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 17, '2');

    compareInputsAndOutputs(inputsAndOutputs, calculate61CropResidueN2O, '6.1');
  });
});

describe('6.1.1.1 Crop residue N2O with a burnt fraction', () => {
  const context = testContext();

  const inputFor = (
    type: HasCropResidueInput['crop']['type'],
    fractionOfAnnualCropBurnt: number,
  ) => ({
    ...HasClimateZoneInputSchemaForCrops.parse({ climateZone: 'wet' }),
    ...HasCropResidueInputSchema.parse({
      crop: {
        type,
        totalYieldKg: nv(1_000_000),
        fractionOfAnnualCropBurnt: nv(fractionOfAnnualCropBurnt),
        residues: { calculationMethod: '1' },
      },
    }),
    ...hasStateInputSchema([RESIDUE_CROPS_6_1]).parse({ state: 'NSW' }),
  });

  const residueN2O = (
    type: HasCropResidueInput['crop']['type'],
    burnt: number,
  ) =>
    calculate61CropResidueN2O(
      inputFor(type, burnt),
      context,
    ).unit.store.value.toNumber();

  const residueN = (type: HasCropResidueInput['crop']['type'], burnt: number) =>
    calculateMassNCropAppliedToSoil(
      inputFor(type, burnt),
      context.constants,
    ).unit.store.value.toNumber();

  // Table A.2.1.1 has no fraction of residue remaining at burning (Sc) for
  // these crops, so 6.4 never counts burning emissions for them.
  it.each([
    'Cotton',
    'Hops and grape vines',
    'Tubers and Roots',
    'Forage Crops',
    'Other Annual Crops',
    'Other Perennial Crops',
  ] as const)(
    'does not remove %s residue from the soil when burning is not applicable',
    (type) => {
      const burning = calculate64FieldBurning(inputFor(type, 1), context);
      expect(burning.fieldBurningN2O.unit.store.value.toNumber()).toBe(0);
      expect(burning.fieldBurningCH4.unit.store.value.toNumber()).toBe(0);

      expect(residueN(type, 0)).toBeGreaterThanOrEqual(0);
      expect(residueN(type, 0.5)).toBe(residueN(type, 0));
      expect(residueN(type, 1)).toBe(residueN(type, 0));
      expect(residueN2O(type, 1)).toBe(residueN2O(type, 0));
    },
  );

  it('still removes burnt residue from the soil for crops that are burnt', () => {
    expect(residueN('Wheat', 0.5)).toBeLessThan(residueN('Wheat', 0));
    expect(residueN2O('Wheat', 0.5)).toBeLessThan(residueN2O('Wheat', 0));

    const burning = calculate64FieldBurning(inputFor('Wheat', 0.5), context);
    expect(burning.fieldBurningN2O.unit.store.value.toNumber()).toBeGreaterThan(
      0,
    );
  });
});
