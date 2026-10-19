import { pigsManureModules } from '@/modules/scope1/shared/pigs/modules';
import { booleanInput, isProportion, numberInput } from '@/tools/inputs';
import { LivestockLocation, MANURE_PIGS_4_5 } from '@/tools/modules';
import { realNumber } from '@/tools/units';
import { object } from '@/types/schemas';
import z from 'zod';

const createSecondaryManureAllocationSchema = (
  manureSource: string,
  location: LivestockLocation,
) =>
  object({
    directApplication: numberInput(
      (val) => realNumber(val),
      {
        name: `MMSjm=13T=2`,
        description: `Fraction of manure initially managed in ${manureSource} that was then directly applied to soil.`,
        modules: pigsManureModules(location),
      },
      isProportion,
    ),
    anaerobicLagoon: numberInput(
      (val) => realNumber(val),
      {
        name: `MMSjm=1T=2`,
        description: `Fraction of manure initially managed in ${manureSource} that was then treated in an uncovered anaerobic lagoon.`,
        modules: pigsManureModules(location),
      },
      isProportion,
    ),
    digester: numberInput(
      (val) => realNumber(val),
      {
        name: `MMSjm=7T=2`,
        description: `Fraction of manure initially managed in ${manureSource} that was then treated in a digester/covered anaerobic lagoon.`,
        modules: pigsManureModules(location),
      },
      isProportion,
    ),
    pitStorage: numberInput(
      (val) => realNumber(val),
      {
        name: `MMSjm=9T=2`,
        description: `Fraction of manure initially managed in ${manureSource} that was then treated in pit storage (short hydraulic retention tank (HRT) < 1 month)`,
        modules: pigsManureModules(location),
      },
      isProportion,
    ),
    solidStorage: numberInput(
      (val) => realNumber(val),
      {
        name: `MMSjm=4T=2`,
        description:
          'Fraction of manure that was secondarily treated in solid storage.',
        modules: pigsManureModules(location),
      },
      isProportion,
    ),
  }).meta({
    description: `Describe any manure that was managed in ${manureSource}, and where that manure was managed after being treated initially. If any manure entered this system, the allocations of manure out of this system must add to 1.`,
  });

const createDeepLitterAllocationSchema = (location: LivestockLocation) =>
  object({
    manureAllocated: numberInput(
      (val) => realNumber(val),
      {
        name: `MMSjm=8T=1`,
        description:
          'Fraction of manure (excluding solids separated in pre-treatment, if solid separation occurred) that was treated in deep litter',
        modules: pigsManureModules(location),
      },
      isProportion,
    ),
    treatmentStage2Allocations: createSecondaryManureAllocationSchema(
      'deep litter',
      location,
    ),
  }).superRefine(({ manureAllocated, treatmentStage2Allocations }, ctx) => {
    if (manureAllocated.unit.store.value.eq(0)) return;

    const {
      anaerobicLagoon,
      digester,
      pitStorage,
      directApplication,
      solidStorage,
    } = treatmentStage2Allocations;

    const total = anaerobicLagoon
      .plus(solidStorage)
      .plus(digester)
      .plus(pitStorage)
      .plus(directApplication);

    if (!total.unit.store.value.eq(1)) {
      ctx.addIssue(
        `A non-zero fraction of manure was allocated to deep litter (manureAllocations.deepLitter.manureAllocated), so the values of manureAllocations.deepLitter.treatmentStage2Allocations need to sum exactly to 1.`,
      );
    }
  });

