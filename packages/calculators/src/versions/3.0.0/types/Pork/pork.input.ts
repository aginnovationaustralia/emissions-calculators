import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { FertiliserSchema } from '../fertiliser.input';
import { ElectricitySources } from '../types';
import { FeedSchema } from './feed.input';
import { PorkClassesSchema } from './porkclasses.input';

export const PorkCompleteSchema = z.object({
  id: z.string().optional().meta({ description: DESCRIPTIONS.ACTIVITY_ID }),
  classes: PorkClassesSchema,
  limestone: z.number().meta({ description: DESCRIPTIONS.LIMESTONE }),
  limestoneFraction: z
    .number()
    .meta({ description: DESCRIPTIONS.LIMESTONEFRACTION }),
  fertiliser: FertiliserSchema,
  diesel: z.number().meta({ description: DESCRIPTIONS.DIESEL }),
  petrol: z.number().meta({ description: DESCRIPTIONS.PETROL }),
  lpg: z.number().meta({ description: DESCRIPTIONS.LPG }),
  electricitySource: z
    .enum(ElectricitySources)
    .meta({ description: DESCRIPTIONS.ELECTRICITY_SOURCE }),
  electricityRenewable: z
    .number()
    .min(0)
    .max(1)
    .meta({ description: DESCRIPTIONS.ELECTRICITY_RENEWABLE }),
  electricityUse: z
    .number()
    .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
  herbicide: z.number().meta({ description: DESCRIPTIONS.HERBICIDE }),
  herbicideOther: z.number().meta({ description: DESCRIPTIONS.HERBICIDEOTHER }),
  beddingHayBarleyStraw: z.number().meta({
    description:
      'Hay, barley, straw, etc. purchased for pig bedding, in tonnes',
  }),
  feedProducts: z.array(FeedSchema),
});

export type PorkComplete = z.infer<typeof PorkCompleteSchema>;
