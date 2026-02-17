import { TransportFuelTypes } from '@/calculators/Grains/constants/enums';
import { DESCRIPTIONS } from '@/calculators/Grains/types/descriptions.schema';
import { input } from '@/tools/inputs';
import { volume } from '@/tools/units';
import { object, z } from 'zod';

// const reverseTransportFuelKeys = swapObjectKeysAndValues(TransportFuelTypes);
// const convertTransportFuelType = (
//   fuelType: TransportFuelTypes,
// ): keyof typeof TransportFuelTypes => {
//   return reverseTransportFuelKeys[fuelType];
// };

export const TransportFuelInputSchema = object({
  type: z
    .enum(TransportFuelTypes)
    .meta({ description: DESCRIPTIONS.FUEL_TYPE }),
  // .transform((t) =>
  //   input(`TRANSPORT_FUEL[${t}]`, convertTransportFuelType(t)),
  // ),
  amountLitres: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.FUEL_CONSUMPTION })
    .transform((a) => input(`AMOUNT_LITRES[${a}]`, volume('Fuel', a))),
});

export type TransportFuelInput = z.input<typeof TransportFuelInputSchema>;
export type TransportFuelInputTransformed = z.output<
  typeof TransportFuelInputSchema
>;
