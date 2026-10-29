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
import {
  BurnableCropType,
  BurnableCropTypes,
  CropType,
  NonBurnableCropTypes,
} from '@/constants/enums';
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
import { checkCropType, cropTypeAndBurntFraction } from './crop-residue-domain';
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
      ...cropTypeAndBurntFraction(type, fractionOfAnnualCropBurnt),
      totalYieldKg,
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

  const cropInput = (type: CropType, burnt?: number) => ({
    crop: {
      type,
      totalYieldKg: nv(1_000_000),
      ...(burnt === undefined ? {} : { fractionOfAnnualCropBurnt: nv(burnt) }),
      residues: { calculationMethod: '1' },
    },
  });

  const inputFor = (type: BurnableCropType, burnt: number) => ({
    ...HasClimateZoneInputSchemaForCrops.parse({ climateZone: 'wet' }),
    ...HasCropResidueInputSchema.parse(cropInput(type, burnt)),
    ...hasStateInputSchema([RESIDUE_CROPS_6_1]).parse({ state: 'NSW' }),
  });

  // Table A.2.1.1 has no fraction of residue remaining at burning (Sc) for
  // these crops, so a burnt fraction is not accepted for them.
  it.each(NonBurnableCropTypes)(
    'does not accept a burnt fraction for %s',
    (type) => {
      expect(HasCropResidueInputSchema.safeParse(cropInput(type)).success).toBe(
        true,
      );
      expect(
        HasCropResidueInputSchema.safeParse(cropInput(type, 0)).success,
      ).toBe(false);
    },
  );

  it.each(BurnableCropTypes)('requires a burnt fraction for %s', (type) => {
    expect(
      HasCropResidueInputSchema.safeParse(cropInput(type, 0)).success,
    ).toBe(true);
    expect(HasCropResidueInputSchema.safeParse(cropInput(type)).success).toBe(
      false,
    );
  });

  it('removes burnt residue from the soil for crops that are burnt', () => {
    const residueN = (burnt: number) =>
      calculateMassNCropAppliedToSoil(
        inputFor('Wheat', burnt),
        context.constants,
      ).unit.store.value.toNumber();
    const residueN2O = (burnt: number) =>
      calculate61CropResidueN2O(
        inputFor('Wheat', burnt),
        context,
      ).unit.store.value.toNumber();

    expect(residueN(0.5)).toBeLessThan(residueN(0));
    expect(residueN2O(0.5)).toBeLessThan(residueN2O(0));

    const burning = calculate64FieldBurning(inputFor('Wheat', 0.5), context);
    expect(burning.fieldBurningN2O.unit.store.value.toNumber()).toBeGreaterThan(
      0,
    );
  });
});
