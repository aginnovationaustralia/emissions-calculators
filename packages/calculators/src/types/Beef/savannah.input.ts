import {
  FireSeasons,
  Fuels,
  Patchinesses,
  RainfallZones,
  VegetationClasses,
} from '@/types/enums';
import { z } from 'zod';

export const SavannahBurningSchema = z
  .object({
    fuel: z
      .enum(Fuels)
      .default('coarse')
      .meta({ description: 'The fuel class size that was burnt' }),
    season: z.enum(FireSeasons).default('early dry season').meta({
      description:
        'The time relative to the fire season in which the burning took place',
    }),
    patchiness: z.enum(Patchinesses).default('high').meta({
      description: 'The patchiness of the savannah/vegetation that was burnt',
    }),
    rainfallZone: z.enum(RainfallZones).default('low').meta({
      description: 'The rainfall zone in which the burning took place',
    }),
    yearsSinceLastFire: z
      .number()
      .default(0)
      .meta({ description: 'Time since the last fire, in years' }),
    fireScarArea: z.number().default(0).meta({
      description: 'The total area of the fire scar, in ha (hectares)',
    }),
    vegetation: z
      .enum(VegetationClasses)
      .default('Melaleuca woodland')
      .meta({ description: 'The vegetation class that was burnt' }),
  })
  .meta({
    description:
      'Inputs required for any savannah burning activities that took place',
  });

export type SavannahBurning = z.infer<typeof SavannahBurningSchema>;
