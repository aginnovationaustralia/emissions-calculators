import {
  RicePreseasonFloodingPeriods,
  States,
  WaterRegimeSubTypes,
  WaterRegimeTypes,
} from '@/types/enums';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { proportion, singleEnterpriseInput } from '../schemas';

export const RiceCropSchema = singleEnterpriseInput('Rice', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  averageRiceYield: z
    .number()
    .min(0)
    .meta({ description: 'Average rice yield, in t/ha (tonnes per hectare)' }),
  areaSown: z
    .number()
    .min(0)
    .meta({ description: 'Area sown, in ha (hectares)' }),
  growingSeasonDays: z.number().min(0).meta({
    description: 'The length of the growing season for this crop, in days',
  }),
  waterRegimeType: z.enum(WaterRegimeTypes),
  waterRegimeSubType: z.enum(WaterRegimeSubTypes),
  ricePreseasonFloodingPeriod: z.enum(RicePreseasonFloodingPeriods),
  ureaApplication: z.number().min(0).meta({
    description:
      'Urea application, in kg Urea/ha (kilograms of urea per hectare)',
  }),
  nonUreaNitrogen: z.number().min(0).meta({
    description:
      'Non-urea nitrogen application, in kg N/ha (kilograms of nitrogen per hectare)',
  }),
  ureaAmmoniumNitrate: z.number().min(0).meta({
    description:
      'Urea-Ammonium nitrate application, in kg product/ha (kilograms of product per hectare)',
  }),
  phosphorusApplication: z.number().min(0).meta({
    description:
      'Phosphorus application, in kg P/ha (kilograms of phosphorus per hectare)',
  }),
  potassiumApplication: z.number().min(0).meta({
    description:
      'Potassium application, in kg K/ha (kilograms of potassium per hectare)',
  }),
  sulfurApplication: z.number().min(0).meta({
    description:
      'Sulfur application, in kg S/ha (kilograms of sulfur per hectare)',
  }),
  fractionOfAnnualCropBurnt: proportion(
    'Fraction of annual production of crop that is burnt, from 0 to 1',
  ),
  herbicideUse: z.number().min(0).meta({
    description:
      'Total amount of active ingredients from general herbicide/pesticide use, in kg (kilogram)',
  }),
  glyphosateOtherHerbicideUse: z.number().min(0).meta({
    description:
      'Total amount of active ingredients from other herbicide use (Paraquat, Diquat, Glyphosate), in kg (kilogram)',
  }),
  electricityAllocation: proportion(
    'Percentage of electricity use to allocate to this crop, from 0 to 1',
  ),
  limestone: z.number().min(0).meta({ description: DESCRIPTIONS.LIMESTONE }),
  limestoneFraction: proportion(DESCRIPTIONS.LIMESTONEFRACTION),
  dieselUse: z.number().min(0).meta({ description: DESCRIPTIONS.DIESEL }),
  petrolUse: z.number().min(0).meta({ description: DESCRIPTIONS.PETROL }),
  lpg: z.number().min(0).meta({ description: DESCRIPTIONS.LPG }),
});

export type RiceCrop = z.infer<typeof RiceCropSchema>;
