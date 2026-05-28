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
import { checkPoultryClass } from '../poultry-domain';
import { PoultryClass } from '@/constants/enums';

export const readPoultryClass = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): PoultryManureClassesInput[PoultryClass] | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  const head = Number(cell('G'));
  const days = Number(cell('H'));

  const allocationStage1 = {
    manureWithLitter: Number(cell('M')),
    beltManureRemoval: Number(cell('M', 1)),
    manureStoredInHouse: Number(cell('M', 2)),
    pastureRangeAndPaddock: Number(cell('M', 3)),
  };

  const classInput: PoultryManureClassesInput[PoultryClass] = {
    head,
    days,
    manureAllocation: allocationStage1,
  };

  if (method === '1') return classInput;

  classInput.method2DryMatterIntake = Number(cell('I'));
  classInput.method2CrudeProtein = Number(cell('J'));
  classInput.method2NitrogenRetentionRate = Number(cell('K'));

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

  const classNameUnchecked = cell('F');
  if (classNameUnchecked === undefined) return;
  const className = checkPoultryClass(classNameUnchecked);

  const state = checkPureState(cell('A'));
  const productionSystem = checkGrazingProductionSystemsWithRainfall(cell('C'));
  const climateZone = checkClimate(cell('D'));
  const isInLeachingZone = Boolean(cell('E'));

  const allocationStage2 = {
    solidStorage: Number(cell('O')),
    composting: Number(cell('O', 1)),
    digester: Number(cell('O', 2)),
    directProcessing: Number(cell('O', 3)),
    directApplication: Number(cell('O', 4)),
  };
  const empty: PoultryManureClassesInput[PoultryClass] = {
    head: 0,
    days: 0,
    manureAllocation: {
      manureWithLitter: 0,
      beltManureRemoval: 0,
      manureStoredInHouse: 0,
      pastureRangeAndPaddock: 1,
    },
  };

  const input: LivestockPoultryManureInput = {
    state,
    climateZone,
    productionSystem,
    isInLeachingZone,
    classes: {
      layers: empty,
      meatChickenBreeder: empty,
      meatChickenGrowers: empty,
      meatOther: empty,
      [className]: readPoultryClass(sheet, row, method),
    },
    mms1To2Allocation: {
      manureWithLitter: allocationStage2,
      beltManureRemoval: allocationStage2,
      manureStoredInHouse: allocationStage2,
    },
  };

  if (method === '1') return LivestockPoultryInputSchema.parse(input);

  input.temperatureZone = checkMeanAnnualTemperature('B');
  input.classes[className].method2DryMatterIntake = Number(cell('I'));
  input.classes[className].method2CrudeProtein = Number(cell('J'));
  input.classes[className].method2NitrogenRetentionRate = Number(cell('K'));

  return LivestockPoultryInputSchema.parse(input);
};
