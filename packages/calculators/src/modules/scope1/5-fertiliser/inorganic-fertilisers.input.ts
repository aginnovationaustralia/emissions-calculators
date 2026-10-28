import { numberInput } from '@/tools/inputs';
import { FERT_INORGANIC_5_1 } from '@/tools/modules';
import { hectaresToSquareMetres } from '@/tools/unit-conversion';
import { area } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';
import { InorganicFertiliserInputSchema } from './inorganic-fertiliser.input';

export const InorganicFertilisersScope1Method1InputSchema = object({
  applications: z.array(InorganicFertiliserInputSchema).meta({
    description: 'Inorganic fertiliser applications',
  }),
  calculationMethodScope1: z.literal('1').meta({
    description: 'Method of calculating fertiliser emissions',
  }),
});

export const InorganicFertilisersScope1Method2InputSchema = object({
  applications: z.array(InorganicFertiliserInputSchema).meta({
    description: 'Inorganic fertiliser applications',
  }),
  calculationMethodScope1: z.literal('2').meta({
    description: 'Method of calculating fertiliser emissions',
  }),
  areaAppliedHectares: numberInput(
    (val) => area(hectaresToSquareMetres(val)),
    {
      name: 'areaAppliedHectares',
      description:
        'Area that this application of inorganic fertiliser was applied to',
      method: '2',
      modules: [FERT_INORGANIC_5_1],
    },
    (s) => s.gt(0),
  ),
});

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
