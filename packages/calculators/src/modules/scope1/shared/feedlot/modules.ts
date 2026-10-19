import {
  ENTERIC_FEEDLOT_3_1,
  LivestockLocation,
  livestockOrFertiliserModules,
  MANURE_FEEDLOT_4_1,
} from '@/tools/modules';

/**
 * Modules that read a feedlot key used by both enteric methane (3.1) and manure
 * management (4.1) in the livestock scenario.
 */
export const feedlotEntericAndManureModules = (location: LivestockLocation) =>
  livestockOrFertiliserModules(location, [
    ENTERIC_FEEDLOT_3_1,
    MANURE_FEEDLOT_4_1,
  ]);

/**
 * Modules that read a feedlot key used only by manure management (4.1) in the
 * livestock scenario.
 */
export const feedlotManureModules = (location: LivestockLocation) =>
  livestockOrFertiliserModules(location, [MANURE_FEEDLOT_4_1]);
