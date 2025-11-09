import { z } from 'zod';
import { BeefClassSchema } from './beefclass.input';

export const BeefClassesSchema = z
  .object({
    bullsGt1: BeefClassSchema.optional().meta({
      description: 'Bulls whose age is greater than 1 year old',
    }),
    bullsGt1Traded: BeefClassSchema.optional().meta({
      description: 'Traded bulls whose age is greater than 1 year old',
    }),
    steersLt1: BeefClassSchema.optional().meta({
      description: 'Steers whose age is less than 1 year old',
    }),
    steersLt1Traded: BeefClassSchema.optional().meta({
      description: 'Traded steers whose age is less than 1 year old',
    }),
    steers1To2: BeefClassSchema.optional().meta({
      description: 'Steers whose age is between 1 and 2 years old',
    }),
    steers1To2Traded: BeefClassSchema.optional().meta({
      description: 'Traded steers whose age is between 1 and 2 years old',
    }),
    steersGt2: BeefClassSchema.optional().meta({
      description: 'Steers whose age is greater than 2 years old',
    }),
    steersGt2Traded: BeefClassSchema.optional().meta({
      description: 'Traded steers whose age is greater than 2 years old',
    }),
    cowsGt2: BeefClassSchema.optional().meta({
      description: 'Cows whose age is greater than 2 years old',
    }),
    cowsGt2Traded: BeefClassSchema.optional().meta({
      description: 'Traded cows whose age is greater than 2 years old',
    }),
    heifersLt1: BeefClassSchema.optional().meta({
      description: 'Heifers whose age is less than 1 year old',
    }),
    heifersLt1Traded: BeefClassSchema.optional().meta({
      description: 'Traded heifers whose age is less than 1 year old',
    }),
    heifers1To2: BeefClassSchema.optional().meta({
      description: 'Heifers whose age is between 1 and 2 years old',
    }),
    heifers1To2Traded: BeefClassSchema.optional().meta({
      description: 'Traded heifers whose age is between 1 and 2 years old',
    }),
    heifersGt2: BeefClassSchema.optional().meta({
      description: 'Heifers whose age is greater than 2 years old',
    }),
    heifersGt2Traded: BeefClassSchema.optional().meta({
      description: 'Traded heifers whose age is greater than 2 years old',
    }),
  })
  .meta({ description: 'Beef classes of different types and age ranges' });

export type BeefClasses = z.infer<typeof BeefClassesSchema>;
