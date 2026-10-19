import { locateStationaryFuel } from '@/tools/modules';
import { z } from 'zod';
import {
  stationaryFuelLiquidInputSchema,
  StationaryFuelLiquidInputTransformed,
} from './stationaryFuel-liquid.input';
import { stationaryFuelNaturalGasInputSchema } from './stationaryFuel-naturalGas.input';
import {
  stationaryFuelSolidInputSchema,
  StationaryFuelSolidInputTransformed,
} from './stationaryFuel-solid.input';

export const isStationaryFuelSolid = (
  fuel: StationaryFuelInputTransformed,
): fuel is StationaryFuelSolidInputTransformed => {
  return fuel.fuelClass === 'Solid fuels';
};

export const isStationaryFuelLiquid = (
  fuel: StationaryFuelInputTransformed,
): fuel is StationaryFuelLiquidInputTransformed => {
  return fuel.fuelClass === 'Liquid fuels';
};

export const stationaryFuelInputSchema = locateStationaryFuel(({ location }) =>
  z.discriminatedUnion('fuelClass', [
    stationaryFuelSolidInputSchema(location),
    stationaryFuelLiquidInputSchema(location),
    stationaryFuelNaturalGasInputSchema(location),
  ]),
);

export type StationaryFuelInput = z.input<
  ReturnType<typeof stationaryFuelInputSchema>
>;
export type StationaryFuelInputTransformed = z.output<
  ReturnType<typeof stationaryFuelInputSchema>
>;
