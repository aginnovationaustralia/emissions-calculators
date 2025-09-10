import { IsDefined, IsNumber, IsOptional } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';

export class SheepSeason {
  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.HEAD)
  @IsDefined()
  head!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.LIVEWEIGHT)
  @IsDefined()
  liveweight!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.LIVEWEIGHTGAIN)
  @IsDefined()
  liveweightGain!: number;

  @IsNumber()
  @IsOptional()
  @SchemaDescription(DESCRIPTIONS.CRUDEPROTEIN)
  crudeProtein?: number;

  @IsNumber()
  @IsOptional()
  @SchemaDescription(DESCRIPTIONS.DRYMATTERDIGESTIBILITY)
  dryMatterDigestibility?: number;

  @IsNumber()
  @IsOptional()
  @SchemaDescription(DESCRIPTIONS.FEEDAVAILABILITY)
  feedAvailability?: number;
}