const createSolidStorageAllocationSchema = (location: LivestockLocation) =>
  object({
    manureAllocated: numberInput(
      (val) => realNumber(val),
      {
        name: `MMSjm=4T=1`,
        description:
          'Fraction of manure (excluding solids separated in pre-treatment, if solid separation occurred) that was treated in solid storage',
        modules: pigsManureModules(location),
      },
      isProportion,
    ),
    treatmentStage2Allocations: createSecondaryManureAllocationSchema(
      'solid storage',
      location,
    ).omit({ solidStorage: true }),
  }).superRefine(({ manureAllocated, treatmentStage2Allocations }, ctx) => {
    if (manureAllocated.unit.store.value.eq(0)) return;

    const { anaerobicLagoon, digester, pitStorage, directApplication } =
      treatmentStage2Allocations;

    const total = anaerobicLagoon
      .plus(pitStorage)
      .plus(digester)
      .plus(directApplication);

    if (!total.unit.store.value.eq(1)) {
      ctx.addIssue(
        `A non-zero fraction of manure was allocated to solid storage (manureAllocations.solidStorage.manureAllocated), so the values of manureAllocations.solidStorage.treatmentStage2Allocations need to sum exactly to 1.`,
      );
    }
  });

const createAnaerobicLagoonAllocationBaseSchema = (
  location: LivestockLocation,
) =>
  object({
    manureAllocated: numberInput(
      (val) => realNumber(val),
      {
        name: `MMSjm=1T=1`,
        description:
          'Fraction of manure (excluding solids separated in pre-treatment, if solid separation occurred) that was treated in an uncovered anaerobic lagoon',
        modules: pigsManureModules(location),
      },
      isProportion,
    ),
    treatmentStage2Allocations: createSecondaryManureAllocationSchema(
      'an uncovered anaerobic lagoon',
      location,
    ).omit({ anaerobicLagoon: true }),
  }).superRefine(({ manureAllocated, treatmentStage2Allocations }, ctx) => {
    if (manureAllocated.unit.store.value.eq(0)) return;

    const { digester, pitStorage, directApplication, solidStorage } =
      treatmentStage2Allocations;

    const total = solidStorage
      .plus(digester)
      .plus(pitStorage)
      .plus(directApplication);

    if (!total.unit.store.value.eq(1)) {
      ctx.addIssue(
        `A non-zero fraction of manure was allocated to uncovered anaerobic lagoons (manureAllocations.anaerobicLagoon.manureAllocated), so the values of manureAllocations.anaerobicLagoon.treatmentStage2Allocations need to sum exactly to 1.`,
      );
    }
  });

const createDigesterAllocationBaseSchema = (location: LivestockLocation) =>
  object({
    manureAllocated: numberInput(
      (val) => realNumber(val),
      {
        name: `MMSjm=7T=1`,
        description:
          'Fraction of manure (excluding solids separated in pre-treatment, if solid separation occurred) that was treated in a digester/covered anaerobic lagoon',
        modules: pigsManureModules(location),
      },
      isProportion,
    ),
    treatmentStage2Allocations: createSecondaryManureAllocationSchema(
      'a digester/covered anaerobic lagoon',
      location,
    ).omit({ digester: true }),
  }).superRefine(({ manureAllocated, treatmentStage2Allocations }, ctx) => {
    if (manureAllocated.unit.store.value.eq(0)) return;

    const { anaerobicLagoon, pitStorage, directApplication, solidStorage } =
      treatmentStage2Allocations;

    const total = anaerobicLagoon
      .plus(solidStorage)
      .plus(pitStorage)
      .plus(directApplication);

    if (!total.unit.store.value.eq(1)) {
      ctx.addIssue(
        `A non-zero fraction of manure was allocated to a digester/covered anaerobic lagoon (manureAllocations.digester.manureAllocated), so the values of manureAllocations.digester.treatmentStage2Allocations need to sum exactly to 1.`,
      );
    }
  });

