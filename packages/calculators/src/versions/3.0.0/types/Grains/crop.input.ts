import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { proportion, singleEnterpriseInput } from '../schemas';
import { CropTypes, ProductionSystems, States } from '../types';

export const GrainsCropSchema = singleEnterpriseInput('Grains', {
  type: z.enum(CropTypes).meta({
    description:
      "Crop type. Note that the following crop types are now deprecated, the relevant full calculator should be used instead: 'Cotton', 'Rice', 'Sugar Cane'",
  }),
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  productionSystem: z.enum(ProductionSystems).meta({
    description:
      "Production system of this crop. Note that the following production systems are now deprecated, the relevant full calculator should be used instead: 'Cotton', 'Rice', 'Sugar cane'",
  }),
  averageGrainYield: z
    .number()
    .meta({ description: 'Average grain yield, in t/ha (tonnes per hectare)' }),
  areaSown: z.number().meta({ description: 'Area sown, in ha (hectares)' }),
  nonUreaNitrogen: z.number().meta({
    description:
      'Non-urea nitrogen application, in kg N/ha (kilograms of nitrogen per hectare)',
  }),
  ureaApplication: z.number().meta({
    description:
      'Urea nitrogen application, in kg Urea/ha (kilograms of urea per hectare)',
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
  limestoneFraction: proportion(DESCRIPTIONS.LIMESTONEFRACTION),
  dieselUse: z.number().meta({ description: DESCRIPTIONS.DIESEL }),
  petrolUse: z.number().meta({ description: DESCRIPTIONS.PETROL }),
  lpg: z.number().meta({ description: DESCRIPTIONS.LPG }),
});

export type GrainsCrop = z.infer<typeof GrainsCropSchema>;
