import {
  AviationFuelTypes,
  CarsLightCommercialFuelTypes,
  CarsLightCommercialPre2004FuelTypes,
  HeavyDutyFuelTypes,
  LightDutyFuelTypes,
  OffRoadAgricultureAndForestryEquipmentFuelTypes,
  VesselFuelTypes,
} from '@/constants/enums';
import { enumInput, literalInput, numberInput } from '@/tools/inputs';
import { locateTransportFuel } from '@/tools/modules';
import {
  cubicMetresToLitres,
  kilolitresToLitres,
} from '@/tools/unit-conversion';
import { volume } from '@/tools/units';
import { DESCRIPTIONS } from '@/types/descriptions.schema';
import { object, z } from 'zod';

const amountKilolitresSchema = locateTransportFuel(({ modules }) =>
  object({
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
  }),
);

const amountCubicMetresSchema = locateTransportFuel(({ modules }) =>
  object({
    amountCubicMetres: numberInput(
      (a) => volume('Fuel', cubicMetresToLitres(a)),
      {
        name: 'Qscq (m3)',
        method: '1',
        description: DESCRIPTIONS.FUEL_CONSUMPTION,
        modules,
      },
      (s) => s.min(0),
    ),
  }),
);

const transportFuelCarsLightCommercialSchema = locateTransportFuel(
  ({ location, modules }) =>
    amountKilolitresSchema(location)
      .safeExtend({
        vehicleType: z.literal('Cars and light commercial vehicles'),
        fuelType: enumInput(CarsLightCommercialFuelTypes, {
          name: 'Transport light commercial fuel type',
          description:
            'Type of fuel used by cars and light commercial vehicles',
          modules,
        }),
      })
      .meta({ title: 'Cars and light commercial vehicles' }),
);

const transportFuelCarsLightCommercialPre2004Schema = locateTransportFuel(
  ({ location, modules }) =>
    amountKilolitresSchema(location)
      .safeExtend({
        vehicleType: z.literal('Cars and light commercial vehicles (pre 2004)'),
        fuelType: enumInput(CarsLightCommercialPre2004FuelTypes, {
          name: 'Transport light commercial (pre 2004) fuel type',
          description:
            'Type of fuel used by cars and light commercial vehicles manufactured before 2004',
          modules,
        }),
      })
      .meta({ title: 'Cars and light commercial vehicles (pre 2004)' }),
);

export const isTransportFuelCNGBased = (
  fuel: TransportFuelInputTransformed,
): fuel is TransportFuelCNGTransformed => {
  return 'amountCubicMetres' in fuel;
};

const transportFuelCNGSchema = locateTransportFuel(({ location, modules }) =>
  object({
    vehicleType: z.union([
      z.literal('Light duty vehicles'),
      z.literal('Heavy duty vehicles'),
    ]),
    fuelType: literalInput('Compressed natural gas', {
      name: 'Transport CNG fuel type',
      description: 'Type of compressed natural gas fuel used by this vehicle',
      modules,
    }),
    ...amountCubicMetresSchema(location).shape,
  }).meta({ title: 'Compressed natural gas (CNG)' }),
);

const transportFuelLightDutySchema = locateTransportFuel(
  ({ location, modules }) =>
    amountKilolitresSchema(location)
      .safeExtend({
        vehicleType: z.literal('Light duty vehicles'),
        fuelType: enumInput(LightDutyFuelTypes, {
          name: 'Transport light duty fuel type',
          description: 'Type of fuel used by light duty vehicles',
          modules,
        }),
      })
      .meta({ title: 'Light duty vehicles' }),
);

const transportFuelHeavyDutySchema = locateTransportFuel(
  ({ location, modules }) =>
    amountKilolitresSchema(location)
      .safeExtend({
        vehicleType: z.literal('Heavy duty vehicles'),
        fuelType: enumInput(HeavyDutyFuelTypes, {
          name: 'Transport heavy duty fuel type',
          description: 'Type of fuel used by heavy duty vehicles',
          modules,
        }),
      })
      .meta({ title: 'Heavy duty vehicles' }),
);

