import { IsNumber, IsOptional } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

@SchemaDescription('Areas in hectares (ha)')
export class AreaUsed {
  @IsNumber()
  @IsOptional()
  croppedDryland: number = 0;

  @IsNumber()
  @IsOptional()
  croppedIrrigated: number = 0;

  @IsNumber()
  @IsOptional()
  improvedPastureDryland: number = 0;

  @IsNumber()
  @IsOptional()
  improvedPastureIrrigated: number = 0;
}
