import {
  PoultryManureClassesInput,
  LivestockPoultryManureInput,
  LivestockPoultryInputSchema,
  LivestockPoultryManureInputTransformed,
} from '@/modules/scope1/4-manure-management/4.6-poultry-manure';
import XLSX from 'xlsx-populate';
import { checkClimate } from '../fertiliser-domain';
import {
  checkGrazingProductionSystemsWithRainfall,
  checkMeanAnnualTemperature,
  checkPureState,
} from '../livestock-domain';
import { PoultryClass } from '@/constants/enums';

export const readPoultryClass = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): PoultryManureClassesInput[PoultryClass] => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  const head = Number(cell('G'));
  const days = Number(cell('H'));

  const allocationStage1 = {
    manureWithLitter: Number(cell('M')),
    beltManureRemoval: Number(cell('N')),
    manureStoredInHouse: Number(cell('O')),
    pastureRangeAndPaddock: Number(cell('P')),
  };

  const classInput: PoultryManureClassesInput[PoultryClass] = {
    head,
    days,
    manureAllocation: allocationStage1,
  };

  if (method === '1') return classInput;

  classInput.method2DryMatterIntake = Number(cell('I'));
  classInput.method2DryMatterDigestibility = Number(cell('J'));
  classInput.method2CrudeProtein = Number(cell('K'));
  classInput.method2NitrogenRetentionRate = Number(cell('L'));

  return classInput;
};

export const getSimpleCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): LivestockPoultryManureInputTransformed | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('A') === undefined) return;

  const state = checkPureState(cell('A'));
  const productionSystem = checkGrazingProductionSystemsWithRainfall(cell('C'));
  const climateZone = checkClimate(cell('D'));
  const isInLeachingZone = cell('E') === 'true';

  const mms1To2Allocation: LivestockPoultryManureInput['mms1To2Allocation'] = {
    manureWithLitter: {
      solidStorage: Number(cell('Q')),
      composting: Number(cell('R')),
      digester: Number(cell('S')),
      directProcessing: Number(cell('T')),
      directApplication: Number(cell('U')),
    },
    beltManureRemoval: {
      solidStorage: Number(cell('V')),
      composting: Number(cell('W')),
      digester: Number(cell('X')),
      directProcessing: Number(cell('Y')),
      directApplication: Number(cell('Z')),
    },
    manureStoredInHouse: {
      solidStorage: Number(cell('AA')),
      composting: Number(cell('AB')),
      digester: Number(cell('AC')),
      directProcessing: Number(cell('AD')),
      directApplication: Number(cell('AE')),
    },
  };
  const input: LivestockPoultryManureInput = {
    state,
    climateZone,
    productionSystem,
    isInLeachingZone,
    classes: {
      layers: readPoultryClass(sheet, row, method),
      meatChickenBreeder: readPoultryClass(sheet, row + 1, method),
      meatChickenGrowers: readPoultryClass(sheet, row + 2, method),
      meatOther: readPoultryClass(sheet, row + 3, method),
    },
    mms1To2Allocation,
  };

  if (method === '1') return LivestockPoultryInputSchema.parse(input);

  input.temperatureZone = checkMeanAnnualTemperature(cell('B'));

  return LivestockPoultryInputSchema.parse(input);
};
