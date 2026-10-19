import { booleanInput, booleanInputOptional } from '@/tools/inputs';
import {
  FERTILISER_MODULES,
  LeachingZoneModules,
  WASTE_15_12,
} from '@/tools/modules';
import { object } from '@/types/schemas';
import { z } from 'zod';

const isInLeachingZoneDescription =
  'Is the activity in a leaching zone. See chapter 1.8.2 for more details on leaching zones.';

export const hasIsInLeachingZoneInputSchema = (
  module: LeachingZoneModules | 'fertiliser',
) =>
  object({
    isInLeachingZone: booleanInput(
      'isInLeachingZone',
      isInLeachingZoneDescription,
      module === 'fertiliser' ? FERTILISER_MODULES : [module],
    ),
  });

export const isInLeachingZoneInputOptional = booleanInputOptional(
  'isInLeachingZone',
  isInLeachingZoneDescription,
  [WASTE_15_12],
);

export type HasIsInLeachingZoneInput = z.input<
  ReturnType<typeof hasIsInLeachingZoneInputSchema>
>;
export type HasIsInLeachingZoneInputTransformed = z.output<
  ReturnType<typeof hasIsInLeachingZoneInputSchema>
>;

export const HasIsInLeachingZoneInputSchemaForFertiliser =
  hasIsInLeachingZoneInputSchema('fertiliser');
