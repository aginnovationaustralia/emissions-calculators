import { ElectricitySources, States } from '@/types/types';
import { z } from 'zod';
import { FluidWasteInputSchema } from '../common/fluid-waste.input';
import { FreightInputSchema } from '../common/freight.input';
import { SolidWasteInputSchema } from '../common/solid-waste.input';
import { DESCRIPTIONS } from '../descriptions.schema';
import { FuelInputSchema } from '../fuel.input';
import { RefrigerantInputSchema } from '../refrigerant.input';
import { proportion, singleEnterpriseInput } from '../schemas';
import { WildCatchFisheryBaitPurchaseSchema } from './baitpurchase.input';
import { WildCatchFisheryCustomBaitPurchaseSchema } from './custombaitpurchase.input';

export enum WildCatchFisheryProductionSystem {
  ABALONE = 'Abalone',
  CRAB_FISHING = 'Crab Fishing',
  DEMERSAL_TRAWL = 'Demersal Trawl',
  GILLNET = 'Gillnet',
  HANDLINE = 'Handline',
  LOBSTER_POT = 'Lobster Pot',
  LONGLINE = 'Longline',
  NORTHERN_FISH_TRAP = 'Northern Fish Trap',
  NORTHERN_PRAWN_TRAWL = 'Northern Prawn trawl',
  OTTER_BOARD_TRAWL = 'Otter Board Trawl',
  PRAWN_TRAWL_AUS_AVERAGE = 'Prawn trawl Australian average',
  PURSE_SEINE = 'Purse seine',
  SOUTHERN_OCEAN_LONGLINE = 'Southern Ocean Longline',
}

export const WildCatchFisheryEnterpriseInputSchema = singleEnterpriseInput(
  'WildCatchFishery',
  {
    state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
    productionSystem: z.enum(WildCatchFisheryProductionSystem).meta({
      description: 'Production system of the wild catch fishery enterprise',
    }),
    totalHarvestKg: z.number().meta({ description: 'Total harvest in kg' }),
    refrigerants: z
      .array(RefrigerantInputSchema)
      .meta({ description: DESCRIPTIONS.REFRIGERANT }),
    bait: z
      .array(WildCatchFisheryBaitPurchaseSchema)
      .meta({ description: DESCRIPTIONS.AQUACULTURE_BAIT }),
    customBait: z
      .array(WildCatchFisheryCustomBaitPurchaseSchema)
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

export type WildCatchFisheryEnterpriseInput = z.infer<
  typeof WildCatchFisheryEnterpriseInputSchema
>;
