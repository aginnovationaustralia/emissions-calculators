import {
  BasicCropProductionSystems,
  ProductionSystemsInorganicFertilisers,
} from '@/constants';
import { enumInput } from '@/tools/inputs';
import { ATMOS_DEPOSIT_5_4, FERT_INORGANIC_5_1 } from '@/tools/modules';
import { object } from '@/types/schemas';
import { z } from 'zod';
import {
  InorganicFertilisersScope1Method1InputSchema,
  InorganicFertilisersScope1Method2InputSchema,
} from './inorganic-fertilisers.input';
import { OrganicFertilisersInputSchema } from './organic-fertilisers.input';

export const FertiliserInputInorganicScope1Method1Schema = object({
  productionSystem: enumInput(BasicCropProductionSystems, {
    name: 'Crop production system',
    description: 'Production system of the crop',
    method: '1',
    modules: [FERT_INORGANIC_5_1, ATMOS_DEPOSIT_5_4],
  }),
  inorganic: InorganicFertilisersScope1Method1InputSchema,
  organic: OrganicFertilisersInputSchema,
}).meta({ title: 'Basic production system (scope 1 method 1)' });

export type FertiliserInputInorganicScope1Method1 = z.input<
  typeof FertiliserInputInorganicScope1Method1Schema
>;
export type FertiliserInputInorganicScope1Method1Transformed = z.output<
  typeof FertiliserInputInorganicScope1Method1Schema
>;

export const FertiliserInputInorganicScope1Method2Schema = object({
  productionSystem: enumInput(ProductionSystemsInorganicFertilisers, {
    name: 'Crop production system',
    description: 'Production system for specific crop types',
    method: '2',
    modules: [FERT_INORGANIC_5_1, ATMOS_DEPOSIT_5_4],
  }),
  inorganic: InorganicFertilisersScope1Method2InputSchema,
  organic: OrganicFertilisersInputSchema,
}).meta({ title: 'Specific production system (scope 1 method 2)' });

export type FertiliserInputInorganicScope1Method2 = z.input<
  typeof FertiliserInputInorganicScope1Method2Schema
>;
export type FertiliserInputInorganicScope1Method2Transformed = z.output<
  typeof FertiliserInputInorganicScope1Method2Schema
>;

/*
 * The input schema for fertiliser is quite complex. We want productionSystem to be up fairly high,
 * but the possible values must line up with the calculation method (1 or 2) chosen for inorganic fertiliser.
 * We can't use a discriminated union because the key for choosing the method is down one level in the tree.
 *
 * Explicit ZodType: organic fertiliser nests livestock manures (incl. dairy herd core), and xor-ing
 * that with the inorganic method variants hits TS7056 on declaration emit (same pattern as
 * BeefHerd / DairyHerd / GrainsCrop). Types are built from the smaller method schemas so we do not
 * ask TS to serialize the full inferred xor.
 */
export type FertiliserInput =
  FertiliserInputInorganicScope1Method1 | FertiliserInputInorganicScope1Method2;
export type FertiliserInputTransformed =
  | FertiliserInputInorganicScope1Method1Transformed
  | FertiliserInputInorganicScope1Method2Transformed;

export const FertiliserInputSchema: z.ZodType<
  FertiliserInputTransformed,
  FertiliserInput
> = z
  .xor([
    FertiliserInputInorganicScope1Method1Schema,
    FertiliserInputInorganicScope1Method2Schema,
  ])
  .meta({ id: 'FertiliserInput' });

export const isFertilisersInorganicScope1Method1 = (
  input: FertiliserInputTransformed,
): input is FertiliserInputInorganicScope1Method1Transformed => {
  return input.inorganic.calculationMethodScope1 === '1';
};

export const isFertilisersInorganicScope1Method2 = (
  input: FertiliserInputTransformed,
): input is FertiliserInputInorganicScope1Method2Transformed => {
  return input.inorganic.calculationMethodScope1 === '2';
};

export type HasFertiliserInput = { fertiliser: FertiliserInput };
export type HasFertiliserInputTransformed = {
  fertiliser: FertiliserInputTransformed;
};

export const HasFertiliserInputSchema = object({
  fertiliser: FertiliserInputSchema,
}).meta({ id: 'HasFertiliserInput' });
