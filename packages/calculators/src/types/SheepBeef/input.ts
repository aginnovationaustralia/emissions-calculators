import { States } from '@/types/enums';
import { z } from 'zod';
import { BeefCompleteSchema } from '../Beef/beef.input';
import {
  BeefSavannahBurning,
  BeefSavannahBurningSchema,
} from '../Beef/beefsavannah.input';
import { DESCRIPTIONS } from '../descriptions.schema';
import { calculatorInput } from '../schemas';
import { SheepCompleteSchema } from '../Sheep/sheep.input';
import { TemporarySavannahInputSchema } from './temporary-savannah.input';
import { SheepBeefVegetationSchema } from './vegetation.input';

export const SheepBeefInputSchema = calculatorInput('SheepBeef', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  northOfTropicOfCapricorn: z
    .boolean()
    .meta({ description: DESCRIPTIONS.NORTHOFTROPIC }),
  rainfallAbove600: z
    .boolean()
    .meta({ description: DESCRIPTIONS.RAINFALLABOVE600 }),
  beef: z.array(BeefCompleteSchema),
  sheep: z.array(SheepCompleteSchema),
  burning: z.union([
    z.array(BeefSavannahBurningSchema),
    z.array(
      TemporarySavannahInputSchema.transform(
        (legacyBurn): BeefSavannahBurning => {
          return {
            allocationToBeef: legacyBurn.allocationToBeef,
            burning: {
              fireScarArea: legacyBurn.fireScarArea,
              fuel: legacyBurn.fuel,
              season: legacyBurn.season,
              patchiness: legacyBurn.patchiness,
              rainfallZone: legacyBurn.rainfallZone,
              yearsSinceLastFire: legacyBurn.yearsSinceLastFire,
              vegetation: legacyBurn.vegetation,
            },
          };
        },
      ),
    ),
  ]),
  vegetation: z.array(SheepBeefVegetationSchema).default([]),
});

export type SheepBeefInput = z.input<typeof SheepBeefInputSchema>;
export type SheepBeefInputTransformed = z.output<typeof SheepBeefInputSchema>;
