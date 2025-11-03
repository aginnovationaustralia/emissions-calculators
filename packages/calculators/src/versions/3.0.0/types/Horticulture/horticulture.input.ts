import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { deprecated, singleEnterpriseInput } from '../schemas';
import { HorticultureCropTypes } from '../types';
import { HorticultureRefrigerantSchema } from './refrigerant.input';

export const HorticultureCropSchema = singleEnterpriseInput('Horticulture', {
  id: z.string().optional().meta({ description: DESCRIPTIONS.ACTIVITY_ID }),
  type: z.enum(HorticultureCropTypes).meta({ description: 'Crop type' }),
  averageYield: z
    .number()
    .meta({ description: 'Average crop yield, in t/ha (tonnes per hectare)' }),
  areaSown: z.number().meta({ description: 'Area sown, in ha (hectares)' }),
  ureaApplication: z.number().meta({
    description:
      'Urea application, in kg Urea/ha (kilograms of urea per hectare)',
  }),
  nonUreaNitrogen: z.number().meta({
    description:
      'Non-urea nitrogen application, in kg N/ha (kilograms of nitrogen per hectare)',
  }),
  ureaAmmoniumNitrate: z.number().meta({
    description:
      'Urea-Ammonium nitrate application, in kg product/ha (kilograms of product per hectare)',
  }),
  phosphorusApplication: z.number().meta({
    description:
      'Phosphorus application, in kg P/ha (kilograms of phosphorus per hectare)',
  }),
  potassiumApplication: z.number().meta({
    description:
      'Potassium application, in kg K/ha (kilograms of potassium per hectare)',
  }),
  sulfurApplication: z.number().meta({
    description:
      'Sulfur application, in kg S/ha (kilograms of sulfur per hectare)',
  }),
  rainfallAbove600: z
    .boolean()
    .meta({ description: DESCRIPTIONS.RAINFALLIRRIGATIONABOVE600 }),
  ureaseInhibitorUsed: z
    .boolean()
    .optional()
    .meta(deprecated('Urease inhibitor used', 'No longer used (since v1.1.0)')),
  nitrificationInhibitorUsed: z
    .boolean()
    .optional()
    .meta(
      deprecated(
        'Nitrification inhibitor used',
        'No longer used (since v1.1.0)',
      ),
    ),
  fractionOfAnnualCropBurnt: z.number().meta({
    description:
      'Fraction of annual production of crop that is burnt, from 0 to 1',
  }),
  herbicideUse: z.number().meta({
    description:
      'Total amount of active ingredients from general herbicide/pesticide use, in kg (kilogram)',
  }),
  glyphosateOtherHerbicideUse: z.number().meta({
    description:
      'Total amount of active ingredients from other herbicide use (Paraquat, Diquat, Glyphosate), in kg (kilogram)',
  }),
  electricityAllocation: z.number().meta({
    description:
      'Percentage of electricity use to allocate to this crop, from 0 to 1',
  }),
  limestone: z.number().meta({ description: DESCRIPTIONS.LIMESTONE }),
  limestoneFraction: z
    .number()
    .meta({ description: DESCRIPTIONS.LIMESTONEFRACTION }),
  dieselUse: z.number().meta({ description: DESCRIPTIONS.DIESEL }),
  petrolUse: z.number().meta({ description: DESCRIPTIONS.PETROL }),
  lpg: z.number().meta({ description: DESCRIPTIONS.LPG }),
  refrigerants: z.array(HorticultureRefrigerantSchema),
});

export type HorticultureCrop = z.infer<typeof HorticultureCropSchema>;