const createPitStorageAllocationBaseSchema = (location: LivestockLocation) =>
  object({
    manureAllocated: numberInput(
      (val) => realNumber(val),
      {
        name: `MMSjm=9T=1`,
        description:
          'Fraction of manure (excluding solids separated in pre-treatment, if solid separation occurred) that was treated in pit storage (short hydraulic retention tank (HRT) < 1 month)',
        modules: pigsManureModules(location),
      },
      isProportion,
    ),
    treatmentStage2Allocations: createSecondaryManureAllocationSchema(
      'pit storage',
      location,
    ).omit({ pitStorage: true }),
  }).superRefine(({ manureAllocated, treatmentStage2Allocations }, ctx) => {
    if (manureAllocated.unit.store.value.eq(0)) return;

    const { anaerobicLagoon, digester, directApplication, solidStorage } =
      treatmentStage2Allocations;

    const total = anaerobicLagoon
      .plus(solidStorage)
      .plus(digester)
      .plus(directApplication);

    if (!total.unit.store.value.eq(1)) {
      ctx.addIssue(
        `A non-zero fraction of manure was allocated to pit storage (short hydraulic retention tank (HRT) < 1 month) (manureAllocations.pitStorage.manureAllocated), so the values of manureAllocations.pitStorage.treatmentStage2Allocations need to sum exactly to 1.`,
      );
    }
  });

/**
 * Adds the solids separation inputs to a liquid system allocation, as a method 1 and a
 * method 2 variant. Nitrogen separation is read by both scenarios, so it is part of the
 * shared method 2 keys. `method2LivestockShape` holds the method 2 keys only read by the
 * livestock scenario, and is empty for the fertiliser scenario.
 */
const withSolidSeparation = <S extends z.ZodRawShape, E extends z.ZodRawShape>(
  base: z.ZodObject<S, z.core.$strict>,
  location: LivestockLocation,
  nitrogenSeparationName: string,
  method2LivestockShape: E,
) => ({
  method1: object({
    ...base.shape,
    solidsSeparatedPreTreatment: booleanInput(
      'solidsSeparatedPreTreatment',
      'If solids produced by these pigs were separated by pre-treatment of manure (before flowing into the primary MMS).',
      pigsManureModules(location),
    ),
  }).transform((val) => ({ ...val, solidSeparationInputMethod: '1' as const })),
  method2: object({
    ...method2LivestockShape,
    ...base.shape,
    fractionNitrogenSeparatedPreTreatment: numberInput(
      (val) => realNumber(val),
      {
        name: nitrogenSeparationName,
        method: '2',
        description:
          'Fraction of nitrogen separated by pre-treatment of manure (before flowing into the primary MMS). PigBal may be used to support the estimation of this fraction.',
        modules: pigsManureModules(location),
      },
      isProportion,
    ),
  }).transform((val) => ({ ...val, solidSeparationInputMethod: '2' as const })),
});

/**
 * `method2LivestockShape` builds the keys added to the method 2 variant of each liquid
 * system that only the livestock scenario reads, given the name of that system's solids
 * separation input (*SSm*).
 */
const createPigsClassManureAllocationSchema = <E extends z.ZodRawShape>(
  location: LivestockLocation,
  method2LivestockShape: (solidsSeparationName: string) => E,
) => {
  // The base schema contains all the non-liquid systems.
  const base = object({
    // NOTE: This is called drylot at points in the guidelines because the constants
    // associated with drylot better represent emissions from free-range systems than
    // the constants associated with pasture range/paddock (m=14).
    outdoorAndFreeRange: numberInput(
      (val) => realNumber(val),
      {
        name: `MMSjm=5T=1`,
        description:
          'Fraction of manure (excluding solids separated in pre-treatment, if solid separation occurred) that was directly deposited outdoors.',
        modules: pigsManureModules(location),
      },
      isProportion,
    ),
    solidStorage: createSolidStorageAllocationSchema(location),
    deepLitter: createDeepLitterAllocationSchema(location),
  });

  const anaerobicLagoon = withSolidSeparation(
    createAnaerobicLagoonAllocationBaseSchema(location),
    location,
    'SNm=1',
    method2LivestockShape('SSm=1'),
  );
  const digester = withSolidSeparation(
    createDigesterAllocationBaseSchema(location),
    location,
    'SNm=7',
    method2LivestockShape('SSm=7'),
  );
  const pitStorage = withSolidSeparation(
    createPitStorageAllocationBaseSchema(location),
    location,
    'SNm=9',
    method2LivestockShape('SSm=9'),
  );

  return z.xor([
    object({
      ...base.shape,
      anaerobicLagoon: anaerobicLagoon.method1,
      digester: digester.method1,
      pitStorage: pitStorage.method1,
    }).meta({ title: 'Method 1 (solids separation flag)' }),
    object({
      ...base.shape,
      anaerobicLagoon: anaerobicLagoon.method2,
      digester: digester.method2,
      pitStorage: pitStorage.method2,
    }).meta({ title: 'Method 2 (measured fractions)' }),
  ]);
};

