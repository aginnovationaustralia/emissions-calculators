import {
  FuelStationaryMassBasedLiquidTypes,
  FuelStationaryVolumeBasedLiquidTypes,
} from '@/constants/enums';
import { enumInput, numberInput } from '@/tools/inputs';
import { locateStationaryFuel } from '@/tools/modules';
import { kilolitresToLitres, tonnesToKg } from '@/tools/unit-conversion';
import { mass, volume } from '@/tools/units';
import { DESCRIPTIONS } from '@/types/descriptions.schema';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const isStationaryLiquidFuelMassBased = (
  fuel: StationaryFuelLiquidInputTransformed,
): fuel is StationaryFuelLiquidMassBasedInputTransformed => {
  return 'amountTonnes' in fuel;
};
const stationaryFuelLiquidInputLitresSchema = locateStationaryFuel(
  ({ modules }) =>
    object({
      fuelClass: z.literal('Liquid fuels'),
      fuelType: enumInput(FuelStationaryVolumeBasedLiquidTypes, {
        name: 'Stationary liquid fuel type',
        description: 'Type of liquid fuel used in stationary equipment',
        modules,
      }),
      amountKilolitres: numberInput(
        (a) => volume('Fuel', kilolitresToLitres(a)),
        {
          name: 'Qscq (kl)',
          method: '1',
          description: DESCRIPTIONS.FUEL_CONSUMPTION,
          modules,
        },
        (s) => s.min(0),
      ),
    }).meta({ title: 'Quantity by volume' }),
);
const stationaryFuelLiquidInputMassBasedSchema = locateStationaryFuel(
  ({ modules }) =>
    object({
      fuelClass: z.literal('Liquid fuels'),
      fuelType: enumInput(FuelStationaryMassBasedLiquidTypes, {
        name: 'Stationary liquid fuel type',
        description: 'Type of liquid fuel used in stationary equipment',
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
    }).meta({ title: 'Quantity by mass' }),
);
export const stationaryFuelLiquidInputSchema = locateStationaryFuel(
  ({ location }) =>
    z
      .discriminatedUnion('fuelType', [
        stationaryFuelLiquidInputLitresSchema(location),
        stationaryFuelLiquidInputMassBasedSchema(location),
      ])
      .meta({ title: 'Liquid fuels' }),
);

export type StationaryFuelLiquidInputTransformed = z.output<
  ReturnType<typeof stationaryFuelLiquidInputSchema>
>;

export type StationaryFuelLiquidInputMassBasedTransformed = z.output<
  ReturnType<typeof stationaryFuelLiquidInputMassBasedSchema>
>;

export type StationaryFuelLiquidMassBasedInputTransformed = z.output<
  ReturnType<typeof stationaryFuelLiquidInputMassBasedSchema>
>;
