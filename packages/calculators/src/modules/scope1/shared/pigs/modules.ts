import {
  ENTERIC_PIGS_3_5,
  LivestockLocation,
  livestockOrFertiliserModules,
  MANURE_PIGS_4_5,
} from '@/tools/modules';

/**
 * Modules that read a pigs key used by both enteric methane (3.5) and manure management
 * (4.5) in the livestock scenario.
 */
export const pigsEntericAndManureModules = (location: LivestockLocation) =>
  livestockOrFertiliserModules(location, [ENTERIC_PIGS_3_5, MANURE_PIGS_4_5]);

/**
 * Modules that read a pigs key used only by manure management (4.5) in the livestock
 * scenario.
 */
export const pigsManureModules = (location: LivestockLocation) =>
  livestockOrFertiliserModules(location, [MANURE_PIGS_4_5]);
