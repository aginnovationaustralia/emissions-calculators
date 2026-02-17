import {
  ServiceByAreaTypes,
  ServiceByHourTypes,
} from '@/calculators/Grains/constants/enums';
import { input } from '@/tools/inputs';
import { area, time } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const isServiceAreaBased = (
  service: ServiceInputTransformed,
): service is ServiceByAreaInputTransformed => {
  return service.serviceType in ServiceByAreaTypes;
};

export const ServiceByAreaInputSchema = object({
  areaServicedHa: z
    .number()
    .min(0)
    .transform((val) => input('areaServicedHa', area(val)))
    .meta({ description: 'Area serviced in hectares (ha)' }),
  serviceType: z
    .enum(ServiceByAreaTypes)
    .meta({ description: 'The type of area based service' }),
});

export const ServiceByHourInputSchema = object({
  serviceTimeHours: z
    .number()
    .min(0)
    .transform((val) => input('serviceTimeHours', time(val)))
    .meta({ description: 'Service time in hours' }),
  serviceType: z
    .enum(ServiceByHourTypes)
    .meta({ description: 'The type of time based service' }),
});

export const ServicesInputSchema = object({
  services: z.array(
    z.union([ServiceByAreaInputSchema, ServiceByHourInputSchema]),
  ),
});

export type ServicesInput = z.input<typeof ServicesInputSchema>;
export type ServicesInputTransformed = z.output<typeof ServicesInputSchema>;

export type ServiceByAreaInput = z.input<typeof ServiceByAreaInputSchema>;
export type ServiceByAreaInputTransformed = z.output<
  typeof ServiceByAreaInputSchema
>;

export type ServiceByHourInput = z.input<typeof ServiceByHourInputSchema>;
export type ServiceByHourInputTransformed = z.output<
  typeof ServiceByHourInputSchema
>;

export type ServiceInputTransformed =
  | ServiceByAreaInputTransformed
  | ServiceByHourInputTransformed;
