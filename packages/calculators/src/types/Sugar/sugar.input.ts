import { ProductionSystems, States } from '@/types/enums';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { proportion, singleEnterpriseInput } from '../schemas';

export const SugarCropSchema = singleEnterpriseInput('Sugar', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  productionSystem: z
    .enum(ProductionSystems)
    .meta({ description: 'Production system of this crop' }),
  averageCaneYield: z.number().min(0).meta({
    description: 'Average cane/crop yield, in t/ha (tonnes per hectare)',
  }),
  percentMilledCaneYield: proportion(
    'Percentage of cane yield that becomes milled sugar, from 0 to 1',
  ).optional(),
  areaSown: z
    .number()
    .min(0)
    .meta({ description: 'Area sown, in ha (hectares)' }),
  nonUreaNitrogen: z.number().min(0).meta({
    description:
      'Non-urea nitrogen application, in kg N/ha (kilograms of nitrogen per hectare)',
  }),
  ureaApplication: z.number().min(0).meta({
    description:
      'Urea nitrogen application, in kg Urea/ha (kilograms of urea per hectare)',
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
  rainfallAbove600: z
    .boolean()
    .meta({ description: DESCRIPTIONS.RAINFALLIRRIGATIONABOVE600 }),
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

export type SugarCrop = z.infer<typeof SugarCropSchema>;
