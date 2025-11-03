import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { FertiliserSchema } from '../fertiliser.input';
import { proportion, singleEnterpriseInput } from '../schemas';
import { TruckTypes } from '../types';
import { AreaUsedSchema } from './area.input';
import { DairyClassesSchema } from './dairyclasses.input';
import { ManureManagementSchema } from './manure.input';
import { SeasonalFertiliserSchema } from './seasonalfertiliser.input';

export const DairyCompleteSchema = singleEnterpriseInput('Dairy', {
  classes: DairyClassesSchema,
  limestone: z.number().meta({ description: DESCRIPTIONS.LIMESTONE }),
  limestoneFraction: z
    .number()
    .meta({ description: DESCRIPTIONS.LIMESTONEFRACTION }),
  fertiliser: FertiliserSchema,
  seasonalFertiliser: SeasonalFertiliserSchema,
  areas: AreaUsedSchema,
  diesel: z.number().meta({ description: DESCRIPTIONS.DIESEL }),
  petrol: z.number().meta({ description: DESCRIPTIONS.PETROL }),
  lpg: z.number().meta({ description: DESCRIPTIONS.LPG }),
  electricityRenewable: proportion(DESCRIPTIONS.ELECTRICITY_RENEWABLE),
  electricityUse: z
    .number()
    .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
  grainFeed: z.number().meta({ description: DESCRIPTIONS.GRAINFEED }),
  hayFeed: z.number().meta({ description: DESCRIPTIONS.HAYFEED }),
  cottonseedFeed: z.number().meta({ description: DESCRIPTIONS.COTTONSEEDFEED }),
  herbicide: z.number().meta({ description: DESCRIPTIONS.HERBICIDE }),
  herbicideOther: z.number().meta({ description: DESCRIPTIONS.HERBICIDEOTHER }),
  manureManagementMilkingCows: ManureManagementSchema,
  manureManagementOtherDairyCows: ManureManagementSchema,
  emissionsAllocationToRedMeatProduction: proportion(
    'Allocation as a fraction, from 0 to 1',
  ),
  truckType: z
    .enum(TruckTypes)
    .meta({ description: 'Type of truck used for cattle transport' }),
  distanceCattleTransported: z.number().meta({
    description:
      'Distance cattle are transported between farms, in km (kilometres)',
  }),
});

export type DairyComplete = z.infer<typeof DairyCompleteSchema>;
