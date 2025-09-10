import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

@SchemaDescription('Proportion of does fawning in each season, from 0 to 1')
export class DoesFawningProportion {
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
