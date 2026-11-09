import {
  ENTERIC_DAIRY_3_3,
  LivestockLocation,
  livestockOrFertiliserModules,
  MANURE_DAIRY_4_3,
} from '@/tools/modules';

/**
 * Modules that read a dairy key used by both enteric methane (3.3) and manure
 * management (4.3) in the livestock scenario.
 */
export const dairyEntericAndManureModules = (location: LivestockLocation) =>
  livestockOrFertiliserModules(location, [ENTERIC_DAIRY_3_3, MANURE_DAIRY_4_3]);

/**
 * Modules that read a dairy key used only by manure management (4.3) in the livestock
 * scenario.
 */
export const dairyManureModules = (location: LivestockLocation) =>
  livestockOrFertiliserModules(location, [MANURE_DAIRY_4_3]);
