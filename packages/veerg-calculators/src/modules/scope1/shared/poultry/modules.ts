import {
  LivestockLocation,
  livestockOrFertiliserModules,
  MANURE_POULTRY_4_6,
} from '@/tools/modules';

/**
 * Modules that read a poultry key used by manure management (4.6) in the livestock
 * scenario. Poultry has no enteric methane module.
 */
export const poultryManureModules = (location: LivestockLocation) =>
  livestockOrFertiliserModules(location, [MANURE_POULTRY_4_6]);
