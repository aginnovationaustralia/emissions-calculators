import { DESCRIPTIONS } from '@/calculators/Grains/types/descriptions.schema';
import {
  AviationFuelTypes,
  CarsLightCommercialFuelTypes,
  CarsLightCommercialPre2004FuelTypes,
  HeavyDutyFuelTypes,
  LightDutyFuelTypes,
  OffRoadAgricultureAndForestryEquipmentFuelTypes,
  VesselFuelTypes,
} from '@/constants/enums';
import { input } from '@/tools/inputs';
import { cubicMetresToLitres } from '@/tools/unit-conversion';
import { volume } from '@/tools/units';
import { object, z } from 'zod';

const AmountLitresSchema = object({
  amountLitres: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.FUEL_CONSUMPTION })
    .transform((a) => input(`AMOUNT_LITRES[${a}]`, volume('Fuel', a))),
});
const AmountCubicMetresSchema = object({
  amountCubicMetres: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.FUEL_CONSUMPTION })
    .transform((a) =>
      input(`AMOUNT_LITRES[${a}]`, volume('Fuel', cubicMetresToLitres(a))),
    ),
});

const TransportFuelCarsLightCommercialSchema = object({
  vehicleType: z.literal('Cars and light commercial vehicles'),
  fuelType: z.enum(CarsLightCommercialFuelTypes),
  ...AmountLitresSchema.shape,
});

const TransportFuelCarsLightCommercialPre2004Schema = object({
  vehicleType: z.literal('Cars and light commercial vehicles (pre 2004)'),
  fuelType: z.enum(CarsLightCommercialPre2004FuelTypes),
  ...AmountLitresSchema.shape,
});

export const isTransportFuelCNGBased = (
  fuel: TransportFuelInputTransformed,
): fuel is TransportFuelCNGTransformed => {
  return 'amountCubicMetres' in fuel;
};

const TransportFuelCNGSchema = object({
  vehicleType: z.enum(['Light duty vehicles', 'Heavy duty vehicles']),
  fuelType: z.literal('Compressed natural gas'),
  ...AmountCubicMetresSchema.shape,
});
const TransportFuelLightDutySchema = object({
  vehicleType: z.literal('Light duty vehicles'),
  fuelType: z.enum(LightDutyFuelTypes),
  ...AmountLitresSchema.shape,
});

const TransportFuelHeavyDutySchema = object({
  vehicleType: z.literal('Heavy duty vehicles'),
  fuelType: z.enum(HeavyDutyFuelTypes),
  ...AmountLitresSchema.shape,
});

const TransportFuelAviationSchema = object({
  vehicleType: z.literal('Aviation'),
  fuelType: z.enum(AviationFuelTypes),
  ...AmountLitresSchema.shape,
});

const TransportFuelVesselSchema = object({
  vehicleType: z.literal('Vessel'),
  fuelType: z.enum(VesselFuelTypes),
  ...AmountLitresSchema.shape,
});

const TransportFuelOffRoadAgricultureAndForestryEquipmentSchema = object({
  vehicleType: z.literal('Off-road Agriculture and forestry equipment'),
  fuelType: z.enum(OffRoadAgricultureAndForestryEquipmentFuelTypes),
  ...AmountLitresSchema.shape,
});

const TransportFuelLitresInputSchema = z.discriminatedUnion('vehicleType', [
  TransportFuelCarsLightCommercialSchema,
  TransportFuelCarsLightCommercialPre2004Schema,
  TransportFuelLightDutySchema,
  TransportFuelHeavyDutySchema,
  TransportFuelAviationSchema,
  TransportFuelVesselSchema,
  TransportFuelOffRoadAgricultureAndForestryEquipmentSchema,
]);
export const TransportFuelInputSchema = z.xor([
  TransportFuelLitresInputSchema,
  TransportFuelCNGSchema,
]);

export type TransportFuelInput = z.input<typeof TransportFuelInputSchema>;
export type TransportFuelInputTransformed = z.output<
  typeof TransportFuelInputSchema
>;

export type TransportFuelInputCarsLightCommercialTransformed = z.output<
  typeof TransportFuelCarsLightCommercialSchema
>;
export type TransportFuelInputCarsLightCommercialPre2004Transformed = z.output<
  typeof TransportFuelCarsLightCommercialPre2004Schema
>;
export type TransportFuelInputLightDutyTransformed = z.output<
  typeof TransportFuelLightDutySchema
>;
export type TransportFuelInputHeavyDutyTransformed = z.output<
  typeof TransportFuelHeavyDutySchema
>;
export type TransportFuelInputAviationTransformed = z.output<
  typeof TransportFuelAviationSchema
>;
export type TransportFuelInputVesselTransformed = z.output<
  typeof TransportFuelVesselSchema
>;
export type TransportFuelInputOffRoadAgricultureAndForestryEquipmentTransformed =
  z.output<typeof TransportFuelOffRoadAgricultureAndForestryEquipmentSchema>;

export type TransportFuelLitresInputTransformed = z.output<
  typeof TransportFuelLitresInputSchema
>;
export type TransportFuelCNGTransformed = z.output<
  typeof TransportFuelCNGSchema
>;
