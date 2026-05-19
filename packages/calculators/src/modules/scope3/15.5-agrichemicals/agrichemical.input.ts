import { AgrochemicalType, AgrochemicalTypes } from '@/constants/enums';
import { input } from '@/tools/inputs';
import { mass, massPerMass } from '@/tools/units';
import { object } from '@/types/schemas';
import { mapOptional } from '@/tools/zod';
import { z } from 'zod';

export const AgrichemicalInputSchema = object({
  type: z
    .literal(AgrochemicalTypes)
    .transform((val) => input('agrichemical type', val as AgrochemicalType)),
  amountKg: z
    .number()
    .min(0)
    // TODO: check what these strings should be
    .transform((val) => input('agrichemical amount', mass('Chemical', val))),
  customEmissionsFactor: z
    .number()
    .min(0)
    .optional()
    .transform(
      mapOptional((val) =>
        val ? input('EF', massPerMass('CO2e', 'Chemical', val)) : undefined,
      ),
    ),
});

export type AgrichemicalInput = z.input<typeof AgrichemicalInputSchema>;
export type AgrichemicalInputTransformed = z.output<
  typeof AgrichemicalInputSchema
>;
