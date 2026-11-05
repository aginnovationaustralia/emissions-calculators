import { LandUseChangeActivityInput } from '@/modules/lulucf';
import { nv } from '@/tools/inputs';
import { CellFn } from '../3.2-beef-enteric/common';
import {
  checkCropOnlyProductionSystems,
  checkPastureOnlyProductionSystems,
} from '../fertiliser-domain';
import { checkIBRA7Region } from './lulucf-domain';

const columnClearingType = 'A';
const columnRegion = 'B';
const columnIsInLeachingZone = 'D';
const columnProductionSystem = 'E';
const columnActivityArea = 'F';

export const columnExpectedOutput163 = 'R';
export const columnExpectedOutput164 = 'S';

export const getLandClearingEvent = (
  cell: CellFn,
): LandUseChangeActivityInput => {
  const clearingType = cell(columnClearingType);

  const type =
    clearingType === 'crop'
      ? 'landClearingForestToCropland'
      : clearingType === 'grassland'
        ? 'landClearingForestToGrassland'
        : 'landClearingForestToSettlements';

  const region = checkIBRA7Region(cell(columnRegion));
  const activityAreaHectares = Number(cell(columnActivityArea));
  const isInLeachingZone = cell(columnIsInLeachingZone) === 'yes';
  const productionSystem = cell(columnProductionSystem);

  const baseFields = {
    carbonMassInTreesCurrentYearTonnesPerHectare: nv(0),
    carbonMassInTreesPreviousYearTonnesPerHectare: nv(0),
    carbonMassInDebrisCurrentYearTonnesPerHectare: nv(0),
    carbonMassInDebrisPreviousYearTonnesPerHectare: nv(0),
    massCH4FromBiomassBurningTonnesPerHectare: nv(0),
    massN2OFromBiomassBurningTonnesPerHectare: nv(0),
    areaBurntHectares: nv(0),
    region,
    activityAreaHectares: nv(activityAreaHectares),
    isInLeachingZone,
  } as const;

  if (type === 'landClearingForestToCropland') {
    const cropProductionSystem =
      checkCropOnlyProductionSystems(productionSystem);
    return {
      ...baseFields,
      type,
      cropProductionSystem,
    };
  } else if (type === 'landClearingForestToGrassland') {
    const pastureProductionSystem =
      checkPastureOnlyProductionSystems(productionSystem);
    return {
      ...baseFields,
      type,
      pastureProductionSystem,
    };
  } else {
    return {
      ...baseFields,
      type,
      pastureProductionSystem: 'Non-irrigated pasture',
    };
  }
};
