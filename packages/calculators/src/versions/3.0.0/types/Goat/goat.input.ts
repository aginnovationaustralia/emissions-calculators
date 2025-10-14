import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { FertiliserSchema } from '../fertiliser.input';
import { MineralSupplementationSchema } from '../mineral.input';
import { ElectricitySources } from '../types';
import { GoatClassesSchema } from './goatclasses.input';

export const GoatCompleteSchema = z.object({
  id: z.string().optional().meta({ description: DESCRIPTIONS.ACTIVITY_ID }),
  classes: GoatClassesSchema,
  limestone: z.number().meta({ description: DESCRIPTIONS.LIMESTONE }),
  limestoneFraction: z
    .number()
    .meta({ description: DESCRIPTIONS.LIMESTONEFRACTION }),
  fertiliser: FertiliserSchema,
  diesel: z.number().meta({ description: DESCRIPTIONS.DIESEL }),
  petrol: z.number().meta({ description: DESCRIPTIONS.PETROL }),
  lpg: z.number().meta({ description: DESCRIPTIONS.LPG }),
  mineralSupplementation: MineralSupplementationSchema,
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
  grainFeed: z.number().meta({ description: DESCRIPTIONS.GRAINFEED }),
  hayFeed: z.number().meta({ description: DESCRIPTIONS.HAYFEED }),
  herbicide: z.number().meta({ description: DESCRIPTIONS.HERBICIDE }),
  herbicideOther: z.number().meta({ description: DESCRIPTIONS.HERBICIDEOTHER }),
});

export type GoatComplete = z.infer<typeof GoatCompleteSchema>;
