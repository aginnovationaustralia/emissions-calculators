import z from 'zod';
import type { NonEmptyArray } from './inputs';

/**
 * Named constants for module identifiers (e.g. '3.1'), used to tag which
 * module(s) consume a given input. Prefer these over raw string literals so
 * a rename or reshuffle of modules is a single-file change, and so a typo in
 * a module id is caught at compile time instead of silently tagging nothing.
 */

// -------- Scope 1: 3 - Enteric methane --------
export const ENTERIC_FEEDLOT_3_1 = '3.1';
export const ENTERIC_BEEF_3_2 = '3.2';
export const ENTERIC_DAIRY_3_3 = '3.3';
export const ENTERIC_SHEEP_3_4 = '3.4';
export const ENTERIC_PIGS_3_5 = '3.5';
export const ENTERIC_OTHER_3_6 = '3.6';

// -------- Scope 1: 4 - Manure management --------
export const MANURE_FEEDLOT_4_1 = '4.1';
export const MANURE_BEEF_4_2 = '4.2';
export const MANURE_DAIRY_4_3 = '4.3';
export const MANURE_SHEEP_4_4 = '4.4';
export const MANURE_PIGS_4_5 = '4.5';
export const MANURE_POULTRY_4_6 = '4.6';
export const MANURE_OTHER_4_7 = '4.7';

// -------- Scope 1: 5 - Fertiliser --------
export const FERT_INORGANIC_5_1 = '5.1';
export const FERT_ORGANIC_5_2 = '5.2';
export const LIME_5_3 = '5.3';
export const ATMOS_DEPOSIT_5_4 = '5.4';
export const LEACH_RUNOFF_5_5 = '5.5';

// -------- Scope 1: 6 - Residue management --------
export const RESIDUE_CROPS_6_1 = '6.1';
export const RESIDUE_PASTURE_6_2 = '6.2';
export const RESIDUE_LEACH_6_3 = '6.3';
export const RESIDUE_BURN_6_4 = '6.4';

// -------- Scope 1: 7 - Rice cultivation --------
export const RICE_7_1 = '7.1';

// -------- Scope 1: 8 - Fuel use --------
export const FUEL_TRANSPORT_8_1 = '8.1';
export const FUEL_STATIONARY_8_2 = '8.2';

// -------- Scope 1: 9 - Refrigerant use --------
export const REFRIGERANT_9_1 = '9.1';

// -------- Scope 1: 10 - Solid waste --------
export const SOLID_WASTE_10_1 = '10.1';

// -------- Scope 1: 11 - Wastewater --------
export const WASTEWATER_11_1 = '11.1';

// -------- Scope 1: 12 - Supplementary CO2 --------
export const SUPP_CO2_12_1 = '12.1';

// -------- Scope 1: 13 - Aquatic --------
export const AQUATIC_13_1 = '13.1';

// -------- Scope 2: 14 - Electricity --------
export const ELECTRICITY_14_1 = '14.1';

// -------- Scope 3: 15 - Purchased goods and services --------
export const PURCH_LIVESTOCK_15_1 = '15.1';
export const PURCH_FEED_15_2 = '15.2';
export const PURCH_MINERAL_15_3 = '15.3';
export const PURCH_FERT_15_4 = '15.4';
export const AGRICHEM_15_5 = '15.5';
export const PURCH_LIME_15_6 = '15.6';
export const SERVICES_15_7 = '15.7';
export const PACKAGING_15_8 = '15.8';
export const OTHER_PURCH_15_9 = '15.9';
export const PURCH_FUEL_15_10 = '15.10';
export const ELECTRICITY_15_11 = '15.11';
export const WASTE_15_12 = '15.12';
export const FREIGHT_15_13 = '15.13';

// -------- LULUCF: 16 - Land use, land-use change and forestry --------
export const LAND_USE_16_2 = '16.2';
export const N_SOIL_LOSS_16_3 = '16.3';
export const N_LEACHING_16_4 = '16.4';
export const BURNING_16_5 = '16.5';
export const PERENNIAL_16_6 = '16.6';

// -------- Cross-cutting --------
export const INTENSITIES = 'Intensities';
export const ALLOCATION = 'Allocation';

