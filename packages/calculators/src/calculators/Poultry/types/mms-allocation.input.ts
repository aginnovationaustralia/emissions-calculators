import { PoultryMMS1Type } from '@/constants/enums';
import { poultryManureModules } from '@/modules/scope1/shared/poultry/modules';
import { isProportion, numberInput } from '@/tools/inputs';
import { LivestockLocation } from '@/tools/modules';
import { realNumber } from '@/tools/units';
import { object } from '@/types/schemas';
import z from 'zod';

const poultryMMS2AllocationInputSchema = (
  location: LivestockLocation,
  sourceDescription: string,
) =>
  object({
    solidStorage: numberInput(
      (val) => realNumber(val),
      {
        name: 'MMSm=4T=2',
        description: `Fraction of manure from ${sourceDescription} that was then stored in solid storage`,
        modules: poultryManureModules(location),
      },
      isProportion,
    ),
    composting: numberInput(
      (val) => realNumber(val),
      {
        name: 'MMSm=6T=2',
        description: `Fraction of manure from ${sourceDescription} that was then composted`,
        modules: poultryManureModules(location),
      },
      isProportion,
    ),
    digester: numberInput(
      (val) => realNumber(val),
      {
        name: 'MMSm=7T=2',
        description: `Fraction of manure from ${sourceDescription} that was then treated in a digester/covered anaerobic lagoon`,
        modules: poultryManureModules(location),
      },
      isProportion,
    ),
    directProcessing: numberInput(
      (val) => realNumber(val),
      {
        name: 'MMSm=12T=2',
        description: `Fraction of manure from ${sourceDescription} that was then processed directly`,
        modules: poultryManureModules(location),
      },
      isProportion,
    ),
    directApplication: numberInput(
      (val) => realNumber(val),
      {
        name: 'MMSm=13T=2',
        description: `Fraction of manure from ${sourceDescription} that was then applied directly to soil`,
        modules: poultryManureModules(location),
      },
      isProportion,
    ),
  });

export type PoultryMMS2AllocationInput = z.input<
  ReturnType<typeof poultryMMS2AllocationInputSchema>
>;
export type PoultryMMS2AllocationInputTransformed = z.output<
  ReturnType<typeof poultryMMS2AllocationInputSchema>
>;

const poultryMMS1InnerAllocationInputSchema = (
  location: LivestockLocation,
  sourceDescription: string,
  keyName: PoultryMMS1Type,
  m: '10' | '11a' | '11b' | '14',
) =>
  object({
    manureAllocated: numberInput(
      (val) => realNumber(val),
      {
        name: `MMSjm=${m}T=1`,
        description: `Fraction of manure initially ${sourceDescription}`,
        modules: poultryManureModules(location),
      },
      isProportion,
    ),
    treatmentStage2Allocations: poultryMMS2AllocationInputSchema(
      location,
      sourceDescription,
    ),
  })
    .superRefine(({ manureAllocated, treatmentStage2Allocations }, ctx) => {
      // No need to enforce further validation if 0 manure allocated to this system, so the
      // user doesn't have to make up values that sum to 1
      if (manureAllocated.unit.store.value.eq(0)) return;

      const {
        solidStorage,
        composting,
        digester,
        directProcessing,
        directApplication,
      } = treatmentStage2Allocations;

      const total = solidStorage
        .plus(composting)
        .plus(digester)
        .plus(directProcessing)
        .plus(directApplication);

      if (!total.unit.store.value.eq(1)) {
        ctx.addIssue(
          `A non-zero fraction of manure was allocated to ${sourceDescription} (manureAllocations.${keyName}.manureAllocated), so the values of manureAllocations.${keyName}.treatmentStage2Allocations need to sum exactly to 1.`,
        );
      }
    })
    .meta({
      description: `Describe any manure that was managed in ${sourceDescription}, and where that manure was managed after being treated initially. If any manure entered this system, the allocations of manure out of this system must add to 1.`,
    });

export const poultryMMSAllocationInputSchema = (location: LivestockLocation) =>
  object({
    manureWithLitter: poultryMMS1InnerAllocationInputSchema(
      location,
      'managed with litter',
      'manureWithLitter',
      '10',
    ),
    beltManureRemoval: poultryMMS1InnerAllocationInputSchema(
      location,
      'managed through belt manure removal',
      'beltManureRemoval',
      '11a',
    ),
    manureStoredInHouse: poultryMMS1InnerAllocationInputSchema(
      location,
      'stored in house',
      'manureStoredInHouse',
      '11b',
    ),
    pastureRangeAndPaddock: numberInput(
      (val) => realNumber(val),
      {
        name: `MMSjm=14T=1`,
        description: `Fraction of manure deposited directly onto pasture range/paddock`,
        modules: poultryManureModules(location),
      },
      isProportion,
    ),
  }).superRefine(
    (
      {
        manureWithLitter,
        manureStoredInHouse,
        beltManureRemoval,
        pastureRangeAndPaddock,
      },
      ctx,
    ) => {
      const total = manureWithLitter.manureAllocated
        .plus(manureStoredInHouse.manureAllocated)
        .plus(beltManureRemoval.manureAllocated)
        .plus(pastureRangeAndPaddock);

      if (!total.unit.store.value.eq(1)) {
        ctx.addIssue(
          `Allocations to each primary manure system must sum exactly to 1. Make sure the following inputs add to 1: manureWithLitter.manureAllocated, beltManureRemoval.manureAllocated, manureStoredInHouse.manureAllocated, pastureRangeAndPaddock.`,
        );
      }
    },
  );

export type PoultryMMSAllocationInput = z.input<
  ReturnType<typeof poultryMMSAllocationInputSchema>
>;
export type PoultryMMSAllocationInputTransformed = z.output<
  ReturnType<typeof poultryMMSAllocationInputSchema>
>;
