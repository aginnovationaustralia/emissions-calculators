import { PigsClassLivestockInput } from '@/calculators/Pigs/types/pigs-class.input';
import { PigsHerdClassesLivestockInput } from '@/calculators/Pigs/types/pigs-classes.input';
import {
  PigsHerdInput,
  PigsHerdInputSchema,
  PigsHerdInputTransformed,
} from '@/calculators/Pigs/types/pigs-herd.input';
import { nv, nvo } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { createPigsInput } from '../factory';
import {
  checkGrazingProductionSystemsWithRainfall,
  checkMeanAnnualTemperature,
  checkState,
} from '../livestock-domain';

export const readPigsClass = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): PigsClassLivestockInput | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('E') === undefined) return undefined;

  const numOrZero = (column: string, offset: number = 0) =>
    Number(cell(column, offset)) || 0;

  const head = nv(numOrZero('F'));
  const days = nv(numOrZero('G'));

  const outdoorAndFreeRange = nv(numOrZero('M'));

  const anaerobicLagoon = {
    manureAllocated: nv(numOrZero('K')),
    treatmentStage2Allocations: {
      solidStorage: nv(numOrZero('AA')),
      digester: nv(numOrZero('AB')),
      pitStorage: nv(numOrZero('AC')),
      directApplication: nv(numOrZero('AD')),
    },
  };
  const solidStorage = {
    manureAllocated: nv(numOrZero('L')),
    treatmentStage2Allocations: {
      anaerobicLagoon: nv(numOrZero('AE')),
      digester: nv(numOrZero('AG')),
      pitStorage: nv(numOrZero('AH')),
      directApplication: nv(numOrZero('AI')),
    },
  };

  const digester = {
    manureAllocated: nv(numOrZero('N')),
    treatmentStage2Allocations: {
      anaerobicLagoon: nv(numOrZero('AJ')),
      solidStorage: nv(numOrZero('AK')),
      pitStorage: nv(numOrZero('AM')),
      directApplication: nv(numOrZero('AN')),
    },
  };

  const deepLitter = {
    manureAllocated: nv(numOrZero('O')),
    treatmentStage2Allocations: {
      anaerobicLagoon: nv(numOrZero('AO')),
      solidStorage: nv(numOrZero('AP')),
      digester: nv(numOrZero('AQ')),
      pitStorage: nv(numOrZero('AR')),
      directApplication: nv(numOrZero('AS')),
    },
  };

  const pitStorage = {
    manureAllocated: nv(numOrZero('P')),
    treatmentStage2Allocations: {
      anaerobicLagoon: nv(numOrZero('AT')),
      solidStorage: nv(numOrZero('AU')),
      digester: nv(numOrZero('AV')),
      directApplication: nv(numOrZero('AX')),
    },
  };

  if (method === '1') {
    return {
      head,
      days,
      manureAllocations: {
        anaerobicLagoon: {
          ...anaerobicLagoon,
          solidsSeparatedPreTreatment: cell('Q') === 'true',
        },
        solidStorage,
        outdoorAndFreeRange,
        digester: {
          ...digester,
          solidsSeparatedPreTreatment: cell('T') === 'true',
        },
        deepLitter,
        pitStorage: {
          ...pitStorage,
          solidsSeparatedPreTreatment: cell('W') === 'true',
        },
      },
    };
  }

  return {
    head,
    days,
    method2AverageFeedIntake: nvo(Number(cell('H')) || undefined),
    method2VolatileSolidProductionRate: nvo(Number(cell('I')) || undefined),
    method2NitrogenWasteProductionRate: nvo(Number(cell('J')) || undefined),

    manureAllocations: {
      anaerobicLagoon: {
        ...anaerobicLagoon,
        fractionSolidsSeparatedPreTreatment: nv(numOrZero('R')),
        fractionNitrogenSeparatedPreTreatment: nv(numOrZero('S')),
      },
      solidStorage,
      outdoorAndFreeRange,
      digester: {
        ...digester,
        fractionSolidsSeparatedPreTreatment: nv(numOrZero('U')),
        fractionNitrogenSeparatedPreTreatment: nv(numOrZero('V')),
      },
      deepLitter,
      pitStorage: {
        ...pitStorage,
        fractionSolidsSeparatedPreTreatment: nv(numOrZero('X')),
        fractionNitrogenSeparatedPreTreatment: nv(numOrZero('Y')),
      },
    },
  };
};

export const getSimpleCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): PigsHerdInputTransformed | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('A') === undefined) return undefined;

  const classes: PigsHerdClassesLivestockInput = {
    boars: readPigsClass(sheet, row, method),
    sows: readPigsClass(sheet, row + 1, method),
    gilts: readPigsClass(sheet, row + 2, method),
    slaughterPigs: readPigsClass(sheet, row + 3, method),
  };

  const pigsInput: PigsHerdInput = createPigsInput({
    state: checkState(cell('A')),
    grazingSystem: checkGrazingProductionSystemsWithRainfall(cell('C')),
    isInLeachingZone: cell('D') === 'true',
    classes,
  });

  if (method === '2')
    pigsInput.method2MeanAnnualTemperature = checkMeanAnnualTemperature(
      cell('B'),
    );

  return PigsHerdInputSchema.parse(pigsInput);
};