/**
 * Manure allocation keys read by both pigs manure management (4.5) and the chapter 5
 * nitrogen calculation.
 */
export const pigsClassManureAllocationSharedInputSchema = (
  location: LivestockLocation,
) =>
  createPigsClassManureAllocationSchema(location, () => ({})).superRefine(
    (
      {
        anaerobicLagoon,
        solidStorage,
        outdoorAndFreeRange,
        digester,
        deepLitter,
        pitStorage,
      },
      ctx,
    ) => {
      const total = anaerobicLagoon.manureAllocated
        .plus(solidStorage.manureAllocated)
        .plus(outdoorAndFreeRange)
        .plus(deepLitter.manureAllocated)
        .plus(digester.manureAllocated)
        .plus(pitStorage.manureAllocated);

      if (!total.unit.store.value.eq(1)) {
        ctx.addIssue(
          `Allocations to each primary manure system must sum exactly to 1. Make sure the following inputs add to 1: anaerobicLagoon.manureAllocated, solidStorage.manureAllocated, digester.manureAllocated, pitStorage.manureAllocated, deepLitter.manureAllocated, outdoorAndFreeRange`,
        );
      }
    },
  );

/**
 * Manure allocations as read by pigs manure management (4.5). Solids separation only
 * affects volatile solids, so its method 2 fraction is only read by pigs manure methane.
 */
export const PigsClassManureAllocationLivestockInputSchema =
  createPigsClassManureAllocationSchema(
    'livestock',
    (solidsSeparationName) => ({
      fractionSolidsSeparatedPreTreatment: numberInput(
        (val) => realNumber(val),
        {
          name: solidsSeparationName,
          method: '2',
          description:
            'Fraction of volatile solids separated by pre-treatment of manure (before flowing into the primary MMS). PigBal may be used to support the estimation of this fraction.',
          modules: [MANURE_PIGS_4_5],
        },
        isProportion,
      ),
    }),
  ).superRefine(
    (
      {
        anaerobicLagoon,
        solidStorage,
        outdoorAndFreeRange,
        digester,
        deepLitter,
        pitStorage,
      },
      ctx,
    ) => {
      const total = anaerobicLagoon.manureAllocated
        .plus(solidStorage.manureAllocated)
        .plus(outdoorAndFreeRange)
        .plus(deepLitter.manureAllocated)
        .plus(digester.manureAllocated)
        .plus(pitStorage.manureAllocated);

      if (!total.unit.store.value.eq(1)) {
        ctx.addIssue(
          `Allocations to each primary manure system must sum exactly to 1. Make sure the following inputs add to 1: anaerobicLagoon.manureAllocated, solidStorage.manureAllocated, digester.manureAllocated, pitStorage.manureAllocated, deepLitter.manureAllocated, outdoorAndFreeRange`,
        );
      }
    },
  );

export type PigsClassManureAllocationLivestockInput = z.input<
  typeof PigsClassManureAllocationLivestockInputSchema
>;
export type PigsClassManureAllocationLivestockInputTransformed = z.output<
  typeof PigsClassManureAllocationLivestockInputSchema
>;
