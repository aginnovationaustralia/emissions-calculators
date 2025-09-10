import { IsDefined, IsEnum, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import {
  FireSeason,
  FireSeasons,
  Fuel,
  Fuels,
  Patchiness,
  Patchinesses,
  RainfallZone,
  RainfallZones,
  VegetationClass,
  VegetationClasses,
} from '../types';

@SchemaDescription(
  'Inputs required for any savannah burning activities that took place',
)
export class SavannahBurning {
  @IsEnum(Fuels)
  @SchemaDescription('The fuel class size that was burnt')
  @IsDefined()
  fuel: Fuel = 'coarse';

  @IsEnum(FireSeasons)
  @SchemaDescription(
    'The time relative to the fire season in which the burning took place',
  )
  @IsDefined()
  season: FireSeason = 'early dry season';

  @IsEnum(Patchinesses)
  @SchemaDescription('The patchiness of the savannah/vegetation that was burnt')
  @IsDefined()
  patchiness: Patchiness = 'high';

  @IsEnum(RainfallZones)
  @SchemaDescription('The rainfall zone in which the burning took place')
  @IsDefined()
  rainfallZone: RainfallZone = 'low';

  @IsNumber()
  @SchemaDescription('Time since the last fire, in years')
  @IsDefined()
  yearsSinceLastFire: number = 0;

  @IsNumber()
  @SchemaDescription('The total area of the fire scar, in ha (hectares)')
  @IsDefined()
  fireScarArea: number = 0;

  @IsEnum(VegetationClasses)
  @SchemaDescription('The vegetation class that was burnt')
  @IsDefined()
  vegetation: VegetationClass = 'Melaleuca woodland';
}
