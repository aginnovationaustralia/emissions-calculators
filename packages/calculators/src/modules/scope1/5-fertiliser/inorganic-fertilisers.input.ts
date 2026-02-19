import {
  BasicCropProductionSystems,
  ProductionSystemsInorganicFertilisers,
} from '@/calculators/Grains/constants/enums';
import { object } from '@/types/schemas';
import { z } from 'zod';
import { InorganicFertiliserInputSchema } from './inorganic-fertiliser.input';

// REVISIT: We might want to move productionSystem up one level to the FertiliserInputSchema
const InorganicFertilisersScope1Method1InputSchema = object({
  productionSystem: z.enum(BasicCropProductionSystems).meta({
    description: 'Production system of the crop',
  }),
  applications: z.array(InorganicFertiliserInputSchema).meta({
    description: 'Inorganic fertiliser applications',
  }),
  calculationMethodScope1: z.literal('1').meta({
    description: 'Method of calculating fertiliser emissions',
  }),
});

const InorganicFertilisersScope1Method2InputSchema = object({
  productionSystem: z.enum(ProductionSystemsInorganicFertilisers).meta({
    description: 'Production system of the crop',
  }),
  applications: z.array(InorganicFertiliserInputSchema).meta({
    description: 'Inorganic fertiliser applications',
  }),
  calculationMethodScope1: z.literal('2').meta({
    description: 'Method of calculating fertiliser emissions',
  }),
});

export const InorganicFertilisersInputSchema = z.discriminatedUnion(
  'calculationMethodScope1',
  [
    InorganicFertilisersScope1Method1InputSchema,
    InorganicFertilisersScope1Method2InputSchema,
  ],
);

export type InorganicFertilisersInput = z.input<
  typeof InorganicFertilisersInputSchema
>;
export type InorganicFertilisersInputTransformed = z.output<
  typeof InorganicFertilisersInputSchema
>;

export type InorganicFertilisersScope1Method1Input = z.input<
  typeof InorganicFertilisersScope1Method1InputSchema
>;

export type InorganicFertilisersScope1Method1InputTransformed = z.output<
  typeof InorganicFertilisersScope1Method1InputSchema
>;

export type InorganicFertilisersScope1Method2Input = z.input<
  typeof InorganicFertilisersScope1Method2InputSchema
>;

export type InorganicFertilisersScope1Method2InputTransformed = z.output<
  typeof InorganicFertilisersScope1Method2InputSchema
>;
