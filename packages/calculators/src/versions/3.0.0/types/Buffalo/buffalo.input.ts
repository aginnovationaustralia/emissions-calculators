import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { FertiliserSchema } from '../fertiliser.input';
import { proportion, singleEnterpriseInput } from '../schemas';
import { ElectricitySources } from '../types';
import { BuffaloClassesSchema } from './buffaloclasses.input';
import { CowsCalvingProportionSchema } from './calvingproportion.input';
import { SeasonalCalvingRatesSchema } from './seasonalcalving.input';

export const BuffaloCompleteSchema = singleEnterpriseInput('Buffalo', {
  classes: BuffaloClassesSchema,
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
  electricityRenewable: proportion(DESCRIPTIONS.ELECTRICITY_RENEWABLE),
  electricityUse: z
    .number()
    .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
  grainFeed: z.number().meta({ description: DESCRIPTIONS.GRAINFEED }),
  hayFeed: z.number().meta({ description: DESCRIPTIONS.HAYFEED }),
  herbicide: z.number().meta({ description: DESCRIPTIONS.HERBICIDE }),
  herbicideOther: z.number().meta({ description: DESCRIPTIONS.HERBICIDEOTHER }),
  cowsCalving: CowsCalvingProportionSchema,
  seasonalCalving: SeasonalCalvingRatesSchema,
});

export type BuffaloComplete = z.infer<typeof BuffaloCompleteSchema>;
