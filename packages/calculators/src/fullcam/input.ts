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
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  speciesName: z.enum(TreeSpeciesNames),
  //   areaHectares: z.number(),
  plantingDate: z.date(),
});

const ClearingEventSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  clearingDate: z.date(),
  percentThinned: z.number().min(0).max(100),
});

// TODO: Tidy extra input keys
const WildfireEventSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  //   areaBurnedHectares: z.number(),
  fireDate: z.date(),
  percentBurned: z.number().min(0).max(100),
  percentTreesKilled: z.number().min(0).max(100), // REVISIT: Haven't found a destination for this in the event template
});

const PrescribedBurnEventSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  //   areaBurnedHectares: z.number(),
  fireDate: z.date(),
  percentBurned: z.number().min(0).max(100),
});

export type FullCAMPlantingEvent = z.input<typeof PlantingEventSchema>;
export type FullCAMClearingEvent = z.input<typeof ClearingEventSchema>;
export type FullCAMWildfireEvent = z.input<typeof WildfireEventSchema>;
export type FullCAMPrescribedBurnEvent = z.input<
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
  clearingEvents: z.array(ClearingEventSchema),
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
export type FullCAMClearableAreaInput = z.input<
  typeof FullCAMClearableAreaSchema
>;
export type FullCAMUnclearableAreaInput = z.input<
  typeof FullCAMUnclearableAreaSchema
>;

export const isAreaClearable = (
  area: FullCAMAreaInput,
): area is FullCAMClearableAreaInput => {
  return 'initialTrees' in area && area.initialTrees !== false;
};

export type LULUCFWithFullCAMInput = z.input<
  typeof LULUCFWithFullCAMInputSchema
>;
