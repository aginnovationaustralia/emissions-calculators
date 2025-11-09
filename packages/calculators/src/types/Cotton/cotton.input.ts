import { CustomisedFertilisers, States } from '@/types/types';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { deprecated, proportion, singleEnterpriseInput } from '../schemas';

export const CottonCropSchema = singleEnterpriseInput('Cotton', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  averageCottonYield: z.number().meta({
    description: 'Average cotton yield, in t/ha (tonnes per hectare)',
  }),
  areaSown: z.number().meta({ description: 'Area sown, in ha (hectares)' }),
  averageWeightPerBaleKg: z.number().meta({
    description: 'Average weight of unprocessed cotton per bale, in kg',
  }),
  cottonLintPerBaleKg: z
    .number()
    .meta({ description: 'Average weight of cotton lint per bale, in kg' }),
  cottonSeedPerBaleKg: z.number().meta({
    description: 'Average weight of cotton seed produced per bale, in kg',
  }),
  wastePerBaleKg: z.number().meta({
    description: 'Average weight of cotton waste produced per bale, in kg',
  }),
  ureaApplication: z.number().meta({
    description:
      'Urea application, in kg Urea/ha (kilograms of urea per hectare)',
  }),
  otherFertiliserType: z
    .enum(CustomisedFertilisers)
    .optional()
    .meta(deprecated('Other N fertiliser type')),
  otherFertiliserApplication: z.number().meta({
    description:
      'Other N fertiliser application, in kg/ha (kilograms per hectare)',
  }),
  nonUreaNitrogen: z.number().default(0).meta({
    description:
      'Non-urea nitrogen application, in kg N/ha (kilograms of nitrogen per hectare)',
  }),
  ureaAmmoniumNitrate: z.number().default(0).meta({
    description:
      'Urea-Ammonium nitrate application, in kg product/ha (kilograms of product per hectare)',
  }),
  phosphorusApplication: z.number().default(0).meta({
    description:
      'Phosphorus application, in kg P/ha (kilograms of phosphorus per hectare)',
  }),
  potassiumApplication: z.number().default(0).meta({
    description:
      'Potassium application, in kg K/ha (kilograms of potassium per hectare)',
  }),
  sulfurApplication: z.number().default(0).meta({
    description:
      'Sulfur application, in kg S/ha (kilograms of sulfur per hectare)',
  }),
  singleSuperPhosphate: z.number().meta({
    description: 'Single superphosphate use, in kg/ha (kilograms per hectare)',
  }),
  rainfallAbove600: z
    .boolean()
    .meta({ description: DESCRIPTIONS.RAINFALLIRRIGATIONABOVE600 }),
  fractionOfAnnualCropBurnt: z
    .number()
    .default(0)
    .meta(
      deprecated(
        'Fraction of annual production of crop that is burnt. If included, this should only ever be 0 for cotton',
      ),
    ),
  herbicideUse: z.number().meta({
    description:
      'Total amount of active ingredients from general herbicide/pesticide use, in kg (kilogram)',
  }),
  glyphosateOtherHerbicideUse: z.number().meta({
    description:
      'Total amount of active ingredients from other herbicide use (Paraquat, Diquat, Glyphosate), in kg (kilogram)',
  }),
  electricityAllocation: proportion(
    'Percentage of electricity use to allocate to this crop, from 0 to 1',
  ),
  limestone: z.number().meta({ description: DESCRIPTIONS.LIMESTONE }),
  limestoneFraction: proportion(DESCRIPTIONS.LIMESTONEFRACTION),
  dieselUse: z.number().meta({ description: DESCRIPTIONS.DIESEL }),
  petrolUse: z.number().meta({ description: DESCRIPTIONS.PETROL }),
  lpg: z.number().meta({ description: DESCRIPTIONS.LPG }),
});

export type CottonCrop = z.infer<typeof CottonCropSchema>;
