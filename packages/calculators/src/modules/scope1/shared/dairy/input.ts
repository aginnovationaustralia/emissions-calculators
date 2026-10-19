import { dairyClassesInputSchema } from '@/calculators/Dairy/types/dairy-classes.input';
import { dairyMilkProductionInputSchema } from '@/calculators/Dairy/types/milk.input';
import { hasClimateZoneInputSchema } from '@/calculators/types/has-climate-zone.input';
import { HasFractionAppliedToSoilsInputSchema } from '@/calculators/types/has-fraction-applied-to-soils.input';
import { hasGrazingProductionSystemInputSchema } from '@/calculators/types/has-grazing-production-system.input';
import { hasIsInLeachingZoneInputSchema } from '@/calculators/types/has-is-in-leaching.input';
import { hasMethod2MeanAnnualTemperatureInputSchema } from '@/calculators/types/has-method2-mean-annual-temperature.input';
import { hasStateInputSchema } from '@/calculators/types/has-state.input';
import { DairyCattleBreeds, DairySystems } from '@/constants/enums';
import {
  booleanInput,
  enumInput,
  isProportion,
  numberInput,
} from '@/tools/inputs';
import {
  LivestockLocation,
  MANURE_DAIRY_4_3,
  PURCH_FUEL_15_10,
  RESIDUE_LEACH_6_3,
  SERVICES_15_7,
  livestockModuleOrFertiliser,
} from '@/tools/modules';
import { sum } from '@/tools/sum';
import { realNumber } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';
import { dairyEntericAndManureModules, dairyManureModules } from './modules';

// -------- Manure management system allocations --------

const dairyMMSAllocationInnerSchema = (location: LivestockLocation) =>
  object({
    anaerobicLagoon: numberInput(
      (val) => realNumber(val),
      {
        name: 'anaerobicLagoon',
        description: 'Fraction of manure allocated to anaerobic lagoon',
        modules: dairyManureModules(location),
      },
      isProportion,
    ),
    sumpDispersal: numberInput(
      (val) => realNumber(val),
      {
        name: 'sumpDispersal',
        description: 'Fraction of manure allocated to sump dispersal',
        modules: dairyManureModules(location),
      },
      isProportion,
    ),
    drainToPaddock: numberInput(
      (val) => realNumber(val),
      {
        name: 'drainToPaddock',
        description: 'Fraction of manure allocated to drain to paddock',
        modules: dairyManureModules(location),
      },
      isProportion,
    ),
    solidStorage: numberInput(
      (val) => realNumber(val),
      {
        name: 'solidStorage',
        description: 'Fraction of manure allocated to solid storage',
        modules: dairyManureModules(location),
      },
      isProportion,
    ),
  });

export type DairyMMSAllocationInner = z.input<
  ReturnType<typeof dairyMMSAllocationInnerSchema>
>;

/**
 * Manure allocations read both by dairy manure management (4.3) and the chapter 5
 * nitrogen calculation (via `calculateManureAllocations`).
 */
const dairyMMSAllocationSharedInputSchema = (location: LivestockLocation) =>
  object({
    milkingShedMMSAllocation: dairyMMSAllocationInnerSchema(location),
    feedPadMMSAllocation: dairyMMSAllocationInnerSchema(location),
  });

const DairyMMSAllocationLivestockBaseSchema =
  dairyMMSAllocationSharedInputSchema('livestock');

/**
 * Solids separation only affects volatile solids, so it is read by dairy manure
 * methane (4.3) but not by the chapter 5 nitrogen calculation.
 */
const DairyMMSAllocationLivestockMethod1Schema =
  DairyMMSAllocationLivestockBaseSchema.extend({
    solidsSeparatedPreTreatment: booleanInput(
      'solidsSeparatedPreTreatment',
      'If solids produced by these cattle were separated by pre-treatment of manure (applicable to anaerobic lagoons only).',
      [MANURE_DAIRY_4_3],
    ),
  })
    .transform((val) => ({ ...val, solidSeparationInputMethod: '1' as const }))
    .meta({ title: 'Solids separation: method 1' });

const DairyMMSAllocationLivestockMethod2Schema =
  DairyMMSAllocationLivestockBaseSchema.extend({
    fractionSolidsSeparatedPreTreatment: numberInput(
      (val) => realNumber(val),
      {
        name: 'SSj',
        method: '2',
        description:
          'Fraction of volatile solids separated by pre-treatment of manure (applicable to anaerobic lagoons only).',
        modules: [MANURE_DAIRY_4_3],
      },
      isProportion,
    ),
  })
    .transform((val) => ({ ...val, solidSeparationInputMethod: '2' as const }))
    .meta({ title: 'Solids separation: method 2' });

const DairyMMSAllocationLivestockInputSchema = z.xor([
  DairyMMSAllocationLivestockMethod1Schema,
  DairyMMSAllocationLivestockMethod2Schema,
]);

export type DairyMMSAllocationLivestockInputTransformed = z.output<
  typeof DairyMMSAllocationLivestockInputSchema
>;

// -------- Time spent in locations --------