export type ModuleNames =
  | typeof ENTERIC_FEEDLOT_3_1
  | typeof ENTERIC_BEEF_3_2
  | typeof ENTERIC_DAIRY_3_3
  | typeof ENTERIC_SHEEP_3_4
  | typeof ENTERIC_PIGS_3_5
  | typeof ENTERIC_OTHER_3_6
  | typeof MANURE_FEEDLOT_4_1
  | typeof MANURE_BEEF_4_2
  | typeof MANURE_DAIRY_4_3
  | typeof MANURE_SHEEP_4_4
  | typeof MANURE_PIGS_4_5
  | typeof MANURE_POULTRY_4_6
  | typeof MANURE_OTHER_4_7
  | typeof FERT_INORGANIC_5_1
  | typeof FERT_ORGANIC_5_2
  | typeof LIME_5_3
  | typeof ATMOS_DEPOSIT_5_4
  | typeof LEACH_RUNOFF_5_5
  | typeof RESIDUE_CROPS_6_1
  | typeof RESIDUE_PASTURE_6_2
  | typeof RESIDUE_LEACH_6_3
  | typeof RESIDUE_BURN_6_4
  | typeof RICE_7_1
  | typeof FUEL_TRANSPORT_8_1
  | typeof FUEL_STATIONARY_8_2
  | typeof REFRIGERANT_9_1
  | typeof SOLID_WASTE_10_1
  | typeof WASTEWATER_11_1
  | typeof SUPP_CO2_12_1
  | typeof AQUATIC_13_1
  | typeof ELECTRICITY_14_1
  | typeof PURCH_LIVESTOCK_15_1
  | typeof PURCH_FEED_15_2
  | typeof PURCH_MINERAL_15_3
  | typeof PURCH_FERT_15_4
  | typeof AGRICHEM_15_5
  | typeof PURCH_LIME_15_6
  | typeof SERVICES_15_7
  | typeof PACKAGING_15_8
  | typeof OTHER_PURCH_15_9
  | typeof PURCH_FUEL_15_10
  | typeof ELECTRICITY_15_11
  | typeof WASTE_15_12
  | typeof FREIGHT_15_13
  | typeof LAND_USE_16_2
  | typeof N_SOIL_LOSS_16_3
  | typeof N_LEACHING_16_4
  | typeof BURNING_16_5
  | typeof PERENNIAL_16_6
  | typeof INTENSITIES
  | typeof ALLOCATION;

/** A plain object schema, or an object schema followed by `.transform(...)` */
type LocatableObjectSchema =
  z.ZodObject | z.ZodPipe<z.ZodObject, z.ZodTransform>;

/** A locatable object schema, or a discriminated union of them */
type LocatableUnionOption =
  | LocatableObjectSchema
  | z.ZodDiscriminatedUnion<readonly LocatableObjectSchema[]>;

/** A locatable schema, or an exclusive union of them */
type LocatableSchema =
  LocatableUnionOption | z.ZodXor<readonly LocatableUnionOption[]>;

/**
 * Where a livestock schema is used: as the herd, lot or flock itself (`'livestock'`,
 * read by chapters 3 and 4), or as the source of an organic fertiliser application
 * (`'fertiliser'`, read by chapter 5). See `modules/scope1/shared/README.md`.
 */
export type LivestockLocation = 'livestock' | 'fertiliser';

/**
 * Modules that read a livestock key when the livestock's manure is the source of an
 * organic fertiliser application.
 */
export const FERTILISER_MODULES: NonEmptyArray<ModuleNames> = [
  FERT_ORGANIC_5_2,
  ATMOS_DEPOSIT_5_4,
  LEACH_RUNOFF_5_5,
];

/**
 * Modules that read a key in a `Shared` livestock schema: `livestockModules` for the
 * livestock scenario, and the chapter 5 modules for the fertiliser scenario.
 */
export const livestockOrFertiliserModules = (
  location: LivestockLocation,
  livestockModules: NonEmptyArray<ModuleNames>,
): NonEmptyArray<ModuleNames> =>
  location === 'livestock' ? livestockModules : [...FERTILISER_MODULES];

/**
 * The scenario-specific module for a livestock key that is read in both scenarios, or
 * `'fertiliser'` when the livestock's manure is the source of an organic fertiliser
 * application. Pairs with schemas such as `hasIsInLeachingZoneInputSchema`.
 */
export const livestockModuleOrFertiliser = <M extends ModuleNames>(
  location: LivestockLocation,
  livestockModule: M,
): M | 'fertiliser' =>
  location === 'livestock' ? livestockModule : 'fertiliser';

export type ManureModules =
  | typeof MANURE_FEEDLOT_4_1
  | typeof MANURE_BEEF_4_2
  | typeof MANURE_DAIRY_4_3
  | typeof MANURE_SHEEP_4_4
  | typeof MANURE_PIGS_4_5
  | typeof MANURE_POULTRY_4_6
  | typeof MANURE_OTHER_4_7;

