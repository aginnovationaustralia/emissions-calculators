import { z } from 'zod';
import {
  StationaryFuelLiquidInputSchema,
  StationaryFuelLiquidInputTransformed,
} from './stationaryFuel-liquid.input';
import { StationaryFuelNaturalGasInputSchema } from './stationaryFuel-naturalGas.input';
import {
  StationaryFuelSolidInputSchema,
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

export const StationaryFuelInputSchema = z.discriminatedUnion('fuelClass', [
  StationaryFuelSolidInputSchema,
  StationaryFuelLiquidInputSchema,
  StationaryFuelNaturalGasInputSchema,
]);

export type StationaryFuelInput = z.input<typeof StationaryFuelInputSchema>;
export type StationaryFuelInputTransformed = z.output<
  typeof StationaryFuelInputSchema
>;
