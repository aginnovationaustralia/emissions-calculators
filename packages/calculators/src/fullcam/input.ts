import { IBRA7Regions } from '@/constants';
import { BurningInputSchema } from '@/modules/lulucf/burning-input';
import { PerennialCropInputSchema } from '@/modules/lulucf/perennial-crops-input';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const TreeSpeciesNames = [
  'Environmental Plantings',
  'Mallee eucalyptus species',
  'Native species regeneration < 500mm rainfall',
  'Native species regeneration > 500mm rainfall',
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

export const FullCAMAreaSchema = object({
  latitude: z.number(),
  longitude: z.number(),
  region: z.enum(IBRA7Regions),
  areaHectares: z.number(),
  startYear: z.number(),
  startMonth: z.number(),
  endYear: z.number(),
  endMonth: z.number(),
  plantingEvents: z.array(PlantingEventSchema),
  clearingEvents: z.array(ClearingEventSchema),
  wildfireEvents: z.array(WildfireEventSchema),
  prescribedBurnEvents: z.array(PrescribedBurnEventSchema),
  // Expose these package input keys so they can be supplied alongside minimal inputs for the FullCAM API
  savannaBurning: z.array(BurningInputSchema).optional(),
  perennialCrops: z.array(PerennialCropInputSchema).optional(),
});

export const LULUCFWithFullCAMInputSchema = z.array(FullCAMAreaSchema);

export type FullCAMAreaInput = z.input<typeof FullCAMAreaSchema>;

export type LULUCFWithFullCAMInput = z.input<
  typeof LULUCFWithFullCAMInputSchema
>;
