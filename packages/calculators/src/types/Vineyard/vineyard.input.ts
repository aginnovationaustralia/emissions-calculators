import { ElectricitySources, States } from '@/types/enums';
import { z } from 'zod';
import { FluidWasteInputSchema } from '../common/fluid-waste.input';
import { FreightInputSchema } from '../common/freight.input';
import { SolidWasteInputSchema } from '../common/solid-waste.input';
import { DESCRIPTIONS } from '../descriptions.schema';
import { FuelInputSchema } from '../fuel.input';
import { proportion, singleEnterpriseInput } from '../schemas';

export const VineyardCropSchema = singleEnterpriseInput('Vineyard', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  rainfallAbove600: z
    .boolean()
    .meta({ description: DESCRIPTIONS.RAINFALLIRRIGATIONABOVE600 }),
  irrigated: z.boolean().meta({ description: DESCRIPTIONS.IRRIGATED }),
  areaPlanted: z
    .number()
    .meta({ description: 'Area planted, in ha (hectares)' }),
  averageYield: z
    .number()
    .meta({ description: 'Average yield, in t/ha (tonnes per hectare)' }),
  nonUreaNitrogen: z.number().meta({
    description:
      'Non-urea nitrogen application, in kg N/ha (kilograms of nitrogen per hectare)',
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
  ureaApplication: z.number().meta({
    description:
      'Urea nitrogen application, in kg Urea/ha (kilograms of urea per hectare)',
  }),
  ureaAmmoniumNitrate: z.number().meta({
    description:
      'Urea-Ammonium nitrate application, in kg product/ha (kilograms of product per hectare)',
  }),
  limestone: z.number().meta({ description: DESCRIPTIONS.LIMESTONE }),
  limestoneFraction: proportion(DESCRIPTIONS.LIMESTONEFRACTION),
  herbicideUse: z.number().meta({
    description:
      'Total amount of active ingredients from general herbicide/pesticide use, in kg (kilogram)',
  }),
  glyphosateOtherHerbicideUse: z.number().meta({
    description:
      'Total amount of active ingredients from other herbicide use (Paraquat, Diquat, Glyphosate), in kg (kilogram)',
  }),
  electricityRenewable: proportion(DESCRIPTIONS.ELECTRICITY_RENEWABLE),
  electricityUse: z
    .number()
    .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
  electricitySource: z
    .enum(ElectricitySources)
    .meta({ description: DESCRIPTIONS.ELECTRICITY_SOURCE }),
  fuel: FuelInputSchema.meta({ description: DESCRIPTIONS.FUEL }),
  fluidWaste: z
    .array(FluidWasteInputSchema)
    .meta({ description: DESCRIPTIONS.FLUID_WASTE }),
  solidWaste: SolidWasteInputSchema.meta({
    description: DESCRIPTIONS.SOLID_WASTE,
  }),
  inboundFreight: z
    .array(FreightInputSchema)
    .meta({ description: DESCRIPTIONS.INBOUND_FREIGHT }),
  outboundFreight: z
    .array(FreightInputSchema)
    .meta({ description: DESCRIPTIONS.OUTBOUND_FREIGHT }),
  totalCommercialFlightsKm: z
    .number()
    .meta({ description: DESCRIPTIONS.TOTAL_COMMERCIAL_FLIGHTS_KM }),
});

export type VineyardCrop = z.infer<typeof VineyardCropSchema>;
