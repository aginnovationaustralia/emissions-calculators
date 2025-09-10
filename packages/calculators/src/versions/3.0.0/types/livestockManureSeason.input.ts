import { IsNumber, IsOptional } from 'class-validator';
import { SchemaDescription } from './decorator.schema';
import { DESCRIPTIONS } from './descriptions.schema';

export class LivestockManureSeason {
  @IsNumber()
  @IsOptional()
  @SchemaDescription(DESCRIPTIONS.VOLATILESOLIDS_OUTDOORSYSTEMS)
  outdoorSystems?: number;

  @IsNumber()
  @IsOptional()
  @SchemaDescription(DESCRIPTIONS.VOLATILESOLIDS_COVEREDANAEROBICPOND)
  coveredAnaerobicPond?: number;

  @IsNumber()
  @IsOptional()
  @SchemaDescription(DESCRIPTIONS.VOLATILESOLIDS_UNCOVEREDANAEROBICPOND)
  uncoveredAnaerobicPond?: number;

  @IsNumber()
  @IsOptional()
  @SchemaDescription(DESCRIPTIONS.VOLATILESOLIDS_DEEPLITTER)
  deepLitter?: number;

  @IsNumber()
  @IsOptional()
  @SchemaDescription(DESCRIPTIONS.VOLATILESOLIDS_UNDEFINED)
  undefinedSystem?: number;
}
