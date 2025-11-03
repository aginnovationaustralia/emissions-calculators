import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { proportion, singleEnterpriseInput } from '../schemas';
import { ElectricitySources, States } from '../types';
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
      .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
    totalWholeWeightCaught: z
      .number()
      .meta({ description: 'Total whole weight caught in kg' }),
    diesel: z.number().meta({ description: DESCRIPTIONS.DIESEL }),
    petrol: z.number().meta({ description: DESCRIPTIONS.PETROL }),
    lpg: z.number().meta({ description: DESCRIPTIONS.LPG }),
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
    carbonOffset: z.number().meta({
      description:
        'Carbon offsets purchased, in t CO2. Offsetting 2 t CO2 would be 2.0 (not -2.0)',
    }),
  },
);

export type WildSeaFisheriesEnterprise = z.infer<
  typeof WildSeaFisheriesEnterpriseSchema
>;
