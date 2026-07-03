import { IBRA7Regions } from '@/constants';
import { BurningInputSchema } from '@/modules/lulucf/burning-input';
import { PerennialCropInputSchema } from '@/modules/lulucf/perennial-crops-input';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const TreeSpeciesNames = [
  'Environmental plantings',
  'Mallee eucalypt species',
  'Native Species Regeneration <500mm rainfall',
  'Native Species Regeneration >=500mm rainfall',
] as const;
export type TreeSpeciesName = (typeof TreeSpeciesNames)[number];

const PlantingEventSchema = z.object({
  speciesName: z.enum(TreeSpeciesNames),
  plantingDate: z.iso.date().transform((v) => new Date(v)),
});

const ClearingEventSchema = z.object({
  clearingDate: z.iso.date().transform((v) => new Date(v)),
  percentThinned: z.number().min(0).max(100),
});

const WildfireEventSchema = z.object({
  fireDate: z.iso.date().transform((v) => new Date(v)),
  percentBurned: z.number().min(0).max(100),
  percentTreesKilled: z.number().min(0).max(100), // REVISIT: Haven't found a destination for this in the event template
});

const PrescribedBurnEventSchema = z.object({
  fireDate: z.iso.date().transform((v) => new Date(v)),
  percentBurned: z.number().min(0).max(100),
});

export type FullCAMPlantingEvent = z.input<typeof PlantingEventSchema>;
export type FullCAMPlantingEventTransformed = z.output<
  typeof PlantingEventSchema
>;
export type FullCAMClearingEvent = z.input<typeof ClearingEventSchema>;
export type FullCAMClearingEventTransformed = z.output<
  typeof ClearingEventSchema
>;
export type FullCAMWildfireEvent = z.input<typeof WildfireEventSchema>;
export type FullCAMWildfireEventTransformed = z.output<
  typeof WildfireEventSchema
>;
export type FullCAMPrescribedBurnEvent = z.input<
  typeof PrescribedBurnEventSchema
>;
export type FullCAMPrescribedBurnEventTransformed = z.output<
  typeof PrescribedBurnEventSchema
>;

const FullCAMBaseAreaSchema = object({
  latitude: z.number(),
  longitude: z.number(),
  region: z.enum(IBRA7Regions),
  areaHectares: z.number(),
  startYear: z.number(),
  startMonth: z.number(),
  endYear: z.number(),
  endMonth: z.number(),
  plantingEvents: z.array(PlantingEventSchema),
  wildfireEvents: z.array(WildfireEventSchema),
  prescribedBurnEvents: z.array(PrescribedBurnEventSchema),
  // Expose these package input keys so they can be supplied alongside minimal inputs for the FullCAM API
  savannaBurning: z.array(BurningInputSchema).optional(),
  perennialCrops: z.array(PerennialCropInputSchema).optional(),
});

// Clearing events are only considered valid by FullCAM if trees were already in place
export const FullCAMClearableAreaSchema = FullCAMBaseAreaSchema.extend({
  initialTrees: object({ speciesName: z.enum(TreeSpeciesNames) }),
  clearingEvents: z.array(ClearingEventSchema).optional(),
});
export const FullCAMUnclearableAreaSchema = FullCAMBaseAreaSchema.extend({
  initialTrees: z.literal(false),
});

export const FullCAMAreaSchema = z.xor([
  FullCAMClearableAreaSchema,
  FullCAMUnclearableAreaSchema,
]);

export const LULUCFWithFullCAMInputSchema = z.array(FullCAMAreaSchema);

export type FullCAMAreaInput = z.input<typeof FullCAMAreaSchema>;
export type FullCAMAreaInputTransformed = z.output<typeof FullCAMAreaSchema>;
export type FullCAMClearableAreaInput = z.input<
  typeof FullCAMClearableAreaSchema
>;
export type FullCAMClearableAreaInputTransformed = z.output<
  typeof FullCAMClearableAreaSchema
>;
export type FullCAMUnclearableAreaInput = z.input<
  typeof FullCAMUnclearableAreaSchema
>;
export type FullCAMUnclearableAreaInputTransformed = z.output<
  typeof FullCAMUnclearableAreaSchema
>;

export const isAreaClearable = (
  area: FullCAMAreaInputTransformed,
): area is FullCAMClearableAreaInputTransformed => {
  return 'initialTrees' in area && area.initialTrees !== false;
};

export type LULUCFWithFullCAMInput = z.input<
  typeof LULUCFWithFullCAMInputSchema
>;
