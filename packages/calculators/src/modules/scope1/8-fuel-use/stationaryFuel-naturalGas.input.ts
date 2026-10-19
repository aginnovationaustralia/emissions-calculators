import { numberInput } from '@/tools/inputs';
import { locateStationaryFuel } from '@/tools/modules';
import { kilolitresToLitres } from '@/tools/unit-conversion';
import { volume } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const stationaryFuelNaturalGasInputSchema = locateStationaryFuel(
  ({ modules }) =>
    object({
      fuelClass: z.literal('Gaseous fuels'),
      fuelType: z.literal('Natural gas'),
      amountKilolitres: numberInput(
        (a) => volume('Fuel', kilolitresToLitres(a)),
        {
          name: 'Qscq (kl)',
          method: '1',
          description:
            'Quantity of natural gas consumed by stationary equipment',
          modules,
        },
        (s) => s.min(0),
      ),
    }).meta({ title: 'Gaseous fuels (natural gas)' }),
);

export type StationaryFuelNaturalGasInputTransformed = z.output<
  ReturnType<typeof stationaryFuelNaturalGasInputSchema>
>;
