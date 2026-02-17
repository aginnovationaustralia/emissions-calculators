import { z } from 'zod';
import { LocationBasedElectricityInputsSchema } from './location-based.input';
import {
  MarketBasedElectricityInputsSchema,
  MarketBasedElectricityInputsTransformed,
} from './market-based.input';

export const isMarketBasedElectricity = (
  input: ElectricityInputsTransformed,
): input is MarketBasedElectricityInputsTransformed =>
  'recsSurrenderedKWh' in input;

export const ElectricityInputsSchema = z.xor([
  LocationBasedElectricityInputsSchema,
  MarketBasedElectricityInputsSchema,
]);

export type ElectricityInputs = z.input<typeof ElectricityInputsSchema>;
export type ElectricityInputsTransformed = z.output<
  typeof ElectricityInputsSchema
>;
