import { input } from '@/tools/inputs';
import { tonnesToKg } from '@/tools/unit-conversion';
import { mass } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const BurningInputSchema = object({
  emissionsFromBurningLowRainfallZone: z
    .number()
    .meta({
      description:
        'Emissions from biomass burning in the Low Rainfall Zone, in tonnes-CO2e',
    })
    .transform((val) => input('ELRZ,i,y', mass('CO2e', tonnesToKg(val)))),
  emissionsFromBurningHighRainfallZone: z
    .number()
    .meta({
      description:
        'Emissions from biomass burning in the High Rainfall Zone, in tonnes-CO2e',
    })
    .transform((val) => input('EHRZ,i,y', mass('CO2e', tonnesToKg(val)))),
  carbonStockChangeLowRainfallZone: z
    .number()
    .meta({
      description:
        'Change in carbon stock in the Low Rainfall Zone for the activity area, in tonnes-CO2e',
    })
    .transform((val) => input('CLRZ,i,y', mass('CO2e', tonnesToKg(val)))),
  carbonStockChangeHighRainfallZone: z
    .number()
    .meta({
      description:
        'Change in carbon stock in the High Rainfall Zone for the activity area, in tonnes-CO2e',
    })
    .transform((val) => input('CHRZ,i,y', mass('CO2e', tonnesToKg(val)))),
});

export type BurningInput = z.input<typeof BurningInputSchema>;
export type BurningInputTransformed = z.output<typeof BurningInputSchema>;
