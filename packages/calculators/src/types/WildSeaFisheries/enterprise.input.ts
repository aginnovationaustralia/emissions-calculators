import { ElectricitySources, States } from '@/types/enums';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { proportion, singleEnterpriseInput } from '../schemas';
import { WildSeaFisheriesBaitPurchaseSchema } from './baitpurchase.input';
import { WildSeaFisheriesCommercialFlightSchema } from './commercialflight.input';
import { WildSeaFisheriesCustomBaitPurchaseSchema } from './custombaitpurchase.input';
import { WildSeaFisheriesRefrigerantSchema } from './refrigerant.input';
import { WildSeaFisheriesTransportSchema } from './transport.input';

export const WildSeaFisheriesEnterpriseSchema = singleEnterpriseInput(
  'WildSeaFisheries',
  {
    state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
    electricitySource: z
      .enum(ElectricitySources)
      .meta({ description: DESCRIPTIONS.ELECTRICITY_SOURCE }),
    electricityRenewable: proportion(DESCRIPTIONS.ELECTRICITY_RENEWABLE),
    electricityUse: z
      .number()
      .min(0)
      .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
    totalWholeWeightCaught: z
      .number()
      .min(0)
      .meta({ description: 'Total whole weight caught in kg' }),
    diesel: z.number().min(0).meta({ description: DESCRIPTIONS.DIESEL }),
    petrol: z.number().min(0).meta({ description: DESCRIPTIONS.PETROL }),
    lpg: z.number().min(0).meta({ description: DESCRIPTIONS.LPG }),
    refrigerants: z.array(WildSeaFisheriesRefrigerantSchema),
    transports: z
      .array(WildSeaFisheriesTransportSchema)
      .meta({ description: 'Transportation' }),
    flights: z
      .array(WildSeaFisheriesCommercialFlightSchema)
      .meta({ description: 'CommercialFlight' }),
    bait: z
      .array(WildSeaFisheriesBaitPurchaseSchema)
      .meta({ description: 'Bait' }),
    custombait: z
      .array(WildSeaFisheriesCustomBaitPurchaseSchema)
      .meta({ description: 'Custom bait' }),
    carbonOffset: z.number().min(0).meta({
      description:
        'Carbon offsets purchased, in t CO2. Offsetting 2 t CO2 would be 2.0 (not -2.0)',
    }),
  },
);

export type WildSeaFisheriesEnterprise = z.infer<
  typeof WildSeaFisheriesEnterpriseSchema
>;
