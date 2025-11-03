import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { FertiliserSchema } from '../fertiliser.input';
import { MineralSupplementationSchema } from '../mineral.input';
import { proportion, singleEnterpriseInput } from '../schemas';
import { ElectricitySources } from '../types';
import { BeefCalvingSchema } from './beefcalving.input';
import { BeefClassesSchema } from './beefclasses.input';

export const BeefCompleteSchema = singleEnterpriseInput('Beef', {
  id: z.string().optional().meta({ description: DESCRIPTIONS.ACTIVITY_ID }),
  classes: BeefClassesSchema,
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
  electricityRenewable: proportion(DESCRIPTIONS.ELECTRICITY_RENEWABLE),
  electricityUse: z
    .number()
    .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
  grainFeed: z.number().meta({ description: DESCRIPTIONS.GRAINFEED }),
  hayFeed: z.number().meta({ description: DESCRIPTIONS.HAYFEED }),
  cottonseedFeed: z.number().meta({ description: DESCRIPTIONS.COTTONSEEDFEED }),
  herbicide: z.number().meta({ description: DESCRIPTIONS.HERBICIDE }),
  herbicideOther: z.number().meta({ description: DESCRIPTIONS.HERBICIDEOTHER }),
  cowsCalving: BeefCalvingSchema,
});

export type BeefComplete = z.infer<typeof BeefCompleteSchema>;
