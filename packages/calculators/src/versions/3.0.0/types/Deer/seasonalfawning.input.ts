import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

@SchemaDescription('Seasonal fawning rates, from 0 to 1')
export class SeasonalFawningRates {
  @IsNumber()
  @IsDefined()
  spring!: number;

  @IsNumber()
  @IsDefined()
  summer!: number;

  @IsNumber()
  @IsDefined()
  autumn!: number;

  @IsNumber()
  @IsDefined()
  winter!: number;
}
