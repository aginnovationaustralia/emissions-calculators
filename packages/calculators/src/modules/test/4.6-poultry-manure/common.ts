import { PoultryMMSAllocationInput } from '@/calculators/Poultry/types/mms-allocation.input';
import { PoultryClassesLivestockInput } from '@/calculators/Poultry/types/poultry-classes.input';
import {
  PoultryFlockInput,
  PoultryFlockInputSchema,
  PoultryFlockInputTransformed,
} from '@/calculators/Poultry/types/poultry-flock.input';
import { PoultryClass } from '@/constants/enums';
import { nv, nvo } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { createPoultryInput } from '../factory';
import { checkClimate } from '../fertiliser-domain';
import {
  checkGrazingProductionSystemsWithRainfall,
  checkMeanAnnualTemperature,
  checkState,
} from '../livestock-domain';

export const readPoultryClass = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): PoultryClassesLivestockInput[PoultryClass] => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  const head = Number(cell('G'));
  const days = Number(cell('H'));

  const manureAllocations: PoultryMMSAllocationInput = {
    manureWithLitter: {
      manureAllocated: nv(Number(cell('M'))),
      treatmentStage2Allocations: {
        solidStorage: nv(Number(cell('Q'))),
        composting: nv(Number(cell('R'))),
        digester: nv(Number(cell('S'))),
        directProcessing: nv(Number(cell('T'))),
        directApplication: nv(Number(cell('U'))),
      },
    },
    beltManureRemoval: {
      manureAllocated: nv(Number(cell('N'))),
      treatmentStage2Allocations: {
        solidStorage: nv(Number(cell('V'))),
        composting: nv(Number(cell('W'))),
        digester: nv(Number(cell('X'))),
        directProcessing: nv(Number(cell('Y'))),
        directApplication: nv(Number(cell('Z'))),
      },
    },
    manureStoredInHouse: {
      manureAllocated: nv(Number(cell('O'))),
      treatmentStage2Allocations: {
        solidStorage: nv(Number(cell('AA'))),
        composting: nv(Number(cell('AB'))),
        digester: nv(Number(cell('AC'))),
        directProcessing: nv(Number(cell('AD'))),
        directApplication: nv(Number(cell('AE'))),
      },
    },
    pastureRangeAndPaddock: nv(Number(cell('P'))),
  };

  const classInput: PoultryClassesLivestockInput[PoultryClass] = {
    head: nv(head),
    days: nv(days),
    manureAllocations,
  };

  if (method === '1') return classInput;

  classInput.method2DryMatterIntake = nvo(Number(cell('I')));
  classInput.method2DryMatterDigestibility = nvo(Number(cell('J')));
  classInput.method2CrudeProtein = nvo(Number(cell('K')));

  return classInput;
};

export const getSimpleCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): PoultryFlockInputTransformed | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('A') === undefined) return;

  const state = checkState(cell('A'));
  const grazingSystem = checkGrazingProductionSystemsWithRainfall(cell('C'));
  const climateZone = checkClimate(cell('D'));
  const isInLeachingZone = cell('E') === 'true';

  const input: PoultryFlockInput = createPoultryInput({
    state,
    climateZone,
    grazingSystem,
    isInLeachingZone,
    classes: {
      layers: readPoultryClass(sheet, row, method),
      meatChickenBreeders: readPoultryClass(sheet, row + 1, method),
      meatChickenGrowers: readPoultryClass(sheet, row + 2, method),
      meatOther: readPoultryClass(sheet, row + 3, method),
    },
  });

  if (method === '2') {
    input.method2MeanAnnualTemperature = checkMeanAnnualTemperature(cell('B'));
  }

  return PoultryFlockInputSchema.parse(input);
};
