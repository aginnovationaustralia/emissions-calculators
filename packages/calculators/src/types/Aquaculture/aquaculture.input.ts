import {
  AquacultureProductionSystem,
  ElectricitySources,
  States,
} from '@/types/enums';
import { z } from 'zod';
import { FluidWasteInputSchema } from '../common/fluid-waste.input';
import { FreightInputSchema } from '../common/freight.input';
import { SolidWasteInputSchema } from '../common/solid-waste.input';
import { DESCRIPTIONS } from '../descriptions.schema';
import { FuelInputSchema } from '../fuel.input';
import { RefrigerantInputSchema } from '../refrigerant.input';
import { proportion, singleEnterpriseInput } from '../schemas';
import { AquacultureBaitPurchaseSchema } from './baitpurchase.input';
import { AquacultureCustomBaitPurchaseSchema } from './custombaitpurchase.input';

export const AquacultureEnterpriseInputSchema = singleEnterpriseInput(
  'Aquaculture',
  {
    state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
    productionSystem: z
      .enum(AquacultureProductionSystem)
      .meta({ description: DESCRIPTIONS.AQUACULTURE_PRODUCTION_SYSTEM }),
    totalHarvestKg: z.number().meta({ description: 'Total harvest in kg' }),
    refrigerants: z
      .array(RefrigerantInputSchema)
      .meta({ description: DESCRIPTIONS.REFRIGERANT }),
    bait: z
      .array(AquacultureBaitPurchaseSchema)
      .meta({ description: DESCRIPTIONS.AQUACULTURE_BAIT }),
    customBait: z
      .array(AquacultureCustomBaitPurchaseSchema)
      .meta({ description: DESCRIPTIONS.AQUACULTURE_CUSTOM_BAIT }),
    inboundFreight: z
      .array(FreightInputSchema)
      .meta({ description: DESCRIPTIONS.INBOUND_FREIGHT }),
    outboundFreight: z
      .array(FreightInputSchema)
      .meta({ description: DESCRIPTIONS.OUTBOUND_FREIGHT }),
    totalCommercialFlightsKm: z
      .number()
      .meta({ description: DESCRIPTIONS.TOTAL_COMMERCIAL_FLIGHTS_KM }),
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
    carbonOffsets: z
      .number()
      .optional()
      .meta({ description: DESCRIPTIONS.CARBON_OFFSETS }),
  },
);

export type AquacultureEnterpriseInput = z.infer<
  typeof AquacultureEnterpriseInputSchema
>;
