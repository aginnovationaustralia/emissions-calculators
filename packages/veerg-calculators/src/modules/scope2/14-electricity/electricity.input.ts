import { z } from 'zod';
import { LocationBasedElectricityInputsSchema } from './location-based.input';
import {
  MarketBasedElectricityInputsSchema,
  MarketBasedElectricityInputsTransformed,
} from './market-based.input';

export const isMarketBasedElectricity = (
  input: ElectricityInputsTransformed,
): input is MarketBasedElectricityInputsTransformed =>
  input.method === 'market';

export const ElectricityInputsSchema = z.discriminatedUnion('method', [
  LocationBasedElectricityInputsSchema,
  MarketBasedElectricityInputsSchema,
]);

export type ElectricityInputs = z.input<typeof ElectricityInputsSchema>;
export type ElectricityInputsTransformed = z.output<
  typeof ElectricityInputsSchema
>;
