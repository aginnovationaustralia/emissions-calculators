import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { FertiliserSchema } from '../fertiliser.input';
import { proportion, singleEnterpriseInput } from '../schemas';
import { ElectricitySources } from '../types';
import { DeerClassesSchema } from './deerclasses.input';
import { DoesFawningProportionSchema } from './fawningproportion.input';
import { SeasonalFawningRatesSchema } from './seasonalfawning.input';

export const DeerCompleteSchema = singleEnterpriseInput('Deer', {
  classes: DeerClassesSchema,
  limestone: z.number().meta({ description: DESCRIPTIONS.LIMESTONE }),
  limestoneFraction: proportion(DESCRIPTIONS.LIMESTONEFRACTION),
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
  doesFawning: DoesFawningProportionSchema,
  seasonalFawning: SeasonalFawningRatesSchema,
});

export type DeerComplete = z.infer<typeof DeerCompleteSchema>;
