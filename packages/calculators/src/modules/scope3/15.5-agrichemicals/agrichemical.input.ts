import { AgrochemicalTypes } from '@/calculators/Grains/constants/types';
import { input } from '@/tools/inputs';
import { mass, massPerMass } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const AgrichemicalInputSchema = object({
  type: z
    .literal(AgrochemicalTypes)
    .transform((val) => input('agrichemical type', val as AgrochemicalTypes)),
  amountKg: z
    .number()
    .min(0)
    .transform((val) => input('petrolUse', mass('Chemical', val))),
  customEmissionsFactor: z
    .number()
    .min(0)
    .optional()
    .transform((val) =>
      val ? input('lpg', massPerMass('CO2e', 'Chemical', val)) : undefined,
    ),
});

export type AgrichemicalInput = z.input<typeof AgrichemicalInputSchema>;
export type AgrichemicalInputTransformed = z.output<
  typeof AgrichemicalInputSchema
>;
