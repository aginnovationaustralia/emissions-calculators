import {
  FuelStationaryMassBasedLiquidTypes,
  FuelStationaryVolumeBasedLiquidTypes,
} from '@/calculators/Grains/constants/enums';
import { DESCRIPTIONS } from '@/calculators/Grains/types/descriptions.schema';
import { input } from '@/tools/inputs';
import { tonnesToKg } from '@/tools/unit-conversion';
import { mass, volume } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const isStationaryLiquidFuelMassBased = (
  fuel: StationaryFuelLiquidInputTransformed,
): fuel is StationaryFuelLiquidMassBasedInputTransformed => {
  return 'amountTonnes' in fuel;
};
const StationaryFuelLiquidInputLitresSchema = object({
  fuelClass: z.literal('Liquid fuels'),
  fuelType: z.enum(FuelStationaryVolumeBasedLiquidTypes),
  amountLitres: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.FUEL_CONSUMPTION })
    .transform((a) => input(`AMOUNT_LITRES[${a}]`, volume('Fuel', a))),
});
const StationaryFuelLiquidInputMassBasedSchema = object({
  fuelClass: z.literal('Liquid fuels'),
  fuelType: z.enum(FuelStationaryMassBasedLiquidTypes),
  amountTonnes: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.FUEL_CONSUMPTION })
    .transform((a) =>
      input(`AMOUNT_TONNES[${a}]`, mass('Fuel', tonnesToKg(a))),
    ),
});
export const StationaryFuelLiquidInputSchema = z.discriminatedUnion(
  'fuelType',
  [
    StationaryFuelLiquidInputLitresSchema,
    StationaryFuelLiquidInputMassBasedSchema,
  ],
);

export type StationaryFuelLiquidInputTransformed = z.output<
  typeof StationaryFuelLiquidInputSchema
>;

export type StationaryFuelLiquidInputMassBasedTransformed = z.output<
  typeof StationaryFuelLiquidInputMassBasedSchema
>;

export type StationaryFuelLiquidMassBasedInputTransformed = z.output<
  typeof StationaryFuelLiquidInputMassBasedSchema
>;
