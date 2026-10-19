import { LivestockLocation } from '@/tools/modules';
import { object } from '@/types/schemas';
import z from 'zod';
import {
  PoultryLayersLivestockInputSchema,
  poultryLayersSharedInputSchema,
  PoultryMeatChickenBreedersLivestockInputSchema,
  poultryMeatChickenBreedersSharedInputSchema,
  PoultryMeatChickenGrowersLivestockInputSchema,
  poultryMeatChickenGrowersSharedInputSchema,
  PoultryMeatOtherLivestockInputSchema,
  poultryMeatOtherSharedInputSchema,
} from './poultry-class.input';

export const poultryClassesSharedInputSchema = (location: LivestockLocation) =>
  object({
    layers: poultryLayersSharedInputSchema(location).optional(),
    meatChickenGrowers:
      poultryMeatChickenGrowersSharedInputSchema(location).optional(),
    meatChickenBreeders:
      poultryMeatChickenBreedersSharedInputSchema(location).optional(),
    meatOther: poultryMeatOtherSharedInputSchema(location).optional(),
  });

export type PoultryClassesSharedInput = z.input<
  ReturnType<typeof poultryClassesSharedInputSchema>
>;

export const PoultryClassesLivestockInputSchema = object({
  layers: PoultryLayersLivestockInputSchema.optional(),
  meatChickenGrowers: PoultryMeatChickenGrowersLivestockInputSchema.optional(),
  meatChickenBreeders:
    PoultryMeatChickenBreedersLivestockInputSchema.optional(),
  meatOther: PoultryMeatOtherLivestockInputSchema.optional(),
});

export type PoultryClassesLivestockInput = z.input<
  typeof PoultryClassesLivestockInputSchema
>;
