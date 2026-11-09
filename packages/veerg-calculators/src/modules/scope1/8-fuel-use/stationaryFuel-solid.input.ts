import { FuelStationarySolidTypes } from '@/constants/enums';
import { enumInput, numberInput } from '@/tools/inputs';
import { locateStationaryFuel } from '@/tools/modules';
import { tonnesToKg } from '@/tools/unit-conversion';
import { mass } from '@/tools/units';
import { DESCRIPTIONS } from '@/types/descriptions.schema';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const stationaryFuelSolidInputSchema = locateStationaryFuel(
  ({ modules }) =>
    object({
      fuelClass: z.literal('Solid fuels'),
      fuelType: enumInput(FuelStationarySolidTypes, {
        name: 'Stationary solid fuel type',
        description: 'Type of solid fuel used in stationary equipment',
        modules,
      }),
      amountTonnes: numberInput(
        (a) => mass('Fuel', tonnesToKg(a)),
        {
          name: 'Qscq (t)',
          method: '1',
          description: DESCRIPTIONS.FUEL_CONSUMPTION,
          modules,
        },
        (s) => s.min(0),
      ),
    }).meta({ title: 'Solid fuels' }),
);

export type StationaryFuelSolidInputTransformed = z.output<
  ReturnType<typeof stationaryFuelSolidInputSchema>
>;
