import { LivestockLocation } from '@/tools/modules';
import { object } from '@/types/schemas';
import z from 'zod';
import {
  PigsBoarsLivestockInputSchema,
  pigsBoarsSharedInputSchema,
  PigsGiltsLivestockInputSchema,
  pigsGiltsSharedInputSchema,
  PigsSlaughterPigsLivestockInputSchema,
  pigsSlaughterPigsSharedInputSchema,
  PigsSowsLivestockInputSchema,
  pigsSowsSharedInputSchema,
} from './pigs-class.input';

export const pigsHerdClassesSharedInputSchema = (location: LivestockLocation) =>
  object({
    boars: pigsBoarsSharedInputSchema(location).optional(),
    sows: pigsSowsSharedInputSchema(location).optional(),
    gilts: pigsGiltsSharedInputSchema(location).optional(),
    slaughterPigs: pigsSlaughterPigsSharedInputSchema(location).optional(),
  });

export const PigsHerdClassesLivestockInputSchema = object({
  boars: PigsBoarsLivestockInputSchema.optional(),
  sows: PigsSowsLivestockInputSchema.optional(),
  gilts: PigsGiltsLivestockInputSchema.optional(),
  slaughterPigs: PigsSlaughterPigsLivestockInputSchema.optional(),
}).meta({ id: 'PigsHerdClassesInput' });

export type PigsHerdClassesLivestockInput = z.input<
  typeof PigsHerdClassesLivestockInputSchema
>;
