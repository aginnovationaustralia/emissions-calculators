import { OtherLivestockClassInput } from '@/calculators/OtherLivestock/types/class.input';
import {
  OtherLivestockHerdInput,
  OtherLivestockHerdInputSchema,
  OtherLivestockHerdInputTransformed,
} from '@/calculators/OtherLivestock/types/herd.input';
import { OtherLivestockType } from '@/constants/enums';
import { nv } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { createOtherLivestockInput } from '../factory';
import {
  checkClimateZone,
  checkGrazingProductionSystemsWithRainfall,
  checkMeanAnnualTemperature,
  checkOtherLivestockClass,
  checkState,
} from '../livestock-domain';

/** Column letters for `4.7-other-livestock-manure.xlsx` sheet `4.7.1.1` (shared across 4.7 tests). */
export const otherLivestockManureSheetColumns = {
  columnLivestockType: 'A',
  columnLivestockClass: 'B',
  columnHead: 'C',
  columnIsInLeachingZone: 'D',
  columnProductionSystem: 'E',
  columnMeanAnnualTemperature: 'F',
  columnClimateZone: 'G',
  columnState: 'I',
  columnExcludedFromNaturalWater: 'L',
  columnOutputMethane: 'AD',
  columnOutputDirectN2o: 'AF',
  columnOutputDepositionN2o: 'AH',
  columnOutputLeachingN2o: 'AJ',
} as const;

export function getOtherLivestockInput(
  type: OtherLivestockType,
  head: number,
): OtherLivestockClassInput {
  return {
    type,
    head: nv(head),
  };
}

export function getOtherLivestockHerdInput(
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): OtherLivestockHerdInputTransformed | undefined {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const method2MeanAnnualTemperature = cell(
    otherLivestockManureSheetColumns.columnMeanAnnualTemperature,
  );

  const head = Number(cell(otherLivestockManureSheetColumns.columnHead));
  const type = checkOtherLivestockClass(
    cell(otherLivestockManureSheetColumns.columnLivestockType),
  );
  const climateZone = cell(otherLivestockManureSheetColumns.columnClimateZone);
  const isInLeachingZone =
    cell(otherLivestockManureSheetColumns.columnIsInLeachingZone) === 'yes';
  const excludedFromNaturalWater =
    cell(otherLivestockManureSheetColumns.columnExcludedFromNaturalWater) ===
    'yes';
  const state = checkState(cell(otherLivestockManureSheetColumns.columnState));
  const grazingSystem = checkGrazingProductionSystemsWithRainfall(
    cell(otherLivestockManureSheetColumns.columnProductionSystem),
  );

  const otherLivestockClassInput = getOtherLivestockInput(type, head);

  const input: OtherLivestockHerdInput = createOtherLivestockInput({
    livestock: [otherLivestockClassInput],
    excludedFromNaturalWater,
    method2MeanAnnualTemperature:
      method === '1'
        ? undefined
        : checkMeanAnnualTemperature(method2MeanAnnualTemperature),
    grazingSystem,
    state,
    climateZone:
      climateZone === undefined ? 'dry' : checkClimateZone(climateZone),
    isInLeachingZone,
  });

  return OtherLivestockHerdInputSchema.parse(input);
}
