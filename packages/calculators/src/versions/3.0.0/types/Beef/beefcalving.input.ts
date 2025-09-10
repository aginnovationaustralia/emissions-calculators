import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

@SchemaDescription('Fraction of cows calving in each season, between 0 and 1')
export class BeefCalving {
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
