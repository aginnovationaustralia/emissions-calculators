import { FuelStationaryGaseousTypes } from '@/constants/enums';
import { enumInput, numberInput } from '@/tools/inputs';
import { locateStationaryFuel } from '@/tools/modules';
import { cubicMetresToLitres } from '@/tools/unit-conversion';
import { volume } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const stationaryFuelNaturalGasInputSchema = locateStationaryFuel(
  ({ modules }) =>
    object({
      fuelClass: z.literal('Gaseous fuels'),
      fuelType: enumInput(FuelStationaryGaseousTypes, {
        name: 'Stationary gaseous fuel type',
        description:
          'Type of gaseous fuel used in stationary equipment. Natural gas is natural gas distributed in a pipeline',
        modules,
      }),
      amountCubicMetres: numberInput(
        (a) => volume('Fuel', cubicMetresToLitres(a)),
        {
          name: 'Qscq (m3)',
          method: '1',
          description: 'Volume of gas consumed by stationary equipment',
          modules,
        },
        (s) => s.min(0),
      ),
    }).meta({ title: 'Gaseous fuels' }),
);

export type StationaryFuelNaturalGasInputTransformed = z.output<
  ReturnType<typeof stationaryFuelNaturalGasInputSchema>
>;
