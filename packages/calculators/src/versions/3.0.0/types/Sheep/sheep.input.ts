import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { FertiliserSchema } from '../fertiliser.input';
import { MineralSupplementationSchema } from '../mineral.input';
import { proportion, singleEnterpriseInput } from '../schemas';
import { ElectricitySources } from '../types';
import { EwesLambingSchema } from './eweslambing.input';
import { SeasonalLambingSchema } from './seasonallambing.input';
import { SheepClassesSchema } from './sheepclasses.input';

export const SheepCompleteSchema = singleEnterpriseInput('Sheep', {
  classes: SheepClassesSchema,
  limestone: z.number().meta({ description: DESCRIPTIONS.LIMESTONE }),
  limestoneFraction: proportion(DESCRIPTIONS.LIMESTONEFRACTION),
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
  herbicide: z.number().meta({ description: DESCRIPTIONS.HERBICIDE }),
  herbicideOther: z.number().meta({ description: DESCRIPTIONS.HERBICIDEOTHER }),
  merinoPercent: z.number().meta({
    description:
      'Percent of sheep purchases that are of type Merino, from 0 to 100',
  }),
  ewesLambing: EwesLambingSchema,
  seasonalLambing: SeasonalLambingSchema,
});

export type SheepComplete = z.infer<typeof SheepCompleteSchema>;
