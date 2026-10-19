import { IBRA7Regions } from '@/constants';
import {
  CropOnlyProductionSystems,
  PastureOnlyProductionSystems,
} from '@/constants/enums';
import { LandUseChangeActivityInputSchema } from '@/modules/lulucf/land-use-change-activity-input';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const TreeSpeciesNames = [
  'Environmental plantings',
  'Mallee eucalypt species',
  'Native Species Regeneration <500mm rainfall',
  'Native Species Regeneration >=500mm rainfall',
] as const;
export type TreeSpeciesName = (typeof TreeSpeciesNames)[number];

export const InitialTreeAgeDefaults = {
  'Environmental plantings': { maxTreeAge: 12, averageTreeAge: 12 },
  'Mallee eucalypt species': { maxTreeAge: 0, averageTreeAge: 0 },
  'Native Species Regeneration <500mm rainfall': {
    maxTreeAge: 9999,
    averageTreeAge: 9999,
  },
  'Native Species Regeneration >=500mm rainfall': {
    maxTreeAge: 9999,
    averageTreeAge: 9999,
  },
} as const satisfies Record<
  TreeSpeciesName,
  { maxTreeAge: number; averageTreeAge: number }
>;

const initialTreesSchemaForSpecies = <T extends TreeSpeciesName>(
  speciesName: T,
) => {
  const { maxTreeAge, averageTreeAge } = InitialTreeAgeDefaults[speciesName];
  return object({
    speciesName: z.literal(speciesName),
    maxTreeAge: z.number().default(maxTreeAge),
    averageTreeAge: z.number().default(averageTreeAge),
  })
    .superRefine((data, ctx) => {
      if (data.maxTreeAge < data.averageTreeAge) {
        ctx.addIssue({
          code: 'custom',
          message: 'Max tree age must be greater than average tree age',
        });
      }
    })
    .meta({ title: speciesName });
};

type InitialTreesSchemaForSpecies = ReturnType<
  typeof initialTreesSchemaForSpecies
>;

export const InitialTreesSchema = z.discriminatedUnion(
  'speciesName',
  TreeSpeciesNames.map(initialTreesSchemaForSpecies) as [
    InitialTreesSchemaForSpecies,
    InitialTreesSchemaForSpecies,
    InitialTreesSchemaForSpecies,
    InitialTreesSchemaForSpecies,
  ],
);

export type FullCAMInitialTreesInput = z.input<typeof InitialTreesSchema>;
export type FullCAMInitialTreesInputTransformed = z.output<
  typeof InitialTreesSchema
>;

const PlantingEventSchema = object({
  speciesName: z.enum(TreeSpeciesNames),
  plantingDate: z.iso.date().transform((v) => new Date(v)),
  shape: z.enum(['BeltLt1500SPH', 'BeltGt1500SPH', 'Block']),
});

export const UsesAfterClearing = ['crops', 'pasture', 'settlement'];
export type UseAfterClearing = (typeof UsesAfterClearing)[number];

const ClearingEventBaseSchema = object({
  clearingDate: z.iso.date().transform((v) => new Date(v)),
  percentThinned: z.number().min(0).max(100),
  percentMassRecoveredAsProducts: z.number().min(0).max(100),
});

const ClearingEventCropSchema = ClearingEventBaseSchema.safeExtend({
  useAfterClearing: z.literal('crops'),
  cropProductionSystem: z.enum(CropOnlyProductionSystems),
}).meta({ title: 'Cleared to crops' });

const ClearingEventPastureSchema = ClearingEventBaseSchema.safeExtend({
  useAfterClearing: z.literal('pasture'),
  pastureProductionSystem: z.enum(PastureOnlyProductionSystems),
}).meta({ title: 'Cleared to pasture' });

const ClearingEventSettlementSchema = ClearingEventBaseSchema.safeExtend({
  useAfterClearing: z.literal('settlement'),
}).meta({ title: 'Cleared to settlements' });

const ClearingEventSchema = z.discriminatedUnion('useAfterClearing', [
  ClearingEventCropSchema,
  ClearingEventPastureSchema,
  ClearingEventSettlementSchema,
]);

const WildfireEventSchema = object({
  fireDate: z.iso.date().transform((v) => new Date(v)),
  percentBurned: z.number().min(0).max(100),
  treesKilled: z.boolean().meta({ description: 'Were trees killed?' }),
});

const PrescribedBurnEventSchema = object({
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
  // chapter 16 1.4 "An activity area must be a minimum of 0.2 hectares"
  areaHectares: z.number().min(0.2),
  startYear: z.number(),
  startMonth: z.number(),
  endYear: z.number(),
  endMonth: z.number(),
  plantingEvents: z.array(PlantingEventSchema),
  wildfireEvents: z.array(WildfireEventSchema),
  prescribedBurnEvents: z.array(PrescribedBurnEventSchema),
});

// Clearing events are only considered valid by FullCAM if trees were already in place
export const FullCAMClearableAreaSchema = FullCAMBaseAreaSchema.extend({
  isInLeachingZone: z.boolean(),
  initialTrees: InitialTreesSchema,
  clearingEvent: ClearingEventSchema.optional(),
}).meta({ title: 'Clearable area (existing trees)' });

export const FullCAMUnclearableAreaSchema = FullCAMBaseAreaSchema.extend({
  initialTrees: z.literal(false),
}).meta({ title: 'Unclearable area (no existing trees)' });

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

export const FullCAMInputsSchema = object({
  areas: LULUCFWithFullCAMInputSchema,
}).meta({
  description:
    'Supply inputs for a FullCAM simulation. The details of land use activity are supplied in a simplified format, and the areas are passed to the FullCAM API and simulated for the user. Results from FullCAM are then returned, ready for emissions calculations',
});

export type FullCAMInputs = z.input<typeof FullCAMInputsSchema>;

export const FullCAMResultsSchema = object({
  activities: z.array(LandUseChangeActivityInputSchema),
}).meta({
  description:
    'A set of activity areas, ready to be supplied to an emissions calculator',
});

export type FullCAMResults = z.input<typeof FullCAMResultsSchema>;
