import { TruckTypes } from '@/types/enums';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { FertiliserSchema } from '../fertiliser.input';
import { proportion, singleEnterpriseInput } from '../schemas';
import { AreaUsedSchema } from './area.input';
import { DairyClassesSchema } from './dairyclasses.input';
import { ManureManagementSchema } from './manure.input';
import { SeasonalFertiliserSchema } from './seasonalfertiliser.input';

export const DairyCompleteSchema = singleEnterpriseInput('Dairy', {
  classes: DairyClassesSchema,
  limestone: z.number().min(0).meta({ description: DESCRIPTIONS.LIMESTONE }),
  limestoneFraction: proportion(DESCRIPTIONS.LIMESTONEFRACTION),
  fertiliser: FertiliserSchema,
  seasonalFertiliser: SeasonalFertiliserSchema,
  areas: AreaUsedSchema,
  diesel: z.number().min(0).meta({ description: DESCRIPTIONS.DIESEL }),
  petrol: z.number().min(0).meta({ description: DESCRIPTIONS.PETROL }),
  lpg: z.number().min(0).meta({ description: DESCRIPTIONS.LPG }),
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
  manureManagementMilkingCows: ManureManagementSchema,
  manureManagementOtherDairyCows: ManureManagementSchema,
  emissionsAllocationToRedMeatProduction: proportion(
    'Allocation as a fraction, from 0 to 1',
  ),
  truckType: z
    .enum(TruckTypes)
    .meta({ description: 'Type of truck used for cattle transport' }),
  distanceCattleTransported: z.number().min(0).meta({
    description:
      'Distance cattle are transported between farms, in km (kilometres)',
  }),
});

export type DairyComplete = z.infer<typeof DairyCompleteSchema>;