export const dairyTimeInLocationsInnerSchema = (location: LivestockLocation) =>
  object({
    timeSpentOnPasture: numberInput(
      (val) => realNumber(val),
      {
        name: 'fmPasture',
        method: '2',
        description: 'Fraction of time this herd spends on pasture',
        modules: dairyManureModules(location),
      },
      isProportion,
    ),
    timeSpentOnFeedpad: numberInput(
      (val) => realNumber(val),
      {
        name: 'fmFeedpad',
        method: '2',
        description: 'Fraction of time this herd spends on the feedpad',
        modules: dairyManureModules(location),
      },
      isProportion,
    ),
    timeSpentOnMilkingShed: numberInput(
      (val) => realNumber(val),
      {
        name: 'fmMilkingShed',
        method: '2',
        description: 'Fraction of time this herd spends in the milking shed',
        modules: dairyManureModules(location),
      },
      isProportion,
    ),
  }).superRefine(
    (
      { timeSpentOnFeedpad, timeSpentOnMilkingShed, timeSpentOnPasture },
      context,
    ) => {
      const totalTime = sum([
        timeSpentOnFeedpad,
        timeSpentOnMilkingShed,
        timeSpentOnPasture,
      ]);
      if (!totalTime.unit.store.value.eq(1)) {
        context.addIssue({
          code: 'custom',
          message:
            'Proportions of time spent in each location must add up to exactly 1.',
        });
      }
    },
  );

/**
 * Wraps a set of dairy herd fields in the exclusive choice between giving time spent in
 * locations by production system (method 1) or as measured proportions (method 2).
 * Time in locations drives manure allocation, so it is read by both dairy manure
 * management (4.3) and the chapter 5 nitrogen calculation.
 */
export const withDairyTimeInLocations = <S extends z.ZodRawShape>(
  fields: z.ZodObject<S, z.core.$strict>,
  location: LivestockLocation,
) =>
  z.xor([
    fields
      .extend({
        system: enumInput(DairySystems, {
          name: 'Dairy production system',
          description: 'Production system used to manage this dairy herd',
          modules: dairyManureModules(location),
        }),
      })
      .transform((val) => ({
        ...val,
        timeSpentInLocationsInputMethod: '1' as const,
      }))
      .meta({ title: 'Time in locations: method 1 (production system)' }),
    fields
      .extend({
        method2TimeSpentInLocations: dairyTimeInLocationsInnerSchema(location),
      })
      .transform((val) => ({
        ...val,
        timeSpentInLocationsInputMethod: '2' as const,
      }))
      .meta({ title: 'Time in locations: method 2 (measured proportions)' }),
  ]);

// -------- Herd --------

/**
 * Keys of a dairy herd read both by dairy enteric methane (3.3) / manure management
 * (4.3) and, when the herd's manure is applied as organic fertiliser, by the chapter 5
 * nitrogen calculation (`calculateMassOfNitrogenAppliedToSoilsForDairyHerd`). The
 * livestock scenario reads more of `manureAllocations`, so each scenario passes its own.
 */
const dairyHerdSharedShape = <M extends z.ZodType>(
  location: LivestockLocation,
  manureAllocations: M,
) => ({
  classes: dairyClassesInputSchema(location),
  milkProduction: dairyMilkProductionInputSchema(location),
  breed: enumInput(DairyCattleBreeds, {
    name: 'Dairy herd breed',
    description: 'Breed of cattle for this dairy herd',
    modules: dairyEntericAndManureModules(location),
  }),
  manureAllocations,
  ...hasIsInLeachingZoneInputSchema(
    livestockModuleOrFertiliser(location, MANURE_DAIRY_4_3),
  ).shape,
});

/**
 * Only used for its type: helpers called from both scenarios, like
 * `calculateManureAllocations`, take `DairyHerdSharedInputTransformed`.
 */
export const dairyHerdSharedInputSchema = (location: LivestockLocation) =>
  withDairyTimeInLocations(
    object(
      dairyHerdSharedShape(
        location,
        dairyMMSAllocationSharedInputSchema(location),
      ),
    ),
    location,
  );

export type DairyHerdSharedInputTransformed = z.output<
  ReturnType<typeof dairyHerdSharedInputSchema>
>;

/**
 * The fields of a dairy herd read by dairy enteric methane (3.3) and manure management
 * (4.3), before the time in locations choice is applied. Exported so the full dairy
 * calculator herd can extend it.
 */
export const DairyHerdLivestockFieldsSchema = object({
  ...dairyHerdSharedShape('livestock', DairyMMSAllocationLivestockInputSchema),
  ...hasMethod2MeanAnnualTemperatureInputSchema(MANURE_DAIRY_4_3).shape,
  ...hasGrazingProductionSystemInputSchema(MANURE_DAIRY_4_3).shape,
  ...hasClimateZoneInputSchema(MANURE_DAIRY_4_3).shape,
  ...hasStateInputSchema([
    MANURE_DAIRY_4_3,
    RESIDUE_LEACH_6_3,
    SERVICES_15_7,
    PURCH_FUEL_15_10,
  ]).shape,
});

/**
 * A dairy herd as read by dairy enteric methane (3.3) and manure management (4.3).
 */
export const DairyHerdLivestockInputSchema = withDairyTimeInLocations(
  DairyHerdLivestockFieldsSchema,
  'livestock',
);

export type DairyHerdLivestockInput = z.input<
  typeof DairyHerdLivestockInputSchema
>;
export type DairyHerdLivestockInputTransformed = z.output<
  typeof DairyHerdLivestockInputSchema
>;

/**
 * A dairy herd whose manure is the source of an organic fertiliser application, as read
 * by the chapter 5 nitrogen calculation.
 */
export const DairyHerdFertiliserInputSchema = withDairyTimeInLocations(
  object({
    ...dairyHerdSharedShape(
      'fertiliser',
      dairyMMSAllocationSharedInputSchema('fertiliser'),
    ),
    ...HasFractionAppliedToSoilsInputSchema.shape,
  }),
  'fertiliser',
);

export type DairyHerdFertiliserInput = z.input<
  typeof DairyHerdFertiliserInputSchema
>;
export type DairyHerdFertiliserInputTransformed = z.output<
  typeof DairyHerdFertiliserInputSchema
>;
