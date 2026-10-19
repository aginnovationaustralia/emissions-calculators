import { DairyClassesInput } from '@/calculators/Dairy/types/dairy-classes.input';
import { DairyMilkProductionInput } from '@/calculators/Dairy/types/milk.input';
import {
  DairyHerdFertiliserInput,
  DairyHerdLivestockInput,
  DairyHerdLivestockInputSchema,
  DairyHerdLivestockInputTransformed,
} from '@/modules/scope1/shared/dairy/input';
import { nv, nvo } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { checkDairyBreed } from '../dairy-domain';
import { createDairyHerdLivestockInput } from '../factory';
import { checkClimate } from '../fertiliser-domain';
import {
  checkDairySystem,
  checkGrazingProductionSystemsWithRainfall,
  checkMeanAnnualTemperature,
  checkState,
} from '../livestock-domain';

const readDairyClass = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): DairyClassesInput[keyof DairyClassesInput] | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('Y') === undefined) return undefined;

  const head = Number(cell('Z'));

  // The only mandatory input per class.
  if (method === '1') return { head: nv(head) };

  return {
    head: nv(head),
    method2DurationDays: nvo(Number(cell('AA')) || undefined),
    method2Liveweight: nvo(Number(cell('AB')) || undefined),
    method2LiveweightGain: nvo(Number(cell('AC')) || undefined),
    method2DryMatterDigestibility: nvo(Number(cell('AD')) || undefined),
    method2CrudeProtein: nvo(Number(cell('AE')) || undefined),
  };
};

/**
 * Reads the dairy herd keys shared by the livestock (3.3/4.3) and fertiliser (5.x)
 * scenarios.
 */
const readDairyHerdShared = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
) => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  const classes: DairyClassesInput = {
    milkingCows: readDairyClass(sheet, row, method),
    heifersGt1: readDairyClass(sheet, row + 1, method),
    heifersLt1PreWeaned: readDairyClass(sheet, row + 2, method),
    heifersLt1Weaned: readDairyClass(sheet, row + 3, method),
    bullsGt1: readDairyClass(sheet, row + 4, method),
    bullsLt1PreWeaned: readDairyClass(sheet, row + 5, method),
    bullsLt1Weaned: readDairyClass(sheet, row + 6, method),
  };

  const breed = checkDairyBreed(cell('X'));

  const manureAllocations: DairyHerdFertiliserInput['manureAllocations'] = {
    milkingShedMMSAllocation: {
      anaerobicLagoon: nv(Number(cell('J'))),
      sumpDispersal: nv(Number(cell('K'))),
      drainToPaddock: nv(Number(cell('L'))),
      solidStorage: nv(Number(cell('M'))),
    },
    feedPadMMSAllocation: {
      anaerobicLagoon: nv(Number(cell('N'))),
      sumpDispersal: nv(Number(cell('O'))),
      drainToPaddock: nv(Number(cell('P'))),
      solidStorage: nv(Number(cell('Q'))),
    },
  };

  const milkProdLUnchecked = cell('W');
  const milkProduction: DairyMilkProductionInput =
    milkProdLUnchecked !== undefined
      ? { litresPerHeadPerDay: nv(Number(milkProdLUnchecked)) }
      : {
          kgSolidsPerHeadPerDay: nv(Number(cell('T'))),
          fatContent: nvo(method === '2' ? Number(cell('U')) : undefined),
          proteinContent: nvo(method === '2' ? Number(cell('V')) : undefined),
        };

  const systemUnchecked = cell('F');
  const system =
    systemUnchecked !== undefined
      ? { system: checkDairySystem(systemUnchecked) }
      : {
          method2TimeSpentInLocations: {
            timeSpentOnPasture: nv(Number(cell('G'))),
            timeSpentOnMilkingShed: nv(Number(cell('H'))),
            timeSpentOnFeedpad: nv(Number(cell('I'))),
          },
        };

  return {
    isInLeachingZone: cell('E') === 'true',
    classes,
    breed,
    system,
    manureAllocations,
    milkProduction,
  };
};

export const readDairyHerd = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): DairyHerdLivestockInput => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  const { system, manureAllocations, ...shared } = readDairyHerdShared(
    sheet,
    row,
    method,
  );

  return createDairyHerdLivestockInput({
    ...shared,
    ...system,
    state: checkState(cell('A')),
    grazingSystem: checkGrazingProductionSystemsWithRainfall(cell('C')),
    climateZone: checkClimate(cell('D')),
    method2MeanAnnualTemperature:
      method === '1' ? undefined : checkMeanAnnualTemperature(cell('B')),
    manureAllocations: {
      ...manureAllocations,
      ...(method === '1'
        ? { solidsSeparatedPreTreatment: cell('R') === 'true' }
        : { fractionSolidsSeparatedPreTreatment: nv(Number(cell('S'))) }),
    },
  });
};

export const readDairyHerdFertiliser = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
  fractionAppliedToSoils: number,
): DairyHerdFertiliserInput => {
  const { system, ...shared } = readDairyHerdShared(sheet, row, method);
  return {
    ...shared,
    ...system,
    fractionAppliedToSoils: nv(fractionAppliedToSoils),
  };
};

export const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): DairyHerdLivestockInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();
  if (cell('A') === undefined) return undefined;

  return DairyHerdLivestockInputSchema.parse(readDairyHerd(sheet, row, method));
};
