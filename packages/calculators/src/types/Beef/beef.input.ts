import { ElectricitySources } from '@/types/enums';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { FertiliserSchema } from '../fertiliser.input';
import { MineralSupplementationSchema } from '../mineral.input';
import { proportion, singleEnterpriseInput } from '../schemas';
import { BeefCalvingSchema } from './beefcalving.input';
import { BeefClassesSchema } from './beefclasses.input';

export const BeefCompleteSchema = singleEnterpriseInput('Beef', {
  classes: BeefClassesSchema,
  limestone: z.number().min(0).meta({ description: DESCRIPTIONS.LIMESTONE }),
  limestoneFraction: proportion(DESCRIPTIONS.LIMESTONEFRACTION),
  fertiliser: FertiliserSchema,
  diesel: z.number().min(0).meta({ description: DESCRIPTIONS.DIESEL }),
  petrol: z.number().min(0).meta({ description: DESCRIPTIONS.PETROL }),
  lpg: z.number().min(0).meta({ description: DESCRIPTIONS.LPG }),
  mineralSupplementation: MineralSupplementationSchema,
  electricitySource: z
    .enum(ElectricitySources)
    .meta({ description: DESCRIPTIONS.ELECTRICITY_SOURCE }),
  electricityRenewable: proportion(DESCRIPTIONS.ELECTRICITY_RENEWABLE),
  electricityUse: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
  grainFeed: z.number().min(0).meta({ description: DESCRIPTIONS.GRAINFEED }),
  hayFeed: z.number().min(0).meta({ description: DESCRIPTIONS.HAYFEED }),
  cottonseedFeed: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.COTTONSEEDFEED }),
  herbicide: z.number().min(0).meta({ description: DESCRIPTIONS.HERBICIDE }),
  herbicideOther: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.HERBICIDEOTHER }),
  cowsCalving: BeefCalvingSchema,
});

export type BeefComplete = z.infer<typeof BeefCompleteSchema>;