const transportFuelAviationSchema = locateTransportFuel(
  ({ location, modules }) =>
    amountKilolitresSchema(location)
      .safeExtend({
        vehicleType: z.literal('Aviation'),
        fuelType: enumInput(AviationFuelTypes, {
          name: 'Transport aviation fuel type',
          description: 'Type of fuel used by aircraft',
          modules,
        }),
      })
      .meta({ title: 'Aviation' }),
);

const transportFuelVesselSchema = locateTransportFuel(({ location, modules }) =>
  amountKilolitresSchema(location)
    .safeExtend({
      vehicleType: z.literal('Vessel'),
      fuelType: enumInput(VesselFuelTypes, {
        name: 'Transport vessel fuel type',
        description: 'Type of fuel used by this vessel',
        modules,
      }),
    })
    .meta({ title: 'Vessel' }),
);

const transportFuelOffRoadAgricultureAndForestryEquipmentSchema =
  locateTransportFuel(({ location, modules }) =>
    amountKilolitresSchema(location)
      .safeExtend({
        vehicleType: z.literal('Off-road Agriculture and forestry equipment'),
        fuelType: enumInput(OffRoadAgricultureAndForestryEquipmentFuelTypes, {
          name: 'Transport equipment fuel type',
          description:
            'Type of fuel used by off-road agriculture and forestry equipment',
          modules,
        }),
      })
      .meta({ title: 'Off-road agriculture and forestry equipment' }),
  );

const transportFuelLitresInputSchema = locateTransportFuel(({ location }) =>
  z
    .discriminatedUnion('vehicleType', [
      transportFuelCarsLightCommercialSchema(location),
      transportFuelCarsLightCommercialPre2004Schema(location),
      transportFuelLightDutySchema(location),
      transportFuelHeavyDutySchema(location),
      transportFuelAviationSchema(location),
      transportFuelVesselSchema(location),
      transportFuelOffRoadAgricultureAndForestryEquipmentSchema(location),
    ])
    .meta({ title: 'Litres-based fuel' }),
);

export const transportFuelInputSchema = locateTransportFuel(({ location }) =>
  z.xor([
    transportFuelLitresInputSchema(location),
    transportFuelCNGSchema(location),
  ]),
);

export type TransportFuelInput = z.input<
  ReturnType<typeof transportFuelInputSchema>
>;
export type TransportFuelInputTransformed = z.output<
  ReturnType<typeof transportFuelInputSchema>
>;

export type TransportFuelInputCarsLightCommercialTransformed = z.output<
  ReturnType<typeof transportFuelCarsLightCommercialSchema>
>;
export type TransportFuelInputCarsLightCommercialPre2004Transformed = z.output<
  ReturnType<typeof transportFuelCarsLightCommercialPre2004Schema>
>;
export type TransportFuelInputLightDutyTransformed = z.output<
  ReturnType<typeof transportFuelLightDutySchema>
>;
export type TransportFuelInputHeavyDutyTransformed = z.output<
  ReturnType<typeof transportFuelHeavyDutySchema>
>;
export type TransportFuelInputAviationTransformed = z.output<
  ReturnType<typeof transportFuelAviationSchema>
>;
export type TransportFuelInputVesselTransformed = z.output<
  ReturnType<typeof transportFuelVesselSchema>
>;
export type TransportFuelInputOffRoadAgricultureAndForestryEquipmentTransformed =
  z.output<
    ReturnType<typeof transportFuelOffRoadAgricultureAndForestryEquipmentSchema>
  >;

export type TransportFuelLitresInputTransformed = z.output<
  ReturnType<typeof transportFuelLitresInputSchema>
>;
export type TransportFuelCNGTransformed = z.output<
  ReturnType<typeof transportFuelCNGSchema>
>;