export type ClimateZoneModules =
  | typeof MANURE_BEEF_4_2
  | typeof MANURE_DAIRY_4_3
  | typeof MANURE_SHEEP_4_4
  | typeof MANURE_PIGS_4_5
  | typeof MANURE_POULTRY_4_6
  | typeof MANURE_OTHER_4_7
  | typeof FERT_ORGANIC_5_2
  | typeof RESIDUE_CROPS_6_1
  | typeof RESIDUE_PASTURE_6_2
  | typeof RESIDUE_LEACH_6_3;

export type LeachingZoneModules =
  | typeof MANURE_BEEF_4_2
  | typeof MANURE_DAIRY_4_3
  | typeof MANURE_SHEEP_4_4
  | typeof MANURE_PIGS_4_5
  | typeof MANURE_POULTRY_4_6
  | typeof MANURE_OTHER_4_7
  | typeof RESIDUE_LEACH_6_3
  | typeof N_LEACHING_16_4;

export type ExcludedFromNaturalWaterModules =
  typeof MANURE_BEEF_4_2 | typeof MANURE_SHEEP_4_4 | typeof MANURE_OTHER_4_7;

export type StateModules =
  | typeof MANURE_DAIRY_4_3
  | typeof MANURE_PIGS_4_5
  | typeof MANURE_POULTRY_4_6
  | typeof MANURE_OTHER_4_7
  | typeof RESIDUE_CROPS_6_1
  | typeof RESIDUE_LEACH_6_3
  | typeof SERVICES_15_7
  | typeof PURCH_FUEL_15_10;

type FuelModules =
  | typeof FUEL_TRANSPORT_8_1
  | typeof FUEL_STATIONARY_8_2
  | typeof SERVICES_15_7
  | typeof PURCH_FUEL_15_10
  | typeof FREIGHT_15_13;

type FuelLocation = 'fuel' | 'services' | 'freight';

/**
 * Unlike the other `locate*` helpers, this caches one schema per location. Fuel schemas
 * carry a `.meta({ id })`, and every calculator spreads them, so building a fresh copy per
 * call would emit several different schemas with the same id, which OpenAPI generation
 * rejects.
 */
export const locateFuel = <T extends LocatableSchema>(
  schemaFn: (options: {
    location: FuelLocation;
    modules: NonEmptyArray<FuelModules>;
  }) => T,
) => {
  const cache = new Map<FuelLocation, T>();
  return (location: FuelLocation): T => {
    const cached = cache.get(location);
    if (cached) return cached;
    const schema = schemaFn({
      location,
      modules:
        location === 'fuel'
          ? [FUEL_TRANSPORT_8_1, FUEL_STATIONARY_8_2, PURCH_FUEL_15_10]
          : location === 'services'
            ? [SERVICES_15_7]
            : [FREIGHT_15_13],
    });
    cache.set(location, schema);
    return schema;
  };
};

type TransportFuelModules =
  | typeof FUEL_TRANSPORT_8_1
  | typeof SERVICES_15_7
  | typeof PURCH_FUEL_15_10
  | typeof FREIGHT_15_13;

export const locateTransportFuel =
  <T extends LocatableSchema>(
    schemaFn: (options: {
      location: 'fuel' | 'services' | 'freight';
      modules: NonEmptyArray<TransportFuelModules>;
    }) => T,
  ) =>
  (location: 'fuel' | 'services' | 'freight') =>
    schemaFn({
      location,
      modules:
        location === 'fuel'
          ? [FUEL_TRANSPORT_8_1, PURCH_FUEL_15_10]
          : location === 'services'
            ? [SERVICES_15_7]
            : [FREIGHT_15_13],
    });

type StationaryFuelModules =
  | typeof FUEL_STATIONARY_8_2
  | typeof SERVICES_15_7
  | typeof PURCH_FUEL_15_10
  | typeof FREIGHT_15_13;

export const locateStationaryFuel =
  <T extends LocatableSchema>(
    schemaFn: (options: {
      location: 'fuel' | 'services' | 'freight';
      modules: NonEmptyArray<StationaryFuelModules>;
    }) => T,
  ) =>
  (location: 'fuel' | 'services' | 'freight') =>
    schemaFn({
      location,
      modules:
        location === 'fuel'
          ? [FUEL_STATIONARY_8_2, PURCH_FUEL_15_10]
          : location === 'services'
            ? [SERVICES_15_7]
            : [FREIGHT_15_13],
    });
