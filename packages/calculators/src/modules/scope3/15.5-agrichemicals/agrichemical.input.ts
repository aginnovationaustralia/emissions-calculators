import { AgrochemicalType, AgrochemicalTypes } from '@/constants/enums';
import { input, numberInput, numberInputOptional } from '@/tools/inputs';
import { AGRICHEM_15_5 } from '@/tools/modules';
import { mass, massPerMass } from '@/tools/units';
import { object } from '@/types/schemas';
import { enumSchema } from '@/tools/enum-schemas';
import { z } from 'zod';

export const AgrichemicalInputSchema = object({
  type: enumSchema(AgrochemicalTypes).transform((val) =>
    input(val as AgrochemicalType, {
      name: 'agrichemical type',
      modules: [AGRICHEM_15_5],
    }),
  ),
  amountKg: numberInput(
    (val) => mass('Chemical', val),
    {
      name: 'agrichemical amount',
      description: 'Amount of this agrichemical purchased',
      modules: [AGRICHEM_15_5],
    },
    (s) => s.min(0),
  ),
  customEmissionsFactor: numberInputOptional(
    (val) => massPerMass('CO2e', 'Chemical', val),
    {
      name: 'EF',
      method: '2',
      scope: '3',
      description:
        'Method 2: supply a custom emissions factor for this agrichemical based on supplier records',
      modules: [AGRICHEM_15_5],
    },
    (s) => s.min(0),
  ),
});

export type AgrichemicalInput = z.input<typeof AgrichemicalInputSchema>;
export type AgrichemicalInputTransformed = z.output<
  typeof AgrichemicalInputSchema
>;
